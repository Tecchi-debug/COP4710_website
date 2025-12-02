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

$user_id = intval($input['user_id']);

try {
    // Update only the selected reservations that are still pending
    $sql = "UPDATE reservations
            SET status = 'CONFIRMED'
            WHERE reserved_by_id = ?
                AND status = 'PENDING'";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$user_id]);

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
