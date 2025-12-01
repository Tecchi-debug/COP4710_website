<?php
require_once '../config/cors.php';
require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $restaurantId = $input['restaurant_id'] ?? null;
    $plateName = trim($input['plate_name'] ?? '');
    $plateDescription = trim($input['plate_description'] ?? '');
    
    // Validate required fields
    if (!$restaurantId || !$plateName) {
        http_response_code(400);
        echo json_encode(['error' => 'Restaurant ID and plate name are required']);
        exit;
    }
    
    // Validate restaurant exists
    try {
        $stmt = $pdo->prepare("SELECT user_id FROM restaurants WHERE user_id = ?");
        $stmt->execute([$restaurantId]);
        if (!$stmt->fetch()) {
            http_response_code(403);
            echo json_encode(['error' => 'Invalid restaurant']);
            exit;
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error']);
        exit;
    }
    
    try {
        // Check if plate with this name already exists for this restaurant
        $stmt = $pdo->prepare("
            SELECT p.plate_id 
            FROM plates p 
            JOIN offers o ON p.plate_id = o.plate_id 
            WHERE p.name = ? AND o.restaurant_id = ?
            LIMIT 1
        ");
        $stmt->execute([$plateName, $restaurantId]);
        
        if ($stmt->fetch()) {
            http_response_code(409);
            echo json_encode(['error' => 'A plate with this name already exists']);
            exit;
        }
        
        // Create new plate
        $stmt = $pdo->prepare("INSERT INTO plates (name, description) VALUES (?, ?)");
        $stmt->execute([$plateName, $plateDescription ?: null]);
        $plateId = $pdo->lastInsertId();
        
        echo json_encode([
            'success' => true, 
            'message' => 'Plate created successfully',
            'plate_id' => $plateId,
            'plate_name' => $plateName,
            'plate_description' => $plateDescription
        ]);
        
    } catch (PDOException $e) {
        error_log("Plate creation error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Database error occurred']);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
?>