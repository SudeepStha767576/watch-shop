<?php
$page_title = 'Login';
require_once 'includes/header.php';

if (is_logged_in()) {
    redirect(is_admin() ? '/cricket-shop/admin/' : '/cricket-shop/');
}
?>

<div class="form-card">
    <h2>Login</h2>
    <form action="/cricket-shop/api/login-handler.php" method="POST">
        <?php echo csrf_input(); ?>

        <div class="form-group">
            <label for="username">Username</label>
            <input type="text" id="username" name="username" class="form-control" required>
        </div>

        <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" class="form-control" required>
        </div>

        <button type="submit" class="btn btn-primary btn-block">Login</button>
    </form>
    <div class="form-footer">
        <a href="/cricket-shop/forgot-password.php">Forgot Password?</a><br>
        Don't have an account? <a href="/cricket-shop/signup.php">Sign up here</a>
    </div>
</div>

<?php require_once 'includes/footer.php'; ?>
