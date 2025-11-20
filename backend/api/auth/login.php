<?php
require_once '../config/cors.php';
require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $username = $input['username'];
    $password = $input['password'];
    
    try {
        // Get user data
        $stmt = $pdo->prepare("SELECT user_id, name, pwd FROM users WHERE name = ?");
        $stmt->execute([$username]);
        $user = $stmt->fetch();
        
        if ($user && password_verify($password, $user['pwd'])) {
            // Determine user type by checking which table contains the user_id
            $userType = 'User'; // Default
            
            $stmt = $pdo->prepare("SELECT user_id FROM admins WHERE user_id = ?");
            $stmt->execute([$user['user_id']]);
            if ($stmt->fetch()) {
                $userType = 'Administrator';
            } else {
                $stmt = $pdo->prepare("SELECT user_id FROM restaurants WHERE user_id = ?");
                $stmt->execute([$user['user_id']]);
                if ($stmt->fetch()) {
                    $userType = 'Restaurant';
                } else {
                    $stmt = $pdo->prepare("SELECT user_id FROM customers WHERE user_id = ?");
                    $stmt->execute([$user['user_id']]);
                    if ($stmt->fetch()) {
                        $userType = 'Customer';
                    } else {
                        $stmt = $pdo->prepare("SELECT user_id FROM donors WHERE user_id = ?");
                        $stmt->execute([$user['user_id']]);
                        if ($stmt->fetch()) {
                            $userType = 'Donor';
                        } else {
                            $stmt = $pdo->prepare("SELECT user_id FROM needys WHERE user_id = ?");
                            $stmt->execute([$user['user_id']]);
                            if ($stmt->fetch()) {
                                $userType = 'Needy';
                            }
                        }
                    }
                }
            }
            
            echo json_encode([
                'success' => true,
                'message' => 'Login successful',
                'user_id' => $user['user_id'],
                'username' => $user['name'],
                'user_type' => $userType
            ]);
        } else {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid credentials']);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error']);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
?>