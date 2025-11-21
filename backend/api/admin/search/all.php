<?php 
require_once '../config/cors.php';
require_once '../config/database.php';

if($_SERVER['REQUEST_METHOD'] === 'POST') {

    $stmt = $pdo->prepare(
    <<<EOT
    SELECT u.user_id, u.name, u.email, u.addr,
    CASE 
        WHEN r.user_id IS NOT NULL THEN 'restaurant'
        WHEN c.user_id IS NOT NULL THEN 'customer'
        WHEN d.user_id IS NOT NULL THEN 'donor'
        WHEN n.user_id IS NOT NULL THEN 'needy'
    END AS role
    FROM users u
    LEFT JOIN restaurants r ON u.user_id = r.user_id
    LEFT JOIN customers c ON u.user_id = c.user_id
    LEFT JOIN donors d ON u.user_id = d.user_id
    LEFT JOIN needys n ON u.user_id = n.user_id
    WHERE 
        r.user_id IS NOT NULL 
        OR c.user_id IS NOT NULL 
        OR d.user_id IS NOT NULL 
        OR n.user_id IS NOT NULL
    ORDER BY role ASC;
EOT);
    $stmt->execute();
}
    
?>