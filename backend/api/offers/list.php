<?php
require_once '../config/cors.php';
require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    try {
        // Fetch all ACTIVE offers (qty > 0 AND still within time window)
        $sql = "
            SELECT 
                o.offer_id,
                o.price,
                o.qty,
                o.from_time,
                o.to_time,
                p.name AS plate_name,
                p.description AS plate_description,
                u.name AS restaurant_name
            FROM offers o
            INNER JOIN plates p ON o.plate_id = p.plate_id
            INNER JOIN restaurants r ON o.restaurant_id = r.user_id
            INNER JOIN users u ON r.user_id = u.user_id
            WHERE o.qty > 0
              AND o.to_time > NOW()
            ORDER BY o.from_time ASC;
        ";

        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $offers = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            'success' => true,
            'offers' => $offers
        ]);

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Database error'
        ]);
    }

} else {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'error' => 'Method not allowed'
    ]);
}
?>
