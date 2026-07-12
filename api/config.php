<?php
$db_host = 'localhost';
$db_user = 'root';
$db_pass = '';
$db_name = 'watch_shop';

$conn = mysqli_connect($db_host, $db_user, $db_pass, $db_name);
if (!$conn) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database connection failed.']);
    exit;
}
mysqli_set_charset($conn, 'utf8mb4');

define('KHALTI_SECRET_KEY', 'live_secret_key_68791341fdd94846a146f0457ff7b455');
define('KHALTI_BASE_URL', 'https://dev.khalti.com');
define('KHALTI_INITIATE_URL', KHALTI_BASE_URL . '/api/v2/epayment/initiate/');
define('KHALTI_LOOKUP_URL', KHALTI_BASE_URL . '/api/v2/epayment/lookup/');
define('SITE_URL', 'http://localhost/watch-shop');
define('UPLOAD_DIR', __DIR__ . '/../assets/images/products/');
define('IMAGE_URL_PREFIX', '/watch-shop/assets/images/products/');
