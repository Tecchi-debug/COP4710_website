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
        // Get all offers for this restaurant with aggregated data
        $sql = "
            SELECT 
                o.offer_id,
                o.price,
                o.qty,
                o.from_time,
                o.to_time,
                p.plate_id,
                p.name AS plate_name,
                p.description AS plate_description,
                (o.qty > 0 AND o.to_time > NOW()) as is_active,
                COALESCE(SUM(CASE WHEN res.status != 'CANCELLED' THEN res.qty ELSE 0 END), 0) as reserved_qty,
                COUNT(CASE WHEN res.status != 'CANCELLED' THEN res.reservation_id END) as reservation_count
            FROM offers o
            INNER JOIN plates p ON o.plate_id = p.plate_id
            LEFT JOIN reservations res ON o.offer_id = res.offer_id
            WHERE o.restaurant_id = ?
            GROUP BY o.offer_id
            ORDER BY o.from_time DESC
        ";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([$restaurantId]);
        $offers = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Get summary statistics
        $summarySQL = "
            SELECT 
                COUNT(DISTINCT o.offer_id) as total_offers,
                COUNT(CASE WHEN o.qty > 0 AND o.to_time > NOW() THEN 1 END) as active_offers,
                COALESCE(SUM(CASE WHEN o.qty > 0 AND o.to_time > NOW() THEN o.qty ELSE 0 END), 0) as available_quantity,
                COALESCE(SUM(CASE WHEN res.status != 'CANCELLED' THEN res.qty ELSE 0 END), 0) as reserved_quantity
            FROM offers o
            LEFT JOIN reservations res ON o.offer_id = res.offer_id
            WHERE o.restaurant_id = ?
        ";

        $stmt = $pdo->prepare($summarySQL);
        $stmt->execute([$restaurantId]);
        $summary = $stmt->fetch(PDO::FETCH_ASSOC);

        echo json_encode([
            'success' => true, 
            'offers' => $offers,
            'summary' => $summary
        ]);
        
    } catch (PDOException $e) {
        error_log("Restaurant dashboard error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Database error occurred']);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
?>