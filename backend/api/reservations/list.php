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
    // Determine user role (customer, donor, needy)
    $role = null;

    $roleTables = [
        "customer" => "customers",
        "donor" => "donors",
        "needy" => "needys"
    ];

    foreach ($roleTables as $key => $table) {
        $stmt = $pdo->prepare("SELECT user_id FROM $table WHERE user_id = ?");
        $stmt->execute([$user_id]);
        if ($stmt->fetch(PDO::FETCH_ASSOC)) {
            $role = $key;
            break;
        }
    }

    if ($role === null) {
        http_response_code(403);
        echo json_encode(['success' => false, 'error' => 'User has no valid role']);
        exit;
    }

    $sql = "
        SELECT
            r.reservation_id,
            p.name AS plate_name,
            p.description AS description,
            o.price AS price,
            r.qty AS qty,
            r.status,
            restu.name AS restaurant_name,
            o.offer_id
        FROM reservations r
        JOIN offers o ON r.offer_id = o.offer_id
        JOIN plates p ON o.plate_id = p.plate_id
        JOIN restaurants rest ON o.restaurant_id = rest.user_id
        JOIN users restu ON rest.user_id = restu.user_id
        WHERE (r.reserved_by_id = ? OR r.reserved_for_id = ?)
        ORDER BY r.reservation_id DESC
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([$user_id, $user_id]);
    $reservations = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'reservations' => $reservations,
        'role' => $role
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Database error']);
}
?>
