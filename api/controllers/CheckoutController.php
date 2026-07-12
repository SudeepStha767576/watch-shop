<?php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../middleware/auth.php';

class CheckoutController {
    public static function initiate($conn) {
        $user = require_auth($conn);

        $stmt = mysqli_prepare($conn, "SELECT c.product_id, c.quantity, p.name, p.price, p.quantity as stock, p.is_active FROM cart c JOIN products p ON c.product_id = p.id WHERE c.user_id = ?");
        mysqli_stmt_bind_param($stmt, "i", $user['id']);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);

        $cart_items = [];
        $total = 0;
        while ($item = mysqli_fetch_assoc($result)) {
            if (!$item['is_active']) {
                error('"' . $item['name'] . '" is no longer available.', 422);
            }
            if ($item['quantity'] > $item['stock']) {
                error('Not enough stock for "' . $item['name'] . '".', 422);
            }
            $item['line_total'] = $item['price'] * $item['quantity'];
            $total += $item['line_total'];
            $cart_items[] = $item;
        }
        mysqli_stmt_close($stmt);

        if (empty($cart_items)) {
            error('Your cart is empty.', 422);
        }

        mysqli_begin_transaction($conn);

        try {
            $stmt = mysqli_prepare($conn, "INSERT INTO orders (user_id, total_amount, status) VALUES (?, ?, 'Pending')");
            mysqli_stmt_bind_param($stmt, "id", $user['id'], $total);
            mysqli_stmt_execute($stmt);
            $order_id = mysqli_insert_id($conn);
            mysqli_stmt_close($stmt);

            $item_stmt = mysqli_prepare($conn, "INSERT INTO order_items (order_id, product_id, product_name, price, quantity) VALUES (?, ?, ?, ?, ?)");
            $stock_stmt = mysqli_prepare($conn, "UPDATE products SET quantity = quantity - ? WHERE id = ? AND quantity >= ?");

            foreach ($cart_items as $item) {
                mysqli_stmt_bind_param($item_stmt, "iisdi", $order_id, $item['product_id'], $item['name'], $item['price'], $item['quantity']);
                mysqli_stmt_execute($item_stmt);

                mysqli_stmt_bind_param($stock_stmt, "iii", $item['quantity'], $item['product_id'], $item['quantity']);
                mysqli_stmt_execute($stock_stmt);

                if (mysqli_stmt_affected_rows($stock_stmt) === 0) {
                    throw new Exception('Stock issue with ' . $item['name']);
                }
            }
            mysqli_stmt_close($item_stmt);
            mysqli_stmt_close($stock_stmt);

            $amount_paisa = (int)($total * 100);
            $payload = json_encode([
                'return_url' => SITE_URL . '/payment-callback',
                'website_url' => SITE_URL,
                'amount' => $amount_paisa,
                'purchase_order_id' => (string)$order_id,
                'purchase_order_name' => 'TimePiece Nepal Order #' . $order_id,
                'customer_info' => [
                    'name' => $user['full_name'],
                    'email' => $user['email'],
                    'phone' => $user['phone'],
                ],
            ]);

            $ch = curl_init(KHALTI_INITIATE_URL);
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

            if ($http_code !== 200) {
                throw new Exception('Khalti initiation failed.');
            }

            $data = json_decode($response, true);
            if (empty($data['pidx']) || empty($data['payment_url'])) {
                throw new Exception('Invalid Khalti response.');
            }

            $stmt = mysqli_prepare($conn, "UPDATE orders SET khalti_pidx = ? WHERE id = ?");
            mysqli_stmt_bind_param($stmt, "si", $data['pidx'], $order_id);
            mysqli_stmt_execute($stmt);
            mysqli_stmt_close($stmt);

            mysqli_commit($conn);

            success(['order_id' => $order_id, 'payment_url' => $data['payment_url']]);

        } catch (Exception $e) {
            mysqli_rollback($conn);
            error('Checkout failed: ' . $e->getMessage(), 500);
        }
    }

    public static function verify($conn) {
        $pidx = $_GET['pidx'] ?? '';
        if (empty($pidx)) {
            error('Invalid payment response.', 400);
        }

        $stmt = mysqli_prepare($conn, "SELECT id, user_id, total_amount, status FROM orders WHERE khalti_pidx = ?");
        mysqli_stmt_bind_param($stmt, "s", $pidx);
        mysqli_stmt_execute($stmt);
        $order = mysqli_fetch_assoc(mysqli_stmt_get_result($stmt));
        mysqli_stmt_close($stmt);

        if (!$order) {
            error('Order not found.', 404);
        }

        if ($order['status'] !== 'Pending') {
            if ($order['status'] === 'Paid' || $order['status'] === 'Delivered') {
                success(['order_id' => (int)$order['id'], 'status' => $order['status'], 'message' => 'Payment already verified.']);
            }
            error('This order has already been processed.', 400);
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
            $expected = (int)($order['total_amount'] * 100);
            if ((int)$data['total_amount'] !== $expected) {
                self::cancelOrder($conn, $order['id']);
                error('Payment amount mismatch. Order cancelled.', 400);
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

            success(['order_id' => (int)$order['id'], 'status' => 'Paid', 'message' => 'Payment successful!']);
        } else {
            self::cancelOrder($conn, $order['id']);
            error('Payment was not completed. Please try again.', 400);
        }
    }

    private static function cancelOrder($conn, $order_id) {
        $stmt = mysqli_prepare($conn, "UPDATE orders SET status = 'Cancelled' WHERE id = ?");
        mysqli_stmt_bind_param($stmt, "i", $order_id);
        mysqli_stmt_execute($stmt);
        mysqli_stmt_close($stmt);

        $stmt = mysqli_prepare($conn, "SELECT product_id, quantity FROM order_items WHERE order_id = ?");
        mysqli_stmt_bind_param($stmt, "i", $order_id);
        mysqli_stmt_execute($stmt);
        $items = mysqli_stmt_get_result($stmt);
        $update = mysqli_prepare($conn, "UPDATE products SET quantity = quantity + ? WHERE id = ?");
        while ($item = mysqli_fetch_assoc($items)) {
            mysqli_stmt_bind_param($update, "ii", $item['quantity'], $item['product_id']);
            mysqli_stmt_execute($update);
        }
        mysqli_stmt_close($stmt);
        mysqli_stmt_close($update);
    }
}
