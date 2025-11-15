<?php
require_once '../config/cors.php';
require_once '../config/database.php';

// API endpoint for user registration
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || !isset($input['username']) || !isset($input['password']) || !isset($input['email'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing required fields']);
        exit;
    }
    
    $username = $input['username'];
    $password = password_hash($input['password'], PASSWORD_DEFAULT);
    $email = $input['email'];
    
    try {
        // Use the PDO connection from database.php
        // $pdo is already available from the included file
        
        // Check if user already exists
        $stmt = $pdo->prepare("SELECT user_id FROM users WHERE name = ? OR email = ?");
        $stmt->execute([$username, $email]);
        
        if ($stmt->fetch()) {
            http_response_code(409);
            echo json_encode(['error' => 'User already exists']);
            exit;
        }
        
        // Insert new user
        $stmt = $pdo->prepare("INSERT INTO users (name, pwd, email) VALUES (?, ?, ?)");
        $stmt->execute([$username, $password, $email]);
        
        http_response_code(201);
        echo json_encode(['message' => 'User registered successfully']);
        
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
?>