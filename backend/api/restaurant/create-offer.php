<?php
require_once '../config/cors.php';
require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $restaurantId = $input['restaurant_id'] ?? null;
    $plateId = $input['plate_id'] ?? null;
    $price = $input['price'] ?? null;
    $qty = $input['qty'] ?? null;
    $fromTime = $input['from_time'] ?? null;
    $toTime = $input['to_time'] ?? null;
    
    // Validate required fields
    if (!$restaurantId || !$plateId || !$price || !$qty || !$fromTime || !$toTime) {
        http_response_code(400);
        echo json_encode(['error' => 'All fields are required']);
        exit;
    }
    
    // Validate price and quantity
    if (!is_numeric($price) || $price <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Price must be a positive number']);
        exit;
    }
    
    if (!is_numeric($qty) || $qty <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Quantity must be a positive number']);
        exit;
    }
    
    // Validate time window
    $fromDateTime = DateTime::createFromFormat('Y-m-d\TH:i', $fromTime);
    $toDateTime = DateTime::createFromFormat('Y-m-d\TH:i', $toTime);
    $now = new DateTime();
    
    if (!$fromDateTime || !$toDateTime) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid date format']);
        exit;
    }
    
    if ($fromDateTime <= $now) {
        http_response_code(400);
        echo json_encode(['error' => 'Start time must be in the future']);
        exit;
    }
    
    if ($toDateTime <= $fromDateTime) {
        http_response_code(400);
        echo json_encode(['error' => 'End time must be after start time']);
        exit;
    }
    
    try {
        // Validate that the plate exists and belongs to this restaurant (or is available to all)
        $stmt = $pdo->prepare("SELECT plate_id FROM plates WHERE plate_id = ?");
        $stmt->execute([$plateId]);
        if (!$stmt->fetch()) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid plate selected']);
            exit;
        }
        
        // Create the offer
        $stmt = $pdo->prepare("
            INSERT INTO offers (restaurant_id, plate_id, from_time, to_time, qty, price) 
            VALUES (?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $restaurantId,
            $plateId,
            $fromDateTime->format('Y-m-d H:i:s'),
            $toDateTime->format('Y-m-d H:i:s'),
            $qty,
            $price
        ]);
        
        $offerId = $pdo->lastInsertId();
        
        echo json_encode([
            'success' => true, 
            'message' => 'Offer created successfully',
            'offer_id' => $offerId
        ]);
        
    } catch (PDOException $e) {
        error_log("Offer creation error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Database error occurred']);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
?>