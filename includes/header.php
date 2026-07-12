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
    <title><?php echo isset($page_title) ? h($page_title) . ' - ' : ''; ?>Cricket Shop Nepal</title>
    <link rel="stylesheet" href="/cricket-shop/assets/css/style.css">
    <?php if (isset($is_admin_page) && $is_admin_page): ?>
    <link rel="stylesheet" href="/cricket-shop/assets/css/admin.css">
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
                    <a href="/cricket-shop/logout.php">Logout</a>
                <?php else: ?>
                    <a href="/cricket-shop/login.php">Login</a>
                    <a href="/cricket-shop/signup.php">Register</a>
                <?php endif; ?>
            </div>
        </div>
    </div>
    <?php endif; ?>

    <nav class="navbar">
        <div class="container">
            <a href="/cricket-shop/" class="logo">
                <span class="logo-icon">🏏</span>
                <span class="logo-text">Cricket Shop</span>
            </a>
            <button class="nav-toggle" onclick="document.querySelector('.nav-links').classList.toggle('active')">&#9776;</button>
            <ul class="nav-links">
                <?php if (is_logged_in() && is_admin()): ?>
                    <li><a href="/cricket-shop/admin/">Dashboard</a></li>
                    <li><a href="/cricket-shop/admin/products.php">Products</a></li>
                    <li><a href="/cricket-shop/admin/orders.php">Orders</a></li>
                    <li><a href="/cricket-shop/logout.php" class="btn btn-outline btn-sm">Logout</a></li>
                <?php elseif (is_logged_in()): ?>
                    <li><a href="/cricket-shop/">Home</a></li>
                    <li><a href="/cricket-shop/products.php?category=bats">Bats</a></li>
                    <li><a href="/cricket-shop/products.php?category=balls">Balls</a></li>
                    <li><a href="/cricket-shop/products.php?category=gloves">Gloves</a></li>
                    <li><a href="/cricket-shop/products.php?category=pads">Pads</a></li>
                    <li><a href="/cricket-shop/products.php?category=jerseys">Jerseys</a></li>
                    <li><a href="/cricket-shop/products.php?category=accessories">Accessories</a></li>
                    <li><a href="/cricket-shop/order-history.php">My Orders</a></li>
                    <li>
                        <a href="/cricket-shop/cart.php" class="cart-link">
                            &#128722; Cart
                            <?php if ($cart_count > 0): ?>
                                <span class="cart-badge"><?php echo $cart_count; ?></span>
                            <?php endif; ?>
                        </a>
                    </li>
                <?php else: ?>
                    <li><a href="/cricket-shop/">Home</a></li>
                    <li><a href="/cricket-shop/products.php?category=bats">Bats</a></li>
                    <li><a href="/cricket-shop/products.php?category=balls">Balls</a></li>
                    <li><a href="/cricket-shop/products.php?category=gloves">Gloves</a></li>
                    <li><a href="/cricket-shop/products.php?category=pads">Pads</a></li>
                    <li><a href="/cricket-shop/products.php?category=jerseys">Jerseys</a></li>
                    <li><a href="/cricket-shop/products.php?category=accessories">Accessories</a></li>
                    <li><a href="/cricket-shop/login.php" class="btn btn-outline btn-sm">Login</a></li>
                    <li><a href="/cricket-shop/signup.php" class="btn btn-primary btn-sm">Sign Up</a></li>
                <?php endif; ?>
            </ul>
        </div>
    </nav>
    <main class="container">
        <?php display_flash(); ?>
