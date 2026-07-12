<?php
session_start();
session_unset();
session_destroy();
header('Location: /cricket-shop/login.php');
exit;
