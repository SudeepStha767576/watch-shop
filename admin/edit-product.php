<?php
$page_title = 'Edit Product';
$is_admin_page = true;
require_once __DIR__ . '/../includes/header.php';
require_admin();

$product_id = (int)($_GET['id'] ?? 0);

$stmt = mysqli_prepare($conn, "SELECT * FROM products WHERE id = ?");
mysqli_stmt_bind_param($stmt, "i", $product_id);
mysqli_stmt_execute($stmt);
$product = mysqli_fetch_assoc(mysqli_stmt_get_result($stmt));
mysqli_stmt_close($stmt);

if (!$product) {
    set_flash('error', 'Product not found.');
    redirect('/cricket-shop/admin/products.php');
}

$categories = mysqli_query($conn, "SELECT * FROM categories ORDER BY name");
?>

<div class="page-header">
    <h1>Edit Product</h1>
    <p><a href="/cricket-shop/admin/products.php">Back to Products</a></p>
</div>

<div class="product-form">
    <form action="/cricket-shop/api/admin/product-handler.php" method="POST" enctype="multipart/form-data">
        <?php echo csrf_input(); ?>
        <input type="hidden" name="product_id" value="<?php echo $product['id']; ?>">

        <div class="form-group">
            <label for="name">Product Name</label>
            <input type="text" id="name" name="name" class="form-control" required
                   value="<?php echo h($product['name']); ?>">
        </div>

        <div class="form-group">
            <label for="category_id">Category</label>
            <select id="category_id" name="category_id" class="form-control" required>
                <?php while ($cat = mysqli_fetch_assoc($categories)): ?>
                <option value="<?php echo $cat['id']; ?>" <?php echo ($product['category_id'] == $cat['id']) ? 'selected' : ''; ?>>
                    <?php echo h($cat['name']); ?>
                </option>
                <?php endwhile; ?>
            </select>
        </div>

        <div class="form-group">
            <label for="description">Description</label>
            <textarea id="description" name="description" class="form-control"><?php echo h($product['description']); ?></textarea>
        </div>

        <div class="form-group">
            <label for="price">Price (NPR)</label>
            <input type="number" id="price" name="price" class="form-control" step="0.01" min="0" required
                   value="<?php echo $product['price']; ?>">
        </div>

        <div class="form-group">
            <label for="quantity">Stock Quantity</label>
            <input type="number" id="quantity" name="quantity" class="form-control" min="0" required
                   value="<?php echo $product['quantity']; ?>">
        </div>

        <div class="form-group">
            <label for="product-image">Product Image (leave empty to keep current)</label>
            <input type="file" id="product-image" name="image" class="form-control" accept="image/jpeg,image/png,image/webp">
            <?php if ($product['image']): ?>
                <img src="/cricket-shop/assets/images/products/<?php echo h($product['image']); ?>" class="image-preview" id="image-preview" alt="Current image">
            <?php else: ?>
                <img id="image-preview" class="image-preview" style="display:none;" alt="Preview">
            <?php endif; ?>
        </div>

        <button type="submit" class="btn btn-primary">Update Product</button>
    </form>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
