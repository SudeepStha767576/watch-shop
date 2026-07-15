<?php
$page_title = 'Manage Orders';
$is_admin_page = true;
require_once __DIR__ . '/../includes/header.php';
require_admin();

$orders = mysqli_query($conn, "SELECT o.*, u.full_name, u.phone FROM orders o JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC");
?>

<div class="admin-toolbar">
    <h2>All Orders</h2>
</div>

<?php if (mysqli_num_rows($orders) > 0): ?>
<div class="table-responsive">
    <table class="admin-table">
        <thead>
            <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Phone</th>
                <th>Total</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
            <?php while ($order = mysqli_fetch_assoc($orders)): ?>
            <tr>
                <td>#<?php echo $order['id']; ?></td>
                <td><?php echo h($order['full_name']); ?></td>
                <td><?php echo h($order['phone']); ?></td>
                <td><?php echo format_price($order['total_amount']); ?></td>
                <td><?php echo date('M j, Y', strtotime($order['created_at'])); ?></td>
                <td>
                    <span class="badge badge-<?php echo strtolower($order['status']); ?>">
                        <?php echo h($order['status']); ?>
                    </span>
                </td>
                <td>
                    <div class="actions">
                        <a href="/watch-shop/receipt.php?order_id=<?php echo $order['id']; ?>" class="btn btn-sm btn-secondary">View</a>
                        <?php if ($order['status'] === 'Paid'): ?>
                        <form action="/watch-shop/api/admin/update-order-status.php" method="POST" class="deliver-form" style="display:inline;">
                            <?php echo csrf_input(); ?>
                            <input type="hidden" name="order_id" value="<?php echo $order['id']; ?>">
                            <button type="submit" class="btn btn-sm btn-primary">Mark Delivered</button>
                        </form>
                        <?php endif; ?>
                    </div>
                </td>
            </tr>
            <?php endwhile; ?>
        </tbody>
    </table>
</div>
<?php else: ?>
<div class="empty-state">
    <div class="empty-icon">📋</div>
    <p>No orders yet.</p>
</div>
<?php endif; ?>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
