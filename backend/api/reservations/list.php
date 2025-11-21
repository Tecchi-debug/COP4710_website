<?php
require_once '../config/cors.php';
require_once '../config/database.php';

// Require user_id query parameter
if (!isset($_GET['user_id'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Missing user_id']);
    exit;
}

$user_id = intval($_GET['user_id']);

try {
    // Ensure the user_id corresponds to a customer
    $stmt = $pdo->prepare("SELECT user_id FROM customers WHERE user_id = ?");
    $stmt->execute([$user_id]);
    $isCustomer = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$isCustomer) {
        http_response_code(403);
        echo json_encode(['success' => false, 'error' => 'User is not a customer']);
        exit;
    }

    // Query reservations for this user
    $sql = "
        SELECT
            r.reservation_id,
            p.name AS offer_title,
            o.price AS offer_price,
            r.qty AS quantity,
            r.status,
            u.name AS restaurant_name,
            o.offer_id
        FROM reservations r
        JOIN offers o ON r.offer_id = o.offer_id
        JOIN plates p ON o.plate_id = p.plate_id
        JOIN restaurants rest ON o.restaurant_id = rest.user_id
        JOIN users u ON rest.user_id = u.user_id
        WHERE r.reserved_by_id = ?
        ORDER BY r.reservation_id DESC
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([$user_id]);
    $reservations = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'reservations' => $reservations
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Database error']);
}
?>
