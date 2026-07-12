<?php
$page_title = 'Reset Password';
require_once 'includes/header.php';

if (is_logged_in()) {
    redirect('/cricket-shop/');
}
?>

<div class="form-card">
    <h2>Reset Password</h2>
    <p class="text-center mb-2" style="color: var(--text-light); font-size: 0.9rem;">
        Enter your username and date of birth to reset your password.
    </p>
    <form action="/cricket-shop/api/reset-password-handler.php" method="POST">
        <?php echo csrf_input(); ?>

        <div class="form-group">
            <label for="username">Username</label>
            <input type="text" id="username" name="username" class="form-control" required>
        </div>

        <div class="form-group">
            <label for="dob">Date of Birth</label>
            <input type="date" id="dob" name="dob" class="form-control" required>
        </div>

        <div class="form-group">
            <label for="new_password">New Password (min 6 characters)</label>
            <input type="password" id="new_password" name="new_password" class="form-control" required minlength="6">
        </div>

        <div class="form-group">
            <label for="confirm_password">Confirm New Password</label>
            <input type="password" id="confirm_password" name="confirm_password" class="form-control" required minlength="6">
        </div>

        <button type="submit" class="btn btn-primary btn-block">Reset Password</button>
    </form>
    <div class="form-footer">
        <a href="/cricket-shop/login.php">Back to Login</a>
    </div>
</div>

<?php require_once 'includes/footer.php'; ?>
