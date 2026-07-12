<?php
$host = 'localhost';
$user = 'root';
$pass = '';
$db   = 'watch_shop';

$conn = mysqli_connect($host, $user, $pass, $db);

if (!$conn) {
    die("Database connection failed: " . mysqli_connect_error());
}

mysqli_set_charset($conn, 'utf8mb4');
