<?php
require_once '../../config/cors.php';
require_once '../../config/database.php';

if($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $type = $input['type'];
    $sql_query = "";

    // sql based on the type received from the request
    if($type === "customers") {
        $sql_query = <<<EOD
        SELECT u.user_id, u.name, u.email, c.phone, 'customer' AS role
        FROM users u
        JOIN customers c ON u.user_id = c.user_id; 
        EOD;
    } elseif($type === "donors") {
        $sql_query = <<<EOD
        SELECT u.user_id, u.name, u.email, d.phone, 'donor' AS role
        FROM users u
        JOIN donors d ON u.user_id = d.user_id;
        EOD;
    } elseif($type === "needy") {
        $sql_query = <<<EOD
        SELECT u.user_id, u.name, u.email, 'needy' AS role
        FROM users u
        JOIN needys n ON u.user_id = n.user_id;
        EOD;
    } elseif($type == "restaurants") {
        $sql_query = <<<EOD
        SELECT u.user_id, u.name, u.email, r.phone, 'restaurant' AS role
        FROM users u
        JOIN restaurants r ON u.user_id = r.user_id;
        EOD;
    }

    // execution and return
    $stmt = $pdo->query($sql_query);
    $results = $stmt->fetchall(PDO::FETCH_OBJ);
    header('Content-Type: application/json');
    echo json_encode($results);
}
?>