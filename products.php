<?php
require_once 'includes/auth.php';
require_once 'includes/db.php';
require_once 'includes/functions.php';

$category_slug = $_GET['category'] ?? '';

$cat_stmt = mysqli_prepare($conn, "SELECT * FROM categories WHERE slug = ?");
mysqli_stmt_bind_param($cat_stmt, "s", $category_slug);
mysqli_stmt_execute($cat_stmt);
$category = mysqli_fetch_assoc(mysqli_stmt_get_result($cat_stmt));
mysqli_stmt_close($cat_stmt);

if (!$category) {
    set_flash('error', 'Category not found.');
    redirect('/cricket-shop/');
}

$page_title = $category['name'];
require_once 'includes/header.php';

$stmt = mysqli_prepare($conn, "SELECT * FROM products WHERE category_id = ? AND is_active = 1 ORDER BY created_at DESC");
mysqli_stmt_bind_param($stmt, "i", $category['id']);
mysqli_stmt_execute($stmt);
$products = mysqli_stmt_get_result($stmt);
$product_count = mysqli_num_rows($products);
?>

<div class="page-header">
    <h1><?php echo h($category['name']); ?></h1>
    <p><a href="/cricket-shop/">Home</a> &raquo; <?php echo h($category['name']); ?> <span style="color:var(--text-light);">(<?php echo $product_count; ?> products)</span></p>
</div>

<?php if ($product_count > 0): ?>
<div class="grid grid-4">
    <?php while ($product = mysqli_fetch_assoc($products)): ?>
    <a href="/cricket-shop/product-detail.php?id=<?php echo $product['id']; ?>" class="card">
        <div class="card-img-wrap">
            <?php if ($product['quantity'] <= 0): ?>
                <span class="badge badge-inactive badge-stock">Out of Stock</span>
            <?php endif; ?>
            <?php if ($product['image']): ?>
                <img src="/cricket-shop/assets/images/products/<?php echo h($product['image']); ?>" alt="<?php echo h($product['name']); ?>" class="card-img">
            <?php else: ?>
                <div class="card-img" style="display:flex;align-items:center;justify-content:center;font-size:3.5rem;color:var(--gray-mid);">🏏</div>
            <?php endif; ?>
        </div>
        <div class="card-body">
            <div class="card-title"><?php echo h($product['name']); ?></div>
            <div class="card-price"><?php echo format_price($product['price']); ?></div>
            <?php if ($product['quantity'] > 0): ?>
                <span class="card-btn">Add to Bag</span>
            <?php else: ?>
                <span class="card-btn" style="background:var(--gray-mid);cursor:default;">Out of Stock</span>
            <?php endif; ?>
        </div>
    </a>
    <?php endwhile; ?>
</div>
<?php else: ?>
<div class="empty-state">
    <div class="empty-icon">📦</div>
    <p>No products in this category yet.</p>
    <a href="/cricket-shop/" class="btn btn-secondary">Back to Home</a>
</div>
<?php endif; ?>

<?php
mysqli_stmt_close($stmt);
require_once 'includes/footer.php';
?>
