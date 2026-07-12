<?php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/middleware/cors.php';
require_once __DIR__ . '/helpers/response.php';

$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = str_replace('/watch-shop/api', '', $uri);
$uri = rtrim($uri, '/') ?: '/';

// Auth routes
if ($uri === '/auth/login' && $method === 'POST') {
    require_once __DIR__ . '/controllers/AuthController.php';
    AuthController::login($conn);
}
if ($uri === '/auth/signup' && $method === 'POST') {
    require_once __DIR__ . '/controllers/AuthController.php';
    AuthController::signup($conn);
}
if ($uri === '/auth/reset-password' && $method === 'POST') {
    require_once __DIR__ . '/controllers/AuthController.php';
    AuthController::resetPassword($conn);
}
if ($uri === '/auth/me' && $method === 'GET') {
    require_once __DIR__ . '/controllers/AuthController.php';
    AuthController::me($conn);
}
if ($uri === '/auth/logout' && $method === 'POST') {
    require_once __DIR__ . '/controllers/AuthController.php';
    AuthController::logout($conn);
}

// Product routes (public)
if ($uri === '/categories' && $method === 'GET') {
    require_once __DIR__ . '/controllers/ProductController.php';
    ProductController::categories($conn);
}
if ($uri === '/products' && $method === 'GET') {
    require_once __DIR__ . '/controllers/ProductController.php';
    ProductController::list($conn);
}
if ($uri === '/products/featured' && $method === 'GET') {
    require_once __DIR__ . '/controllers/ProductController.php';
    ProductController::featured($conn);
}
if (preg_match('/^\/products\/(\d+)$/', $uri, $m) && $method === 'GET') {
    require_once __DIR__ . '/controllers/ProductController.php';
    ProductController::show($conn, $m[1]);
}

// Cart routes (auth required)
if ($uri === '/cart' && $method === 'GET') {
    require_once __DIR__ . '/controllers/CartController.php';
    CartController::get($conn);
}
if ($uri === '/cart' && $method === 'POST') {
    require_once __DIR__ . '/controllers/CartController.php';
    CartController::add($conn);
}
if ($uri === '/cart' && $method === 'PUT') {
    require_once __DIR__ . '/controllers/CartController.php';
    CartController::update($conn);
}
if (preg_match('/^\/cart\/(\d+)$/', $uri, $m) && $method === 'DELETE') {
    require_once __DIR__ . '/controllers/CartController.php';
    CartController::remove($conn, $m[1]);
}

// Checkout routes (auth required)
if ($uri === '/checkout' && $method === 'POST') {
    require_once __DIR__ . '/controllers/CheckoutController.php';
    CheckoutController::initiate($conn);
}
if ($uri === '/payment/verify' && $method === 'GET') {
    require_once __DIR__ . '/controllers/CheckoutController.php';
    CheckoutController::verify($conn);
}

// Order routes (auth required)
if ($uri === '/orders' && $method === 'GET') {
    require_once __DIR__ . '/controllers/OrderController.php';
    OrderController::list($conn);
}
if (preg_match('/^\/orders\/(\d+)$/', $uri, $m) && $method === 'GET') {
    require_once __DIR__ . '/controllers/OrderController.php';
    OrderController::show($conn, $m[1]);
}

// Admin routes
if ($uri === '/admin/stats' && $method === 'GET') {
    require_once __DIR__ . '/controllers/AdminController.php';
    AdminController::stats($conn);
}
if ($uri === '/admin/products' && $method === 'GET') {
    require_once __DIR__ . '/controllers/AdminController.php';
    AdminController::listProducts($conn);
}
if ($uri === '/admin/products' && $method === 'POST') {
    require_once __DIR__ . '/controllers/AdminController.php';
    AdminController::addProduct($conn);
}
if (preg_match('/^\/admin\/products\/(\d+)$/', $uri, $m) && $method === 'POST') {
    require_once __DIR__ . '/controllers/AdminController.php';
    AdminController::updateProduct($conn, $m[1]);
}
if (preg_match('/^\/admin\/products\/(\d+)\/toggle$/', $uri, $m) && $method === 'PATCH') {
    require_once __DIR__ . '/controllers/AdminController.php';
    AdminController::toggleProduct($conn, $m[1]);
}
if ($uri === '/admin/orders' && $method === 'GET') {
    require_once __DIR__ . '/controllers/AdminController.php';
    AdminController::listOrders($conn);
}
if (preg_match('/^\/admin\/orders\/(\d+)\/deliver$/', $uri, $m) && $method === 'PATCH') {
    require_once __DIR__ . '/controllers/AdminController.php';
    AdminController::deliverOrder($conn, $m[1]);
}

// 404 fallback
error('Endpoint not found.', 404);
