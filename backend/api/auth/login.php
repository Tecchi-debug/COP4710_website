<?php
require_once '../config/cors.php';
require_once '../config/database.php';

// API endpoint for user login
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || !isset($input['username']) || !isset($input['password'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing username or password']);
        exit;
    }
    
    $username = $input['username'];
    $password = $input['password'];
    
    try {
        // Use the PDO connection from database.php
        // $pdo is already available from the included file
        
        // Find user
        $stmt = $pdo->prepare("SELECT user_id, name, pwd FROM users WHERE name = ?");
        $stmt->execute([$username]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($user && password_verify($password, $user['pwd'])) {
            // Start session or create JWT token
            session_start();
            $_SESSION['user_id'] = $user['user_id'];
            $_SESSION['username'] = $user['name'];
            
            http_response_code(200);
            echo json_encode([
                'message' => 'Login successful',
                'user' => [
                    'id' => $user['user_id'],
                    'username' => $user['name']
                ]
            ]);
        } else {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid credentials']);
        }
        
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
?>