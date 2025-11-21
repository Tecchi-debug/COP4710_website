<?php
require_once '../config/cors.php';
require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'error' => 'Method not allowed'
    ]);
    exit;
}

if (!isset($_GET['offer_id'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'offer_id parameter is required'
    ]);
    exit;
}

$offer_id = intval($_GET['offer_id']);

try {
    // Query full offer details
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

            r.user_id AS restaurant_id,
            u.name AS restaurant_name,
            r.phone AS restaurant_phone

        FROM offers o
        INNER JOIN plates p ON o.plate_id = p.plate_id
        INNER JOIN restaurants r ON o.restaurant_id = r.user_id
        INNER JOIN users u ON r.user_id = u.user_id
        WHERE o.offer_id = ?
        LIMIT 1;
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([$offer_id]);
    $offer = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$offer) {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'error' => 'Offer not found'
        ]);
        exit;
    }

    echo json_encode([
        'success' => true,
        'offer' => $offer
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Database error'
    ]);
}
?>
