<?php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../middleware/auth.php';

class AdminController {
    public static function stats($conn) {
        require_admin($conn);

        $products = mysqli_fetch_assoc(mysqli_query($conn, "SELECT COUNT(*) as c FROM products"))['c'];
        $orders = mysqli_fetch_assoc(mysqli_query($conn, "SELECT COUNT(*) as c FROM orders"))['c'];
        $revenue = mysqli_fetch_assoc(mysqli_query($conn, "SELECT COALESCE(SUM(total_amount), 0) as t FROM orders WHERE status IN ('Paid','Delivered')"))['t'];
        $pending = mysqli_fetch_assoc(mysqli_query($conn, "SELECT COUNT(*) as c FROM orders WHERE status = 'Paid'"))['c'];

        success(['stats' => [
            'total_products' => (int)$products,
            'total_orders' => (int)$orders,
            'total_revenue' => (float)$revenue,
            'pending_delivery' => (int)$pending,
        ]]);
    }

    public static function listProducts($conn) {
        require_admin($conn);

        $result = mysqli_query($conn, "SELECT p.*, c.name as category_name FROM products p JOIN categories c ON p.category_id = c.id ORDER BY p.created_at DESC");
        $products = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $row['image_url'] = $row['image'] ? IMAGE_URL_PREFIX . $row['image'] : null;
            $row['price'] = (float)$row['price'];
            $row['quantity'] = (int)$row['quantity'];
            $row['is_active'] = (int)$row['is_active'];
            $products[] = $row;
        }

