<?php
$page_title = 'Manage Products';
$is_admin_page = true;
require_once __DIR__ . '/../includes/header.php';
require_admin();

$products = mysqli_query($conn, "SELECT p.*, c.name as category_name FROM products p JOIN categories c ON p.category_id = c.id ORDER BY p.created_at DESC");
?>

<div class="admin-toolbar">
    <h2>Manage Products</h2>
    <a href="/cricket-shop/admin/add-product.php" class="btn btn-primary">+ Add Product</a>
</div>

<?php if (mysqli_num_rows($products) > 0): ?>
<div class="table-responsive">
    <table class="admin-table">
        <thead>
            <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            <?php while ($p = mysqli_fetch_assoc($products)): ?>
            <tr>
                <td>
                    <?php if ($p['image']): ?>
                        <img src="/cricket-shop/assets/images/products/<?php echo h($p['image']); ?>" alt="">
                    <?php else: ?>
                        <div style="width:50px;height:50px;background:var(--gray);border-radius:4px;display:flex;align-items:center;justify-content:center;">🏏</div>
                    <?php endif; ?>
                </td>
                <td><?php echo h($p['name']); ?></td>
                <td><?php echo h($p['category_name']); ?></td>
                <td><?php echo format_price($p['price']); ?></td>
                <td><?php echo $p['quantity']; ?></td>
                <td>
                    <?php if ($p['is_active']): ?>
                        <span class="badge badge-active">Active</span>
                    <?php else: ?>
                        <span class="badge badge-inactive">Delisted</span>
                    <?php endif; ?>
                </td>
                <td>
                    <div class="actions">
                        <a href="/cricket-shop/admin/edit-product.php?id=<?php echo $p['id']; ?>" class="btn btn-sm btn-secondary">Edit</a>
                        <form action="/cricket-shop/api/admin/toggle-product.php" method="POST" class="toggle-form" data-active="<?php echo $p['is_active']; ?>" style="display:inline;">
                            <?php echo csrf_input(); ?>
                            <input type="hidden" name="product_id" value="<?php echo $p['id']; ?>">
                            <button type="submit" class="btn btn-sm <?php echo $p['is_active'] ? 'btn-danger' : 'btn-primary'; ?>">
                                <?php echo $p['is_active'] ? 'Delist' : 'Relist'; ?>
                            </button>
                        </form>
                    </div>
                </td>
            </tr>
            <?php endwhile; ?>
        </tbody>
    </table>
</div>
<?php else: ?>
<div class="empty-state">
    <div class="empty-icon">📦</div>
    <p>No products yet. Add your first product!</p>
    <a href="/cricket-shop/admin/add-product.php" class="btn btn-primary">Add Product</a>
</div>
<?php endif; ?>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
