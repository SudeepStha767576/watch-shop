<?php
$page_title = 'Admin Dashboard';
$is_admin_page = true;
require_once __DIR__ . '/../includes/header.php';
require_admin();

$total_products = mysqli_fetch_assoc(mysqli_query($conn, "SELECT COUNT(*) as count FROM products"))['count'];
$total_orders = mysqli_fetch_assoc(mysqli_query($conn, "SELECT COUNT(*) as count FROM orders"))['count'];
$total_revenue = mysqli_fetch_assoc(mysqli_query($conn, "SELECT COALESCE(SUM(total_amount), 0) as total FROM orders WHERE status IN ('Paid', 'Delivered')"))['total'];
$pending_orders = mysqli_fetch_assoc(mysqli_query($conn, "SELECT COUNT(*) as count FROM orders WHERE status = 'Paid'"))['count'];
?>

<div class="page-header">
    <h1>Admin Dashboard</h1>
    <p>Welcome back, <?php echo h($_SESSION['full_name']); ?>!</p>
</div>

<div class="stats-grid">
    <div class="stat-card">
        <div class="stat-value"><?php echo $total_products; ?></div>
        <div class="stat-label">Total Products</div>
    </div>
    <div class="stat-card orders">
        <div class="stat-value"><?php echo $total_orders; ?></div>
        <div class="stat-label">Total Orders</div>
    </div>
    <div class="stat-card revenue">
        <div class="stat-value"><?php echo format_price($total_revenue); ?></div>
        <div class="stat-label">Total Revenue</div>
    </div>
    <div class="stat-card">
        <div class="stat-value"><?php echo $pending_orders; ?></div>
        <div class="stat-label">Orders to Deliver</div>
    </div>
</div>

<div class="section-header">
    <h2>Quick Actions</h2>
</div>
<div class="flex gap-2">
    <a href="/watch-shop/admin/add-product.php" class="btn btn-primary">Add New Product</a>
    <a href="/watch-shop/admin/products.php" class="btn btn-secondary">Manage Products</a>
    <a href="/watch-shop/admin/orders.php" class="btn btn-secondary">View Orders</a>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
