<?php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/token.php';
require_once __DIR__ . '/../middleware/auth.php';

class AuthController {
    public static function login($conn) {
        $input = get_json_input();
        $username = trim($input['username'] ?? '');
        $password = $input['password'] ?? '';

        if (empty($username) || empty($password)) {
            error('Please enter both username and password.', 422);
        }

        $stmt = mysqli_prepare($conn, "SELECT id, username, full_name, email, phone, dob, address, password, role FROM users WHERE username = ?");
        mysqli_stmt_bind_param($stmt, "s", $username);
        mysqli_stmt_execute($stmt);
        $user = mysqli_fetch_assoc(mysqli_stmt_get_result($stmt));
        mysqli_stmt_close($stmt);

        if (!$user || !password_verify($password, $user['password'])) {
            error('Invalid username or password.', 401);
        }

        $token = generate_token($conn, $user['id']);
        unset($user['password']);

        success(['user' => $user, 'token' => $token]);
    }

    public static function signup($conn) {
        $input = get_json_input();
        $full_name = trim($input['full_name'] ?? '');
        $username = trim($input['username'] ?? '');
        $email = trim($input['email'] ?? '');
        $phone = trim($input['phone'] ?? '');
        $dob = trim($input['dob'] ?? '');
        $address = trim($input['address'] ?? '');
        $password = $input['password'] ?? '';
        $confirm = $input['confirm_password'] ?? '';

        if (empty($full_name) || empty($username) || empty($email) || empty($phone) || empty($dob) || empty($address) || empty($password)) {
            error('All fields are required.', 422);
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            error('Please enter a valid email address.', 422);
        }
        if (!preg_match('/^[0-9]{10}$/', $phone)) {
            error('Phone number must be 10 digits.', 422);
        }
        $dob_date = DateTime::createFromFormat('Y-m-d', $dob);
        if (!$dob_date || $dob_date->format('Y-m-d') !== $dob) {
            error('Please enter a valid date of birth.', 422);
        }
        if (strlen($password) < 6) {
            error('Password must be at least 6 characters.', 422);
        }
        if ($password !== $confirm) {
            error('Passwords do not match.', 422);
        }

        $stmt = mysqli_prepare($conn, "SELECT id FROM users WHERE username = ?");
        mysqli_stmt_bind_param($stmt, "s", $username);
        mysqli_stmt_execute($stmt);
        if (mysqli_stmt_get_result($stmt)->num_rows > 0) {
            error('Username is already taken.', 422);
        }
        mysqli_stmt_close($stmt);

        $stmt = mysqli_prepare($conn, "SELECT id FROM users WHERE email = ?");
        mysqli_stmt_bind_param($stmt, "s", $email);
        mysqli_stmt_execute($stmt);
        if (mysqli_stmt_get_result($stmt)->num_rows > 0) {
            error('Email is already registered.', 422);
        }
        mysqli_stmt_close($stmt);

        $hashed = password_hash($password, PASSWORD_BCRYPT);
        $stmt = mysqli_prepare($conn, "INSERT INTO users (full_name, username, email, phone, dob, address, password) VALUES (?, ?, ?, ?, ?, ?, ?)");
        mysqli_stmt_bind_param($stmt, "sssssss", $full_name, $username, $email, $phone, $dob, $address, $hashed);

        if (mysqli_stmt_execute($stmt)) {
            success(['message' => 'Account created successfully!'], 201);
        } else {
            error('Something went wrong. Please try again.', 500);
        }
        mysqli_stmt_close($stmt);
    }

    public static function resetPassword($conn) {
        $input = get_json_input();
        $username = trim($input['username'] ?? '');
        $dob = trim($input['dob'] ?? '');
        $new_password = $input['new_password'] ?? '';
        $confirm = $input['confirm_password'] ?? '';

        if (empty($username) || empty($dob) || empty($new_password) || empty($confirm)) {
            error('All fields are required.', 422);
        }
        if (strlen($new_password) < 6) {
            error('Password must be at least 6 characters.', 422);
        }
        if ($new_password !== $confirm) {
            error('Passwords do not match.', 422);
        }

        $stmt = mysqli_prepare($conn, "SELECT id FROM users WHERE username = ? AND dob = ?");
        mysqli_stmt_bind_param($stmt, "ss", $username, $dob);
        mysqli_stmt_execute($stmt);
        $user = mysqli_fetch_assoc(mysqli_stmt_get_result($stmt));
        mysqli_stmt_close($stmt);

        if (!$user) {
            error('Username and Date of Birth do not match our records.', 404);
        }

        $hashed = password_hash($new_password, PASSWORD_BCRYPT);
        $stmt = mysqli_prepare($conn, "UPDATE users SET password = ? WHERE id = ?");
        mysqli_stmt_bind_param($stmt, "si", $hashed, $user['id']);
        mysqli_stmt_execute($stmt);
        mysqli_stmt_close($stmt);

        success(['message' => 'Password reset successfully!']);
    }

    public static function me($conn) {
        $user = require_auth($conn);
        success(['user' => $user]);
    }

    public static function logout($conn) {
        $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        if (preg_match('/^Bearer\s+([a-f0-9]{64})$/', $header, $matches)) {
            delete_token($conn, $matches[1]);
        }
        success(['message' => 'Logged out.']);
    }
}
