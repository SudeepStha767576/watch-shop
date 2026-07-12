<?php
function generate_token($conn, $user_id) {
    $token = bin2hex(random_bytes(32));
    $expires = date('Y-m-d H:i:s', strtotime('+7 days'));

    $stmt = mysqli_prepare($conn, "INSERT INTO tokens (user_id, token, expires_at) VALUES (?, ?, ?)");
    mysqli_stmt_bind_param($stmt, "iss", $user_id, $token, $expires);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_close($stmt);

    return $token;
}

function verify_token($conn, $token) {
    $stmt = mysqli_prepare($conn, "SELECT t.user_id, u.id, u.username, u.full_name, u.email, u.phone, u.dob, u.address, u.role FROM tokens t JOIN users u ON t.user_id = u.id WHERE t.token = ? AND t.expires_at > NOW()");
    mysqli_stmt_bind_param($stmt, "s", $token);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    $user = mysqli_fetch_assoc($result);
    mysqli_stmt_close($stmt);
    return $user ?: null;
}

function delete_token($conn, $token) {
    $stmt = mysqli_prepare($conn, "DELETE FROM tokens WHERE token = ?");
    mysqli_stmt_bind_param($stmt, "s", $token);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_close($stmt);
}

function cleanup_expired_tokens($conn) {
    mysqli_query($conn, "DELETE FROM tokens WHERE expires_at < NOW()");
}
