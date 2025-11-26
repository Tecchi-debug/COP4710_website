<?php 
require_once '../../config/cors.php';
require_once '../../config/database.php';

if($_SERVER['REQUEST_METHOD'] ===  'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    // get user_id, year, role and then check if the role matches the report we want to do
    $user_id = $input["user_id"];
    $role = $input["role"];
    $year = $input["year"];

    if($role == "restaurant") {
        $sql = <<<EOD
        SELECT 
            p.name AS plate_name,
            COUNT(r.reservation_id) AS total_orders,
            SUM(r.qty) AS total_items_sold,
            SUM(r.qty * o.price) AS total_revenue,
            MONTH(o.from_time) AS activity_month
        FROM reservations r
        JOIN offers o ON r.offer_id = o.offer_id
        JOIN plates p ON o.plate_id = p.plate_id
        WHERE 
            o.restaurant_id = ?          
            AND YEAR(o.from_time) = ?   
            AND r.status != 'CANCELLED'
        GROUP BY p.name, MONTH(o.from_time)
        ORDER BY activity_month DESC;
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