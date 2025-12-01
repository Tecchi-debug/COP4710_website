<?php
require_once '../config/cors.php';
require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'error' => 'Method not allowed'
    ]);
    exit;
}

// Read POST JSON body
$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['user_id'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Missing user_id']);
    exit;
}

if (!isset($input['reservation_ids']) || !is_array($input['reservation_ids']) || count($input['reservation_ids']) === 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'No reservations selected']);
    exit;
}

$user_id = intval($input['user_id']);
$reservation_ids = $input['reservation_ids'];

try {
    // Build placeholders for the IN clause
    $in = str_repeat('?,', count($reservation_ids) - 1) . '?';
    
    // Update only the selected reservations that are still pending
    $sql = "UPDATE reservations
            SET status = 'CONFIRMED'
            WHERE reserved_by_id = ?
                AND reservation_id IN ($in)
                AND status = 'PENDING'";
    $stmt = $pdo->prepare($sql);

    // Merge user_id with reservation_ids for binding
    $params = array_merge([$user_id], $reservation_ids);
    $stmt->execute($params);

    echo json_encode([
        'success' => true,
        'message' => 'Selected reservations confirmed'
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Database error: ' . $e->getMessage()
    ]);
}
