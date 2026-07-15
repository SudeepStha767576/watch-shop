<?php

function h($string) {
    return htmlspecialchars($string ?? '', ENT_QUOTES, 'UTF-8');
}

function format_price($amount) {
    return 'Rs. ' . number_format($amount, 2);
}

function generate_csrf_token() {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function verify_csrf_token($token) {
    return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
}

function csrf_input() {
    return '<input type="hidden" name="csrf_token" value="' . generate_csrf_token() . '">';
}

function set_flash($type, $message) {
    $_SESSION['flash_' . $type] = $message;
}

function display_flash() {
    $types = ['success', 'error', 'info'];
    foreach ($types as $type) {
        $key = 'flash_' . $type;
        if (isset($_SESSION[$key])) {
            $class = $type === 'error' ? 'alert-danger' : ($type === 'success' ? 'alert-success' : 'alert-info');
            echo '<div class="alert ' . $class . '">' . h($_SESSION[$key]) . '<span class="alert-close" onclick="this.parentElement.remove()">&times;</span></div>';
            unset($_SESSION[$key]);
        }
    }
}

function get_cart_count($conn, $user_id) {
    $stmt = mysqli_prepare($conn, "SELECT SUM(quantity) as total FROM cart WHERE user_id = ?");
    mysqli_stmt_bind_param($stmt, "i", $user_id);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    $row = mysqli_fetch_assoc($result);
    return $row['total'] ?? 0;
}

function redirect($url) {
    header("Location: $url");
    exit;
}

// Khalti Sandbox Configuration
define('KHALTI_SECRET_KEY', 'live_secret_key_68791341fdd94846a146f0457ff7b455');
define('KHALTI_BASE_URL', 'https://dev.khalti.com');
define('KHALTI_INITIATE_URL', KHALTI_BASE_URL . '/api/v2/epayment/initiate/');
define('KHALTI_LOOKUP_URL', KHALTI_BASE_URL . '/api/v2/epayment/lookup/');
define('SITE_URL', 'http://localhost/watch-shop');
