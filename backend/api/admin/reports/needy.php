<?php 
require_once '../../config/cors.php';
require_once '../../config/database.php';

if($_SERVER['REQUEST_METHOD'] ===  'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    // get user_id, year, role and then check if the role matches the report we want to do
    $user_id = $input["user_id"];
    $role = $input["role"];
    $year = $input["year"];

    if($role == "needy") {
        $sql = <<<EOD
        SELECT 
            o.from_time AS received_date,
            u_rest.name AS provided_by_restaurant,
            p.name AS meal_name,
            r.qty AS quantity,
            CASE 
                WHEN r.reserved_for_id = ? THEN 'Donation' 
                ELSE 'Direct Claim'
            END AS reception_type
        FROM reservations r
        JOIN offers o ON r.offer_id = o.offer_id
        JOIN plates p ON o.plate_id = p.plate_id
        JOIN users u_rest ON o.restaurant_id = u_rest.user_id
        WHERE 
            (r.reserved_by_id = ? OR r.reserved_for_id = ?)  
            AND YEAR(o.from_time) = ?                        
            AND r.status = 'COMPLETED'
        ORDER BY o.from_time DESC;
        EOD;
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$user_id, $user_id, $user_id, $year]);
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