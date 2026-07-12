<?php
function json_response($code, $data) {
    http_response_code($code);
    echo json_encode($data);
    exit;
}

function success($data = [], $code = 200) {
    json_response($code, array_merge(['success' => true], $data));
}

function error($message, $code = 400) {
    json_response($code, ['success' => false, 'message' => $message]);
}

function get_json_input() {
    return json_decode(file_get_contents('php://input'), true) ?? [];
}
