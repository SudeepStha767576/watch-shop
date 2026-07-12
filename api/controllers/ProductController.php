<?php
require_once __DIR__ . '/../helpers/response.php';

class ProductController {
    public static function categories($conn) {
        $result = mysqli_query($conn, "SELECT * FROM categories ORDER BY name");
        $categories = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $categories[] = $row;
        }
        success(['categories' => $categories]);
    }

    public static function list($conn) {
        $category_slug = $_GET['category'] ?? null;
        $category = null;

        if ($category_slug) {
            $stmt = mysqli_prepare($conn, "SELECT * FROM categories WHERE slug = ?");
            mysqli_stmt_bind_param($stmt, "s", $category_slug);
            mysqli_stmt_execute($stmt);
            $category = mysqli_fetch_assoc(mysqli_stmt_get_result($stmt));
            mysqli_stmt_close($stmt);

            if (!$category) {
                error('Category not found.', 404);
            }

            $stmt = mysqli_prepare($conn, "SELECT p.*, c.name as category_name, c.slug as category_slug FROM products p JOIN categories c ON p.category_id = c.id WHERE p.category_id = ? AND p.is_active = 1 ORDER BY p.created_at DESC");
            mysqli_stmt_bind_param($stmt, "i", $category['id']);
        } else {
            $stmt = mysqli_prepare($conn, "SELECT p.*, c.name as category_name, c.slug as category_slug FROM products p JOIN categories c ON p.category_id = c.id WHERE p.is_active = 1 ORDER BY p.created_at DESC");
        }

        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);
        $products = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $row['image_url'] = $row['image'] ? IMAGE_URL_PREFIX . $row['image'] : null;
            $row['price'] = (float)$row['price'];
            $row['quantity'] = (int)$row['quantity'];
            $products[] = $row;
        }
        mysqli_stmt_close($stmt);

        success(['products' => $products, 'category' => $category]);
    }

    public static function featured($conn) {
        $stmt = mysqli_prepare($conn, "SELECT p.*, c.name as category_name, c.slug as category_slug FROM products p JOIN categories c ON p.category_id = c.id WHERE p.is_active = 1 AND p.quantity > 0 ORDER BY p.created_at DESC LIMIT 8");
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);
        $products = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $row['image_url'] = $row['image'] ? IMAGE_URL_PREFIX . $row['image'] : null;
            $row['price'] = (float)$row['price'];
            $row['quantity'] = (int)$row['quantity'];
            $products[] = $row;
        }
        mysqli_stmt_close($stmt);

        success(['products' => $products]);
    }

    public static function show($conn, $id) {
        $stmt = mysqli_prepare($conn, "SELECT p.*, c.name as category_name, c.slug as category_slug FROM products p JOIN categories c ON p.category_id = c.id WHERE p.id = ? AND p.is_active = 1");
        mysqli_stmt_bind_param($stmt, "i", $id);
        mysqli_stmt_execute($stmt);
        $product = mysqli_fetch_assoc(mysqli_stmt_get_result($stmt));
        mysqli_stmt_close($stmt);

        if (!$product) {
            error('Product not found.', 404);
        }

        $product['image_url'] = $product['image'] ? IMAGE_URL_PREFIX . $product['image'] : null;
        $product['price'] = (float)$product['price'];
        $product['quantity'] = (int)$product['quantity'];

        success(['product' => $product]);
    }
}