        success(['products' => $products]);
    }

    public static function addProduct($conn) {
        require_admin($conn);

        $name = trim($_POST['name'] ?? '');
        $category_id = (int)($_POST['category_id'] ?? 0);
        $description = trim($_POST['description'] ?? '');
        $price = (float)($_POST['price'] ?? 0);
        $quantity = (int)($_POST['quantity'] ?? 0);

        if (empty($name) || $category_id <= 0 || $price <= 0 || $quantity < 0) {
            error('Please fill in all required fields.', 422);
        }

        $image_name = self::handleImageUpload();

        $stmt = mysqli_prepare($conn, "INSERT INTO products (name, category_id, description, price, quantity, image) VALUES (?, ?, ?, ?, ?, ?)");
        mysqli_stmt_bind_param($stmt, "sisdis", $name, $category_id, $description, $price, $quantity, $image_name);

        if (mysqli_stmt_execute($stmt)) {
            $id = mysqli_insert_id($conn);
            mysqli_stmt_close($stmt);
            success(['message' => 'Product added.', 'product_id' => $id], 201);
        } else {
            error('Failed to add product.', 500);
        }
    }

    public static function updateProduct($conn, $id) {
        require_admin($conn);
        $id = (int)$id;

        $name = trim($_POST['name'] ?? '');
        $category_id = (int)($_POST['category_id'] ?? 0);
        $description = trim($_POST['description'] ?? '');
        $price = (float)($_POST['price'] ?? 0);
        $quantity = (int)($_POST['quantity'] ?? 0);

        if (empty($name) || $category_id <= 0 || $price <= 0 || $quantity < 0) {
            error('Please fill in all required fields.', 422);
        }

        $image_name = self::handleImageUpload();

        if ($image_name) {
            $stmt = mysqli_prepare($conn, "UPDATE products SET name=?, category_id=?, description=?, price=?, quantity=?, image=? WHERE id=?");
            mysqli_stmt_bind_param($stmt, "sisdisi", $name, $category_id, $description, $price, $quantity, $image_name, $id);
        } else {
            $stmt = mysqli_prepare($conn, "UPDATE products SET name=?, category_id=?, description=?, price=?, quantity=? WHERE id=?");
            mysqli_stmt_bind_param($stmt, "sisdii", $name, $category_id, $description, $price, $quantity, $id);
        }

        if (mysqli_stmt_execute($stmt)) {
            mysqli_stmt_close($stmt);
            success(['message' => 'Product updated.']);
        } else {
            error('Failed to update product.', 500);
        }
    }

    public static function toggleProduct($conn, $id) {
        require_admin($conn);

        $stmt = mysqli_prepare($conn, "UPDATE products SET is_active = NOT is_active WHERE id = ?");
        mysqli_stmt_bind_param($stmt, "i", (int)$id);
        mysqli_stmt_execute($stmt);

        $stmt2 = mysqli_prepare($conn, "SELECT is_active FROM products WHERE id = ?");
        mysqli_stmt_bind_param($stmt2, "i", (int)$id);
        mysqli_stmt_execute($stmt2);
        $row = mysqli_fetch_assoc(mysqli_stmt_get_result($stmt2));
        mysqli_stmt_close($stmt);
        mysqli_stmt_close($stmt2);

        success(['message' => 'Product status updated.', 'is_active' => (int)$row['is_active']]);
    }

    public static function listOrders($conn) {
        require_admin($conn);

        $result = mysqli_query($conn, "SELECT o.*, u.full_name, u.phone FROM orders o JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC");
        $orders = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $row['id'] = (int)$row['id'];
            $row['total_amount'] = (float)$row['total_amount'];
            $orders[] = $row;
        }

        success(['orders' => $orders]);
    }

    public static function deliverOrder($conn, $id) {
        require_admin($conn);
        $id = (int)$id;

        $stmt = mysqli_prepare($conn, "SELECT status FROM orders WHERE id = ?");
        mysqli_stmt_bind_param($stmt, "i", $id);
        mysqli_stmt_execute($stmt);
        $order = mysqli_fetch_assoc(mysqli_stmt_get_result($stmt));
        mysqli_stmt_close($stmt);

        if (!$order || $order['status'] !== 'Paid') {
            error('Only paid orders can be marked as delivered.', 422);
        }

        $stmt = mysqli_prepare($conn, "UPDATE orders SET status = 'Delivered' WHERE id = ?");
        mysqli_stmt_bind_param($stmt, "i", $id);
        mysqli_stmt_execute($stmt);
        mysqli_stmt_close($stmt);

        success(['message' => 'Order #' . $id . ' marked as Delivered.']);
    }

    public static function listUsers($conn) {
        require_admin($conn);

        $result = mysqli_query($conn, "SELECT id, full_name, username, email, phone, address, role, created_at FROM users ORDER BY created_at DESC");
        $users = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $row['id'] = (int)$row['id'];
            $users[] = $row;
        }

        success(['users' => $users]);
    }

    public static function deleteUser($conn, $id) {
        require_admin($conn);
        $id = (int)$id;

        $stmt = mysqli_prepare($conn, "SELECT role FROM users WHERE id = ?");
        mysqli_stmt_bind_param($stmt, "i", $id);
        mysqli_stmt_execute($stmt);
        $user = mysqli_fetch_assoc(mysqli_stmt_get_result($stmt));
        mysqli_stmt_close($stmt);

        if (!$user) {
            error('User not found.', 404);
        }
        if ($user['role'] === 'admin') {
            error('Cannot delete admin users.', 403);
        }

        $order_check = mysqli_prepare($conn, "SELECT COUNT(*) as c FROM orders WHERE user_id = ? AND status IN ('Pending','Paid')");
        mysqli_stmt_bind_param($order_check, "i", $id);
        mysqli_stmt_execute($order_check);
        $pending = (int)mysqli_fetch_assoc(mysqli_stmt_get_result($order_check))['c'];
        mysqli_stmt_close($order_check);

        if ($pending > 0) {
            error('Cannot delete user with active orders.', 422);
        }

        $stmt = mysqli_prepare($conn, "DELETE FROM cart WHERE user_id = ?");
        mysqli_stmt_bind_param($stmt, "i", $id);
        mysqli_stmt_execute($stmt);
        mysqli_stmt_close($stmt);

        $stmt = mysqli_prepare($conn, "DELETE FROM users WHERE id = ?");
        mysqli_stmt_bind_param($stmt, "i", $id);
        mysqli_stmt_execute($stmt);
        mysqli_stmt_close($stmt);

        success(['message' => 'User deleted.']);
    }

    private static function handleImageUpload() {
        if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
            return null;
        }

        $allowed = ['image/jpeg', 'image/png', 'image/webp'];
        $max_size = 2 * 1024 * 1024;

        $type = mime_content_type($_FILES['image']['tmp_name']);
        if (!in_array($type, $allowed)) {
            error('Only JPEG, PNG, and WebP images are allowed.', 422);
        }
        if ($_FILES['image']['size'] > $max_size) {
            error('Image must be less than 2MB.', 422);
        }

        $ext = strtolower(pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION));
        $name = uniqid('prod_', true) . '.' . $ext;

        if (!move_uploaded_file($_FILES['image']['tmp_name'], UPLOAD_DIR . $name)) {
            error('Failed to upload image.', 500);
        }

        return $name;
    }
}
