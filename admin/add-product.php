<?php
$page_title = 'Add Product';
$is_admin_page = true;
require_once __DIR__ . '/../includes/header.php';
require_admin();

$categories = mysqli_query($conn, "SELECT * FROM categories ORDER BY name");
?>

<div class="page-header">
    <h1>Add New Product</h1>
    <p><a href="/watch-shop/admin/products.php">Back to Products</a></p>
</div>

<div class="product-form">
    <form action="/watch-shop/api/admin/product-handler.php" method="POST" enctype="multipart/form-data">
        <?php echo csrf_input(); ?>

        <div class="form-group">
            <label for="name">Product Name</label>
            <input type="text" id="name" name="name" class="form-control" required
                   value="<?php echo h($_SESSION['product_form']['name'] ?? ''); ?>">
        </div>

        <div class="form-group">
            <label for="category_id">Category</label>
            <select id="category_id" name="category_id" class="form-control" required>
                <option value="">Select Category</option>
                <?php while ($cat = mysqli_fetch_assoc($categories)): ?>
                <option value="<?php echo $cat['id']; ?>" <?php echo (($_SESSION['product_form']['category_id'] ?? '') == $cat['id']) ? 'selected' : ''; ?>>
                    <?php echo h($cat['name']); ?>
                </option>
                <?php endwhile; ?>
            </select>
        </div>

        <div class="form-group">
            <label for="description">Description</label>
            <textarea id="description" name="description" class="form-control"><?php echo h($_SESSION['product_form']['description'] ?? ''); ?></textarea>
        </div>

        <div class="form-group">
            <label for="price">Price (NPR)</label>
            <input type="number" id="price" name="price" class="form-control" step="0.01" min="0" required
                   value="<?php echo h($_SESSION['product_form']['price'] ?? ''); ?>">
        </div>

        <div class="form-group">
            <label for="quantity">Stock Quantity</label>
            <input type="number" id="quantity" name="quantity" class="form-control" min="0" required
                   value="<?php echo h($_SESSION['product_form']['quantity'] ?? ''); ?>">
        </div>

        <div class="form-group">
            <label for="product-image">Product Image (JPEG, PNG, WebP - max 2MB)</label>
            <input type="file" id="product-image" name="image" class="form-control" accept="image/jpeg,image/png,image/webp">
            <img id="image-preview" class="image-preview" style="display:none;" alt="Preview">
        </div>

        <button type="submit" class="btn btn-primary">Add Product</button>
    </form>
</div>

<?php
unset($_SESSION['product_form']);
require_once __DIR__ . '/../includes/footer.php';
?>
