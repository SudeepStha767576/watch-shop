<?php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../middleware/auth.php';

class CartController {
    public static function get($conn) {
        $user = require_auth($conn);

        $stmt = mysqli_prepare($conn, "SELECT c.product_id, c.quantity, p.name, p.price, p.image, p.quantity as stock, p.is_active FROM cart c JOIN products p ON c.product_id = p.id WHERE c.user_id = ? ORDER BY c.created_at DESC");
        mysqli_stmt_bind_param($stmt, "i", $user['id']);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);

        $items = [];
        $total = 0;
        $count = 0;
        while ($row = mysqli_fetch_assoc($result)) {
            $row['price'] = (float)$row['price'];
            $row['quantity'] = (int)$row['quantity'];
            $row['stock'] = (int)$row['stock'];
            $row['is_active'] = (int)$row['is_active'];
            $row['line_total'] = $row['price'] * $row['quantity'];
            $row['image_url'] = $row['image'] ? IMAGE_URL_PREFIX . $row['image'] : null;
            $total += $row['line_total'];
            $count += $row['quantity'];
            $items[] = $row;
        }
        mysqli_stmt_close($stmt);

        success(['items' => $items, 'total' => $total, 'count' => $count]);
    }

    public static function add($conn) {
        $user = require_auth($conn);
        $input = get_json_input();
        $product_id = (int)($input['product_id'] ?? 0);
        $quantity = (int)($input['quantity'] ?? 1);

        if ($product_id <= 0 || $quantity <= 0) {
            error('Invalid product or quantity.', 422);
        }

        $stmt = mysqli_prepare($conn, "SELECT quantity, is_active FROM products WHERE id = ?");
        mysqli_stmt_bind_param($stmt, "i", $product_id);
        mysqli_stmt_execute($stmt);
        $product = mysqli_fetch_assoc(mysqli_stmt_get_result($stmt));
        mysqli_stmt_close($stmt);

        if (!$product || !$product['is_active']) {
            error('Product is not available.', 422);
        }
        if ($quantity > $product['quantity']) {
            error('Not enough stock available.', 422);
        }

        $stmt = mysqli_prepare($conn, "SELECT id, quantity FROM cart WHERE user_id = ? AND product_id = ?");
        mysqli_stmt_bind_param($stmt, "ii", $user['id'], $product_id);
        mysqli_stmt_execute($stmt);
        $existing = mysqli_fetch_assoc(mysqli_stmt_get_result($stmt));
        mysqli_stmt_close($stmt);

        if ($existing) {
            $new_qty = min($existing['quantity'] + $quantity, $product['quantity']);
            $stmt = mysqli_prepare($conn, "UPDATE cart SET quantity = ? WHERE id = ?");
            mysqli_stmt_bind_param($stmt, "ii", $new_qty, $existing['id']);
        } else {
            $stmt = mysqli_prepare($conn, "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)");
            mysqli_stmt_bind_param($stmt, "iii", $user['id'], $product_id, $quantity);
        }

        mysqli_stmt_execute($stmt);
        mysqli_stmt_close($stmt);

        $count = self::getCartCount($conn, $user['id']);
        success(['message' => 'Product added to cart.', 'cart_count' => $count]);
    }

    public static function update($conn) {
        $user = require_auth($conn);
        $input = get_json_input();
        $product_id = (int)($input['product_id'] ?? 0);
        $quantity = (int)($input['quantity'] ?? 0);

        if ($product_id <= 0 || $quantity <= 0) {
            error('Invalid quantity.', 422);
        }

        $stmt = mysqli_prepare($conn, "SELECT quantity FROM products WHERE id = ?");
        mysqli_stmt_bind_param($stmt, "i", $product_id);
        mysqli_stmt_execute($stmt);
        $product = mysqli_fetch_assoc(mysqli_stmt_get_result($stmt));
        mysqli_stmt_close($stmt);

        if ($quantity > $product['quantity']) {
            error('Not enough stock. Maximum: ' . $product['quantity'], 422);
        }

        $stmt = mysqli_prepare($conn, "UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?");
        mysqli_stmt_bind_param($stmt, "iii", $quantity, $user['id'], $product_id);
        mysqli_stmt_execute($stmt);
        mysqli_stmt_close($stmt);

        $count = self::getCartCount($conn, $user['id']);
        success(['message' => 'Cart updated.', 'cart_count' => $count]);
    }

    public static function remove($conn, $product_id) {
        $user = require_auth($conn);
        $product_id = (int)$product_id;

        $stmt = mysqli_prepare($conn, "DELETE FROM cart WHERE user_id = ? AND product_id = ?");
        mysqli_stmt_bind_param($stmt, "ii", $user['id'], $product_id);
        mysqli_stmt_execute($stmt);
        mysqli_stmt_close($stmt);

        $count = self::getCartCount($conn, $user['id']);
        success(['message' => 'Item removed from cart.', 'cart_count' => $count]);
    }

    private static function getCartCount($conn, $user_id) {
        $stmt = mysqli_prepare($conn, "SELECT COALESCE(SUM(quantity), 0) as total FROM cart WHERE user_id = ?");
        mysqli_stmt_bind_param($stmt, "i", $user_id);
        mysqli_stmt_execute($stmt);
        $row = mysqli_fetch_assoc(mysqli_stmt_get_result($stmt));
        mysqli_stmt_close($stmt);
        return (int)$row['total'];
    }
}
