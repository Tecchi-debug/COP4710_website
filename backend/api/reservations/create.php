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

$input = json_decode(file_get_contents('php://input'), true);

// Validate input
if (
    !isset($input['reserved_by_id']) ||
    !isset($input['offer_id']) ||
    !isset($input['qty'])
) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Missing required fields'
    ]);
    return;
}

$reserved_by_id = $input['reserved_by_id'];
$offer_id = $input['offer_id'];
$qty_requested = intval($input['qty']);

if ($qty_requested <= 0) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Quantity must be at least 1'
    ]);
    return;
}

try {
    // STEP 1: Verify offer exists and has enough quantity
    $stmt = $pdo->prepare("
        SELECT qty 
        FROM offers 
        WHERE offer_id = ? 
          AND to_time > NOW()
    ");
    $stmt->execute([$offer_id]);
    $offer = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$offer) {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'error' => 'Offer not found or expired'
        ]);
        return;
    }

    if ($offer['qty'] < $qty_requested) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Not enough quantity available'
        ]);
        return;
    }

    // Start transaction (reservation + quantity update must be atomic)
    $pdo->beginTransaction();

    $reserved_for_id = $input['reserved_for_id'] ?? null;

    // STEP 2: Insert reservation
    $stmt = $pdo->prepare("
        INSERT INTO reservations (reserved_by_id, reserved_for_id, offer_id, qty, status)
        VALUES (?, NULL, ?, ?, 'PENDING')
    ");
    $stmt->execute([$reserved_by_id, $reserved_for_id, $offer_id, $qty_requested]);

    $reservation_id = $pdo->lastInsertId();

    // STEP 3: Reduce quantity from the offer
    $stmt = $pdo->prepare("
        UPDATE offers 
        SET qty = qty - ? 
        WHERE offer_id = ?
    ");
    $stmt->execute([$qty_requested, $offer_id]);

    // Commit transaction
    $pdo->commit();

    echo json_encode([
        'success' => true,
        'message' => 'Reservation created successfully',
        'reservation_id' => $reservation_id
    ]);

} catch (PDOException $e) {
    // Roll back if anything fails
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Database error'
    ]);
}
?>
