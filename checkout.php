<?php
$page_title = 'Checkout';
require_once 'includes/header.php';
require_login();

$stmt = mysqli_prepare($conn, "SELECT c.*, p.name, p.price, p.image, p.quantity as stock, p.is_active FROM cart c JOIN products p ON c.product_id = p.id WHERE c.user_id = ?");
mysqli_stmt_bind_param($stmt, "i", $_SESSION['user_id']);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

$items = [];
$grand_total = 0;
$has_issue = false;

while ($item = mysqli_fetch_assoc($result)) {
    $item['line_total'] = $item['price'] * $item['quantity'];
    $grand_total += $item['line_total'];
    if (!$item['is_active'] || $item['quantity'] > $item['stock']) {
        $has_issue = true;
    }
    $items[] = $item;
}
mysqli_stmt_close($stmt);

if (empty($items)) {
    set_flash('error', 'Your cart is empty.');
    redirect('/watch-shop/cart.php');
}

$user_stmt = mysqli_prepare($conn, "SELECT full_name, email, phone, address FROM users WHERE id = ?");
mysqli_stmt_bind_param($user_stmt, "i", $_SESSION['user_id']);
mysqli_stmt_execute($user_stmt);
$user = mysqli_fetch_assoc(mysqli_stmt_get_result($user_stmt));
mysqli_stmt_close($user_stmt);
?>

<div class="page-header">
    <h1>Checkout</h1>
</div>

<div class="product-detail" style="grid-template-columns: 1.5fr 1fr;">
    <div>
        <h3 class="mb-2">Order Summary</h3>
        <div class="card">
            <?php foreach ($items as $item): ?>
            <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 16px;border-bottom:1px solid var(--gray);">
                <div>
                    <strong><?php echo h($item['name']); ?></strong>
                    <div class="card-text"><?php echo format_price($item['price']); ?> x <?php echo $item['quantity']; ?></div>
                    <?php if (!$item['is_active']): ?>
                        <span class="badge badge-inactive">Unavailable</span>
                    <?php elseif ($item['quantity'] > $item['stock']): ?>
                        <span class="badge badge-cancelled">Insufficient stock</span>
                    <?php endif; ?>
                </div>
                <div class="card-price"><?php echo format_price($item['line_total']); ?></div>
            </div>
            <?php endforeach; ?>
            <div style="padding:16px;display:flex;justify-content:space-between;font-size:1.2rem;font-weight:700;">
                <span>Total:</span>
                <span><?php echo format_price($grand_total); ?></span>
            </div>
        </div>
    </div>

    <div>
        <h3 class="mb-2">Delivery Details</h3>
        <div class="card" style="padding:20px;">
            <p><strong>Name:</strong> <?php echo h($user['full_name']); ?></p>
            <p><strong>Email:</strong> <?php echo h($user['email']); ?></p>
            <p><strong>Phone:</strong> <?php echo h($user['phone']); ?></p>
            <p><strong>Address:</strong> <?php echo h($user['address']); ?></p>
        </div>

        <?php if ($has_issue): ?>
            <div class="alert alert-danger mt-2">
                Some items in your cart have issues. Please update your cart before proceeding.
            </div>
            <a href="/watch-shop/cart.php" class="btn btn-secondary btn-block mt-1">Go to Cart</a>
        <?php else: ?>
            <form action="/watch-shop/api/checkout-handler.php" method="POST" class="mt-2">
                <?php echo csrf_input(); ?>
                <button type="submit" class="btn btn-primary btn-block" style="padding:14px;font-size:1.1rem;">
                    Pay <?php echo format_price($grand_total); ?> with Khalti
                </button>
            </form>
            <p class="text-center mt-1" style="color:var(--text-light);font-size:0.85rem;">
                You will be redirected to Khalti to complete payment.
            </p>
        <?php endif; ?>
    </div>
</div>

<?php require_once 'includes/footer.php'; ?>
