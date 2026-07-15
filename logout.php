<?php
session_start();
session_unset();
session_destroy();
header('Location: /watch-shop/login.php');
exit;
