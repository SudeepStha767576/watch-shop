<?php
require_once 'includes/auth.php';
require_once 'includes/db.php';
require_once 'includes/functions.php';

$pidx = $_GET['pidx'] ?? '';

if (empty($pidx)) {
    set_flash('error', 'Invalid payment response.');
    redirect('/watch-shop/cart.php');
}

$stmt = mysqli_prepare($conn, "SELECT id, user_id, total_amount, status FROM orders WHERE khalti_pidx = ?");
mysqli_stmt_bind_param($stmt, "s", $pidx);
mysqli_stmt_execute($stmt);
$order = mysqli_fetch_assoc(mysqli_stmt_get_result($stmt));
mysqli_stmt_close($stmt);

if (!$order) {
    set_flash('error', 'Order not found.');
    redirect('/watch-shop/cart.php');
}

if ($order['status'] !== 'Pending') {
    if ($order['status'] === 'Paid' || $order['status'] === 'Delivered') {
        redirect('/watch-shop/receipt.php?order_id=' . $order['id']);
    }
    set_flash('error', 'This order has already been processed.');
    redirect('/watch-shop/order-history.php');
}

$payload = json_encode(['pidx' => $pidx]);

$ch = curl_init(KHALTI_LOOKUP_URL);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $payload,
    CURLOPT_HTTPHEADER => [
        'Authorization: Key ' . KHALTI_SECRET_KEY,
        'Content-Type: application/json',
    ],
]);

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

$data = json_decode($response, true);

if ($http_code === 200 && isset($data['status']) && $data['status'] === 'Completed') {
    $expected_paisa = (int)($order['total_amount'] * 100);
    if ((int)$data['total_amount'] !== $expected_paisa) {
        $stmt = mysqli_prepare($conn, "UPDATE orders SET status = 'Cancelled' WHERE id = ?");
        mysqli_stmt_bind_param($stmt, "i", $order['id']);
        mysqli_stmt_execute($stmt);
        mysqli_stmt_close($stmt);

        restore_stock($conn, $order['id']);

        set_flash('error', 'Payment amount mismatch. Order cancelled.');
        redirect('/watch-shop/order-history.php');
    }

    $txn_id = $data['transaction_id'] ?? '';
    $stmt = mysqli_prepare($conn, "UPDATE orders SET status = 'Paid', khalti_txn_id = ? WHERE id = ?");
    mysqli_stmt_bind_param($stmt, "si", $txn_id, $order['id']);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_close($stmt);

    $stmt = mysqli_prepare($conn, "DELETE FROM cart WHERE user_id = ?");
    mysqli_stmt_bind_param($stmt, "i", $order['user_id']);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_close($stmt);

    set_flash('success', 'Payment successful! Here is your receipt.');
    redirect('/watch-shop/receipt.php?order_id=' . $order['id']);
} else {
    $stmt = mysqli_prepare($conn, "UPDATE orders SET status = 'Cancelled' WHERE id = ?");
    mysqli_stmt_bind_param($stmt, "i", $order['id']);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_close($stmt);

    restore_stock($conn, $order['id']);

    set_flash('error', 'Payment was not completed. Please try again.');
    redirect('/watch-shop/cart.php');
}

function restore_stock($conn, $order_id) {
    $stmt = mysqli_prepare($conn, "SELECT product_id, quantity FROM order_items WHERE order_id = ?");
    mysqli_stmt_bind_param($stmt, "i", $order_id);
    mysqli_stmt_execute($stmt);
    $items = mysqli_stmt_get_result($stmt);

    $update_stmt = mysqli_prepare($conn, "UPDATE products SET quantity = quantity + ? WHERE id = ?");
    while ($item = mysqli_fetch_assoc($items)) {
        mysqli_stmt_bind_param($update_stmt, "ii", $item['quantity'], $item['product_id']);
        mysqli_stmt_execute($update_stmt);
    }
    mysqli_stmt_close($stmt);
    mysqli_stmt_close($update_stmt);
}
