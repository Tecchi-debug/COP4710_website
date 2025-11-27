<?php 
require_once '../../config/cors.php';
require_once '../../config/database.php';

if($_SERVER['REQUEST_METHOD'] ===  'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    // get user_id, year, role and then check if the role matches the report we want to do
    $user_id = $input["user_id"];
    $role = $input["role"];
    $year = $input["year"];

    if($role == "donor") {
        $sql = <<<EOD
        SELECT 
            DATE(o.from_time) AS date,
            u_rest.name AS recipient_organization,
            p.name AS item_donated,
            (r.qty * o.price) AS donation_value
        FROM reservations r
        JOIN offers o ON r.offer_id = o.offer_id
        JOIN plates p ON o.plate_id = p.plate_id
        JOIN users u_rest ON o.restaurant_id = u_rest.user_id
        WHERE 
            r.reserved_by_id = ?       
            AND YEAR(o.from_time) = ?
        ORDER BY o.from_time ASC;
        EOD;
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$user_id, $year]);
        $result = $stmt->fetchall(PDO::FETCH_OBJ);

        $response = [
            "status" => "success",
            "report_data" => $result
        ];

        header("Content-Type: application/json");
        
        echo json_encode($response);
    } else {
        $response = [
            "status" => "fail",
            "data" => []
        ];

        echo json_encode($response);
    }
}
?>