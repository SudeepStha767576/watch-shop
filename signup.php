<?php
$page_title = 'Sign Up';
require_once 'includes/header.php';

if (is_logged_in()) {
    redirect('/watch-shop/');
}
?>

<div class="form-card">
    <h2>Create Account</h2>
    <form action="/watch-shop/api/signup-handler.php" method="POST">
        <?php echo csrf_input(); ?>

        <div class="form-group">
            <label for="full_name">Full Name</label>
            <input type="text" id="full_name" name="full_name" class="form-control" required
                   value="<?php echo h($_SESSION['form_data']['full_name'] ?? ''); ?>">
        </div>

        <div class="form-group">
            <label for="username">Username</label>
            <input type="text" id="username" name="username" class="form-control" required
                   value="<?php echo h($_SESSION['form_data']['username'] ?? ''); ?>">
        </div>

        <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" class="form-control" required
                   value="<?php echo h($_SESSION['form_data']['email'] ?? ''); ?>">
        </div>

        <div class="form-group">
            <label for="phone">Phone Number</label>
            <input type="tel" id="phone" name="phone" class="form-control" required placeholder="98XXXXXXXX"
                   value="<?php echo h($_SESSION['form_data']['phone'] ?? ''); ?>">
        </div>

        <div class="form-group">
            <label for="dob">Date of Birth</label>
            <input type="date" id="dob" name="dob" class="form-control" required
                   value="<?php echo h($_SESSION['form_data']['dob'] ?? ''); ?>">
        </div>

        <div class="form-group">
            <label for="address">Address</label>
            <input type="text" id="address" name="address" class="form-control" required placeholder="City, District"
                   value="<?php echo h($_SESSION['form_data']['address'] ?? ''); ?>">
        </div>

        <div class="form-group">
            <label for="password">Password (min 6 characters)</label>
            <input type="password" id="password" name="password" class="form-control" required minlength="6">
        </div>

        <div class="form-group">
            <label for="confirm_password">Confirm Password</label>
            <input type="password" id="confirm_password" name="confirm_password" class="form-control" required minlength="6">
        </div>

        <button type="submit" class="btn btn-primary btn-block">Sign Up</button>
    </form>
    <div class="form-footer">
        Already have an account? <a href="/watch-shop/login.php">Login here</a>
    </div>
</div>

<?php
unset($_SESSION['form_data']);
require_once 'includes/footer.php';
?>
