<?php
$page_title = 'Home';
require_once 'includes/header.php';

$categories = mysqli_query($conn, "SELECT * FROM categories ORDER BY name");

$featured_stmt = mysqli_prepare($conn, "SELECT p.*, c.name as category_name FROM products p JOIN categories c ON p.category_id = c.id WHERE p.is_active = 1 AND p.quantity > 0 ORDER BY p.created_at DESC LIMIT 8");
mysqli_stmt_execute($featured_stmt);
$featured = mysqli_stmt_get_result($featured_stmt);
?>

<section class="hero">
    <h1>Premium Cricket Gear<br>for Every Player</h1>
    <p>Discover top-quality bats, balls, protective gear and accessories from trusted brands in Nepal</p>
    <a href="#categories" class="btn btn-primary">Shop Now</a>
</section>

<section id="categories">
    <div class="section-header">
        <h2>Shop by Category</h2>
    </div>
    <div class="grid" style="grid-template-columns: repeat(6, 1fr);">
        <?php
        $icons = ['bats'=>'🏏','balls'=>'⚾','pads'=>'🦵','gloves'=>'🧤','jerseys'=>'👕','accessories'=>'🎒'];
        while ($cat = mysqli_fetch_assoc($categories)):
        ?>
        <a href="/cricket-shop/products.php?category=<?php echo h($cat['slug']); ?>" class="category-card">
            <span class="category-icon"><?php echo $icons[$cat['slug']] ?? '📦'; ?></span>
            <span class="category-name"><?php echo h($cat['name']); ?></span>
        </a>
        <?php endwhile; ?>
    </div>
</section>

<section class="mt-3">
    <div class="section-header">
        <h2>Latest Products</h2>
        <a href="#categories" style="font-size:0.88rem;font-weight:600;">View All &rarr;</a>
    </div>
    <?php if (mysqli_num_rows($featured) > 0): ?>
    <div class="grid grid-4">
        <?php while ($product = mysqli_fetch_assoc($featured)): ?>
        <a href="/cricket-shop/product-detail.php?id=<?php echo $product['id']; ?>" class="card">
            <div class="card-img-wrap">
                <?php if ($product['image']): ?>
                    <img src="/cricket-shop/assets/images/products/<?php echo h($product['image']); ?>" alt="<?php echo h($product['name']); ?>" class="card-img">
                <?php else: ?>
                    <div class="card-img" style="display:flex;align-items:center;justify-content:center;font-size:3.5rem;color:var(--gray-mid);">🏏</div>
                <?php endif; ?>
            </div>
            <div class="card-body">
                <div class="card-category"><?php echo h($product['category_name']); ?></div>
                <div class="card-title"><?php echo h($product['name']); ?></div>
                <div class="card-price"><?php echo format_price($product['price']); ?></div>
                <span class="card-btn">View Details</span>
            </div>
        </a>
        <?php endwhile; ?>
    </div>
    <?php else: ?>
    <div class="empty-state">
        <div class="empty-icon">🏏</div>
        <p>No products available yet. Check back soon!</p>
    </div>
    <?php endif; ?>
</section>

<?php require_once 'includes/footer.php'; ?>
