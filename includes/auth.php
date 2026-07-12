<?php
if (session_status() === PHP_SESSION_NONE) {
    ini_set('session.cookie_httponly', 1);
    ini_set('session.use_only_cookies', 1);
    ini_set('session.cookie_samesite', 'Lax');
    session_start();
}

function is_logged_in() {
    return isset($_SESSION['user_id']);
}

function is_admin() {
    return isset($_SESSION['role']) && $_SESSION['role'] === 'admin';
}

function require_login() {
    if (!is_logged_in()) {
        $_SESSION['flash_error'] = 'Please log in to continue.';
        header('Location: /cricket-shop/login.php');
        exit;
    }
}

function require_admin() {
    if (!is_logged_in() || !is_admin()) {
        $_SESSION['flash_error'] = 'Access denied.';
        header('Location: /cricket-shop/login.php');
        exit;
    }
}
