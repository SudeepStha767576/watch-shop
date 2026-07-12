<?php
$page_title = 'Shopping Cart';
require_once 'includes/header.php';
require_login();

$stmt = mysqli_prepare($conn, "SELECT c.*, p.name, p.price, p.image, p.quantity as stock, p.is_active FROM cart c JOIN products p ON c.product_id = p.id WHERE c.user_id = ? ORDER BY c.created_at DESC");
mysqli_stmt_bind_param($stmt, "i", $_SESSION['user_id']);
mysqli_stmt_execute($stmt);
$cart_items = mysqli_stmt_get_result($stmt);

$items = [];
$grand_total = 0;
while ($item = mysqli_fetch_assoc($cart_items)) {
    $item['line_total'] = $item['price'] * $item['quantity'];
    $grand_total += $item['line_total'];
    $items[] = $item;
}
mysqli_stmt_close($stmt);
?>

<div class="page-header">
    <h1>Shopping Cart</h1>
</div>

<?php if (count($items) > 0): ?>
<div class="card">
    <?php foreach ($items as $item): ?>
    <div class="cart-item">
        <?php if ($item['image']): ?>
            <img src="/cricket-shop/assets/images/products/<?php echo h($item['image']); ?>" alt="" class="cart-item-img">
        <?php else: ?>
            <div class="cart-item-img" style="display:flex;align-items:center;justify-content:center;font-size:1.5rem;background:var(--gray);">🏏</div>
        <?php endif; ?>

        <div>
            <div class="card-title"><?php echo h($item['name']); ?></div>
            <div class="card-text"><?php echo format_price($item['price']); ?> each</div>
            <?php if (!$item['is_active']): ?>
                <span class="badge badge-inactive">No longer available</span>
            <?php endif; ?>
        </div>

        <form action="/cricket-shop/api/cart-handler.php" method="POST" style="display:flex;align-items:center;gap:8px;">
            <?php echo csrf_input(); ?>
            <input type="hidden" name="action" value="update">
            <input type="hidden" name="product_id" value="<?php echo $item['product_id']; ?>">
            <input type="number" name="quantity" value="<?php echo $item['quantity']; ?>" min="1" max="<?php echo $item['stock']; ?>" class="form-control" style="width:70px;">
            <button type="submit" class="btn btn-sm btn-secondary">Update</button>
        </form>

        <div style="text-align:right;">
            <div class="card-price"><?php echo format_price($item['line_total']); ?></div>
            <form action="/cricket-shop/api/cart-handler.php" method="POST" style="margin-top:8px;">
                <?php echo csrf_input(); ?>
                <input type="hidden" name="action" value="remove">
                <input type="hidden" name="product_id" value="<?php echo $item['product_id']; ?>">
                <button type="submit" class="btn btn-sm btn-danger">Remove</button>
            </form>
        </div>
    </div>
    <?php endforeach; ?>
</div>

<div class="cart-summary">
    <div class="cart-total">
        <span>Total:</span>
        <span><?php echo format_price($grand_total); ?></span>
    </div>
    <div class="mt-2 text-right">
        <a href="/cricket-shop/" class="btn btn-secondary">Continue Shopping</a>
        <a href="/cricket-shop/checkout.php" class="btn btn-primary">Proceed to Checkout</a>
    </div>
</div>

<?php else: ?>
<div class="empty-state">
    <div class="empty-icon">🛒</div>
    <p>Your cart is empty.</p>
    <a href="/cricket-shop/" class="btn btn-primary">Start Shopping</a>
</div>
<?php endif; ?>

<?php require_once 'includes/footer.php'; ?>
