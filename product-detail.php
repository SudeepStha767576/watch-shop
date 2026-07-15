<?php
require_once 'includes/auth.php';
require_once 'includes/db.php';
require_once 'includes/functions.php';

$product_id = (int)($_GET['id'] ?? 0);

$stmt = mysqli_prepare($conn, "SELECT p.*, c.name as category_name, c.slug as category_slug FROM products p JOIN categories c ON p.category_id = c.id WHERE p.id = ? AND p.is_active = 1");
mysqli_stmt_bind_param($stmt, "i", $product_id);
mysqli_stmt_execute($stmt);
$product = mysqli_fetch_assoc(mysqli_stmt_get_result($stmt));
mysqli_stmt_close($stmt);

if (!$product) {
    set_flash('error', 'Product not found.');
    redirect('/watch-shop/');
}

$page_title = $product['name'];
require_once 'includes/header.php';
?>

<div class="page-header">
    <p>
        <a href="/watch-shop/">Home</a> &raquo;
        <a href="/watch-shop/products.php?category=<?php echo h($product['category_slug']); ?>"><?php echo h($product['category_name']); ?></a> &raquo;
        <?php echo h($product['name']); ?>
    </p>
</div>

<div class="product-detail">
    <div>
        <?php if ($product['image']): ?>
            <img src="/watch-shop/assets/images/products/<?php echo h($product['image']); ?>" alt="<?php echo h($product['name']); ?>" class="product-detail-img">
        <?php else: ?>
            <div class="product-detail-img" style="display:flex;align-items:center;justify-content:center;font-size:5rem;color:var(--gray-dark);">⌚</div>
        <?php endif; ?>
    </div>
    <div>
        <h1><?php echo h($product['name']); ?></h1>
        <p class="card-text"><?php echo h($product['category_name']); ?></p>
        <div class="product-price"><?php echo format_price($product['price']); ?></div>

        <?php if ($product['quantity'] > 0): ?>
            <p class="product-stock stock-available">In Stock (<?php echo $product['quantity']; ?> available)</p>
        <?php else: ?>
            <p class="product-stock stock-out">Out of Stock</p>
        <?php endif; ?>

        <?php if ($product['description']): ?>
            <div class="mt-2">
                <h3>Description</h3>
                <p style="color: var(--text-light); margin-top: 8px;"><?php echo nl2br(h($product['description'])); ?></p>
            </div>
        <?php endif; ?>

        <?php if (is_logged_in() && !is_admin() && $product['quantity'] > 0): ?>
        <form action="/watch-shop/api/cart-handler.php" method="POST" class="mt-2">
            <?php echo csrf_input(); ?>
            <input type="hidden" name="action" value="add">
            <input type="hidden" name="product_id" value="<?php echo $product['id']; ?>">
            <div class="quantity-input">
                <label for="quantity"><strong>Qty:</strong></label>
                <input type="number" id="quantity" name="quantity" value="1" min="1" max="<?php echo $product['quantity']; ?>" class="form-control" style="width:80px;">
            </div>
            <button type="submit" class="btn btn-primary">Add to Cart</button>
        </form>
        <?php elseif (!is_logged_in()): ?>
        <div class="mt-2">
            <a href="/watch-shop/login.php" class="btn btn-primary">Login to Buy</a>
        </div>
        <?php endif; ?>
    </div>
</div>

<?php require_once 'includes/footer.php'; ?>
