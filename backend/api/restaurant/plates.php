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
        // First, let's get all plates (for now, we'll return all plates since we don't have a restaurant_id field in plates table)
        // TODO: Add restaurant_id to plates table for proper filtering
        $sql = "
            SELECT 
                p.plate_id,
                p.name as plate_name,
                p.description as plate_description,
                COALESCE(stats.total_offers, 0) as total_offers,
                COALESCE(stats.available_qty, 0) as available_qty,
                stats.last_offered,
                stats.min_price,
                stats.max_price
            FROM plates p
            LEFT JOIN (
                SELECT 
                    plate_id,
                    COUNT(offer_id) as total_offers,
                    SUM(CASE WHEN qty > 0 AND to_time > NOW() THEN qty ELSE 0 END) as available_qty,
                    MAX(from_time) as last_offered,
                    MIN(price) as min_price,
                    MAX(price) as max_price
                FROM offers
                WHERE restaurant_id = ?
                GROUP BY plate_id
            ) stats ON p.plate_id = stats.plate_id
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