<?php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../middleware/auth.php';

class OrderController {
    public static function list($conn) {
        $user = require_auth($conn);

        $stmt = mysqli_prepare($conn, "SELECT id, total_amount, status, khalti_txn_id, created_at FROM orders WHERE user_id = ? ORDER BY created_at DESC");
        mysqli_stmt_bind_param($stmt, "i", $user['id']);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);

        $orders = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $row['id'] = (int)$row['id'];
            $row['total_amount'] = (float)$row['total_amount'];
            $orders[] = $row;
        }
        mysqli_stmt_close($stmt);

        success(['orders' => $orders]);
    }

    public static function show($conn, $id) {
        $user = require_auth($conn);
        $id = (int)$id;

        if ($user['role'] === 'admin') {
            $stmt = mysqli_prepare($conn, "SELECT o.*, u.full_name, u.email, u.phone, u.address FROM orders o JOIN users u ON o.user_id = u.id WHERE o.id = ?");
            mysqli_stmt_bind_param($stmt, "i", $id);
        } else {
            $stmt = mysqli_prepare($conn, "SELECT o.*, u.full_name, u.email, u.phone, u.address FROM orders o JOIN users u ON o.user_id = u.id WHERE o.id = ? AND o.user_id = ?");
            mysqli_stmt_bind_param($stmt, "ii", $id, $user['id']);
        }

        mysqli_stmt_execute($stmt);
        $order = mysqli_fetch_assoc(mysqli_stmt_get_result($stmt));
        mysqli_stmt_close($stmt);

        if (!$order) {
            error('Order not found.', 404);
        }

        $items_stmt = mysqli_prepare($conn, "SELECT product_name, price, quantity FROM order_items WHERE order_id = ?");
        mysqli_stmt_bind_param($items_stmt, "i", $id);
        mysqli_stmt_execute($items_stmt);
        $items_result = mysqli_stmt_get_result($items_stmt);

        $items = [];
        while ($item = mysqli_fetch_assoc($items_result)) {
            $item['price'] = (float)$item['price'];
            $item['quantity'] = (int)$item['quantity'];
            $items[] = $item;
        }
        mysqli_stmt_close($items_stmt);

        success([
            'order' => [
                'id' => (int)$order['id'],
                'total_amount' => (float)$order['total_amount'],
                'status' => $order['status'],
                'khalti_pidx' => $order['khalti_pidx'],
                'khalti_txn_id' => $order['khalti_txn_id'],
                'created_at' => $order['created_at'],
                'customer' => [
                    'full_name' => $order['full_name'],
                    'email' => $order['email'],
                    'phone' => $order['phone'],
                    'address' => $order['address'],
                ],
                'items' => $items,
            ]
        ]);
    }
}
