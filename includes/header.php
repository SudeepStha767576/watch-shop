<?php
require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/functions.php';

$cart_count = 0;
if (is_logged_in() && !is_admin()) {
    $cart_count = get_cart_count($conn, $_SESSION['user_id']);
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo isset($page_title) ? h($page_title) . ' - ' : ''; ?>TimePiece Nepal</title>
    <link rel="stylesheet" href="/watch-shop/assets/css/style.css">
    <?php if (isset($is_admin_page) && $is_admin_page): ?>
    <link rel="stylesheet" href="/watch-shop/assets/css/admin.css">
    <?php endif; ?>
</head>
<body>
    <?php if (!isset($is_admin_page) || !$is_admin_page): ?>
    <div class="top-bar">
        <div class="container">
            <span>Free delivery on orders above Rs. 5,000 within Kathmandu Valley</span>
            <div>
                <?php if (is_logged_in()): ?>
                    <span>Welcome, <?php echo h($_SESSION['full_name'] ?? $_SESSION['username']); ?></span>
                    <a href="/watch-shop/logout.php">Logout</a>
                <?php else: ?>
                    <a href="/watch-shop/login.php">Login</a>
                    <a href="/watch-shop/signup.php">Register</a>
                <?php endif; ?>
            </div>
        </div>
    </div>
    <?php endif; ?>

    <nav class="navbar">
        <div class="container">
            <a href="/watch-shop/" class="logo">
                <span class="logo-icon">⌚</span>
                <span class="logo-text">TimePiece</span>
            </a>
            <button class="nav-toggle" onclick="document.querySelector('.nav-links').classList.toggle('active')">&#9776;</button>
            <ul class="nav-links">
                <?php if (is_logged_in() && is_admin()): ?>
                    <li><a href="/watch-shop/admin/">Dashboard</a></li>
                    <li><a href="/watch-shop/admin/products.php">Products</a></li>
                    <li><a href="/watch-shop/admin/orders.php">Orders</a></li>
                    <li><a href="/watch-shop/logout.php" class="btn btn-outline btn-sm">Logout</a></li>
                <?php elseif (is_logged_in()): ?>
                    <li><a href="/watch-shop/">Home</a></li>
                    <li><a href="/watch-shop/products.php?category=luxury">Luxury</a></li>
                    <li><a href="/watch-shop/products.php?category=sports">Sports</a></li>
                    <li><a href="/watch-shop/products.php?category=smart-watches">Smart Watches</a></li>
                    <li><a href="/watch-shop/products.php?category=casual">Casual</a></li>
                    <li><a href="/watch-shop/products.php?category=classic">Classic</a></li>
                    <li><a href="/watch-shop/products.php?category=accessories">Accessories</a></li>
                    <li><a href="/watch-shop/order-history.php">My Orders</a></li>
                    <li>
                        <a href="/watch-shop/cart.php" class="cart-link">
                            &#128722; Cart
                            <?php if ($cart_count > 0): ?>
                                <span class="cart-badge"><?php echo $cart_count; ?></span>
                            <?php endif; ?>
                        </a>
                    </li>
                <?php else: ?>
                    <li><a href="/watch-shop/">Home</a></li>
                    <li><a href="/watch-shop/products.php?category=luxury">Luxury</a></li>
                    <li><a href="/watch-shop/products.php?category=sports">Sports</a></li>
                    <li><a href="/watch-shop/products.php?category=smart-watches">Smart Watches</a></li>
                    <li><a href="/watch-shop/products.php?category=casual">Casual</a></li>
                    <li><a href="/watch-shop/products.php?category=classic">Classic</a></li>
                    <li><a href="/watch-shop/products.php?category=accessories">Accessories</a></li>
                    <li><a href="/watch-shop/login.php" class="btn btn-outline btn-sm">Login</a></li>
                    <li><a href="/watch-shop/signup.php" class="btn btn-primary btn-sm">Sign Up</a></li>
                <?php endif; ?>
            </ul>
        </div>
    </nav>
    <main class="container">
        <?php display_flash(); ?>
