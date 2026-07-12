<?php
$page_title = 'Receipt';
require_once 'includes/header.php';
require_login();

$order_id = (int)($_GET['order_id'] ?? 0);

$stmt = mysqli_prepare($conn, "SELECT o.*, u.full_name, u.email, u.phone, u.address FROM orders o JOIN users u ON o.user_id = u.id WHERE o.id = ? AND o.user_id = ?");
mysqli_stmt_bind_param($stmt, "ii", $order_id, $_SESSION['user_id']);
mysqli_stmt_execute($stmt);
$order = mysqli_fetch_assoc(mysqli_stmt_get_result($stmt));
mysqli_stmt_close($stmt);

if (!$order && is_admin()) {
    $stmt = mysqli_prepare($conn, "SELECT o.*, u.full_name, u.email, u.phone, u.address FROM orders o JOIN users u ON o.user_id = u.id WHERE o.id = ?");
    mysqli_stmt_bind_param($stmt, "i", $order_id);
    mysqli_stmt_execute($stmt);
    $order = mysqli_fetch_assoc(mysqli_stmt_get_result($stmt));
    mysqli_stmt_close($stmt);
}

if (!$order) {
    set_flash('error', 'Order not found.');
    redirect('/cricket-shop/order-history.php');
}

$items_stmt = mysqli_prepare($conn, "SELECT * FROM order_items WHERE order_id = ?");
mysqli_stmt_bind_param($items_stmt, "i", $order_id);
mysqli_stmt_execute($items_stmt);
$items = mysqli_stmt_get_result($items_stmt);
?>

<div class="receipt">
    <div class="receipt-header">
        <h2>Cricket Shop Nepal</h2>
        <p>Order Receipt</p>
    </div>

    <div class="flex-between mb-2">
        <div>
            <p><strong>Order #:</strong> <?php echo $order['id']; ?></p>
            <p><strong>Date:</strong> <?php echo date('F j, Y g:i A', strtotime($order['created_at'])); ?></p>
            <p><strong>Status:</strong>
                <span class="badge badge-<?php echo strtolower($order['status']); ?>">
                    <?php echo h($order['status']); ?>
                </span>
            </p>
        </div>
        <div style="text-align:right;">
            <p><strong><?php echo h($order['full_name']); ?></strong></p>
            <p><?php echo h($order['email']); ?></p>
            <p><?php echo h($order['phone']); ?></p>
            <p><?php echo h($order['address']); ?></p>
        </div>
    </div>

    <table style="box-shadow:none;">
        <thead>
            <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Qty</th>
                <th style="text-align:right;">Total</th>
            </tr>
        </thead>
        <tbody>
            <?php while ($item = mysqli_fetch_assoc($items)): ?>
            <tr>
                <td><?php echo h($item['product_name']); ?></td>
                <td><?php echo format_price($item['price']); ?></td>
                <td><?php echo $item['quantity']; ?></td>
                <td style="text-align:right;"><?php echo format_price($item['price'] * $item['quantity']); ?></td>
            </tr>
            <?php endwhile; ?>
        </tbody>
    </table>

    <div class="cart-total mt-2">
        <span>Grand Total:</span>
        <span><?php echo format_price($order['total_amount']); ?></span>
    </div>

    <?php if ($order['khalti_txn_id']): ?>
    <p class="mt-2" style="color:var(--text-light);font-size:0.85rem;">
        <strong>Khalti Transaction ID:</strong> <?php echo h($order['khalti_txn_id']); ?>
    </p>
    <?php endif; ?>

    <div class="text-center mt-3 no-print">
        <button onclick="window.print()" class="btn btn-secondary">Print Receipt</button>
        <a href="/cricket-shop/order-history.php" class="btn btn-outline" style="color:var(--primary);border-color:var(--primary);">Back to Orders</a>
    </div>
</div>

<?php
mysqli_stmt_close($items_stmt);
require_once 'includes/footer.php';
?>
