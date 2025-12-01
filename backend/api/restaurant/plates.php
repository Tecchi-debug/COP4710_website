<?php
require_once '../config/cors.php';
require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $restaurantId = $_GET['restaurant_id'] ?? null;
    
    if (!$restaurantId) {
        http_response_code(400);
        echo json_encode(['error' => 'Restaurant ID is required']);
        exit;
    }
    
    try {
        // Get all unique plates that this restaurant has created offers for
        $sql = "
            SELECT DISTINCT
                p.plate_id,
                p.name as plate_name,
                p.description as plate_description,
                COUNT(o.offer_id) as total_offers,
                SUM(CASE WHEN o.qty > 0 AND o.to_time > NOW() THEN o.qty ELSE 0 END) as available_qty,
                MAX(o.from_time) as last_offered,
                MIN(o.price) as min_price,
                MAX(o.price) as max_price
            FROM plates p
            INNER JOIN offers o ON p.plate_id = o.plate_id
            WHERE o.restaurant_id = ?
            GROUP BY p.plate_id, p.name, p.description
            ORDER BY p.name ASC
        ";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([$restaurantId]);
        $plates = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            'success' => true, 
            'plates' => $plates
        ]);
        
    } catch (PDOException $e) {
        error_log("Restaurant plates error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Database error occurred']);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
?>