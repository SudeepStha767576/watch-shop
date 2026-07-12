<?php
require_once __DIR__ . '/../helpers/token.php';
require_once __DIR__ . '/../helpers/response.php';

function get_auth_user($conn) {
    // Apache may pass it via REDIRECT_HTTP_AUTHORIZATION or HTTP_AUTHORIZATION
    $header = $_SERVER['HTTP_AUTHORIZATION']
        ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION']
        ?? '';

    // Also check Apache function if available
    if (empty($header) && function_exists('apache_request_headers')) {
        $headers = apache_request_headers();
        $header = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    }

    if (!preg_match('/^Bearer\s+([a-f0-9]{64})$/', $header, $matches)) {
        return null;
    }
    return verify_token($conn, $matches[1]);
}

function require_auth($conn) {
    $user = get_auth_user($conn);
    if (!$user) {
        error('Not authenticated.', 401);
    }
    return $user;
}

function require_admin($conn) {
    $user = require_auth($conn);
    if ($user['role'] !== 'admin') {
        error('Access denied.', 403);
    }
    return $user;
}
