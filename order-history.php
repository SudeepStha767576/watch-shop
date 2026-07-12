<?php
$page_title = 'My Orders';
require_once 'includes/header.php';
require_login();

$stmt = mysqli_prepare($conn, "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC");
mysqli_stmt_bind_param($stmt, "i", $_SESSION['user_id']);
mysqli_stmt_execute($stmt);
$orders = mysqli_stmt_get_result($stmt);
?>

<div class="page-header">
    <h1>My Orders</h1>
</div>

<?php if (mysqli_num_rows($orders) > 0): ?>
<div class="table-responsive">
    <table>
        <thead>
            <tr>
                <th>Order #</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
            <?php while ($order = mysqli_fetch_assoc($orders)): ?>
            <tr>
                <td>#<?php echo $order['id']; ?></td>
                <td><?php echo date('M j, Y', strtotime($order['created_at'])); ?></td>
                <td><?php echo format_price($order['total_amount']); ?></td>
                <td>
                    <span class="badge badge-<?php echo strtolower($order['status']); ?>">
                        <?php echo h($order['status']); ?>
                    </span>
                </td>
                <td>
                    <?php if ($order['status'] === 'Paid' || $order['status'] === 'Delivered'): ?>
                        <a href="/cricket-shop/receipt.php?order_id=<?php echo $order['id']; ?>" class="btn btn-sm btn-secondary">View Receipt</a>
                    <?php endif; ?>
                </td>
            </tr>
            <?php endwhile; ?>
        </tbody>
    </table>
</div>
<?php else: ?>
<div class="empty-state">
    <div class="empty-icon">📋</div>
    <p>You haven't placed any orders yet.</p>
    <a href="/cricket-shop/" class="btn btn-primary">Start Shopping</a>
</div>
<?php endif; ?>

<?php
mysqli_stmt_close($stmt);
require_once 'includes/footer.php';
?>
