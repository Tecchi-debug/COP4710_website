<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once '../config/cors.php';
require_once '../config/database.php';

// API endpoint for user registration
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Validate input
    if (!$input) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid input']);
        exit;
    } else if (!isset($input['username'])) {
        http_response_code(400);
        echo json_encode(['error' => 'username is required']);
        exit;
    } else if (!isset($input['password'])) {
        http_response_code(400);
        echo json_encode(['error' => 'password is required']);
        exit;
    } else if (!isset($input['email'])) {
        http_response_code(400);
        echo json_encode(['error' => 'email is required']);
        exit;
    } else if (!isset($input['memberType'])) {
        http_response_code(400);
        echo json_encode(['error' => 'memberType is required']);
        exit;
    }
    
    $username = $input['username'];
    $password = password_hash($input['password'], PASSWORD_DEFAULT);
    $email = $input['email'];
    $memberType = $input['memberType'];
    $address = isset($input['address']) ? $input['address'] : null;
    $phone = isset($input['phoneNumber']) ? $input['phoneNumber'] : 'N/A';
    $creditCard = isset($input['creditCard']) ? $input['creditCard'] : 'N/A';

    // Validate based on type
    if (in_array($memberType, ['Customer', 'Donor'])){
        if (!$creditCard || $creditCard === 'N/A') {
            http_response_code(400);
            echo json_encode(['error' => 'Credit card required for Customers and Donors']);
            exit;
        }
    }

    if (in_array($memberType, ['Customer', 'Donor','Restaurant'])){
        if (!$phone || $phone === 'N/A' || trim($phone) === '') {
            http_response_code(400);
            echo json_encode(['error' => 'Phone Number required for Customers, Donors and Restaurants']);
            exit;
        }
    }
    try {
        // Check if user already exists with detailed debugging
        $stmt = $pdo->prepare("SELECT user_id, name, email FROM users WHERE name = ? OR email = ?");
        $stmt->execute([$username, $email]);
        
        $existingUser = $stmt->fetch();
        if ($existingUser) {
            // More specific error message
            if ($existingUser['name'] === $username) {
                http_response_code(409);
                echo json_encode(['error' => 'Username already exists']);
                exit;
            } else if ($existingUser['email'] === $email) {
                http_response_code(409);
                echo json_encode(['error' => 'Email already exists']);
                exit;
            }
        }
        
        // Start transaction to ensure both inserts succeed or both fail
        $pdo->beginTransaction();
        
        try {
            // Insert new user - matching your table structure: user_id, name, email, pwd, addr, created_at
            $stmt = $pdo->prepare("INSERT INTO users (name, email, pwd, addr) VALUES (?, ?, ?, ?)");
            $stmt->execute([$username, $email, $password, $address]);
            
            $userId = $pdo->lastInsertId();
            
            // Insert into specific member type table
            switch ($memberType) {
                case 'Administrator':
                    $stmt = $pdo->prepare("INSERT INTO admins (user_id) VALUES (?)");
                    $stmt->execute([$userId]);
                    break;
                    
                case 'Customer':
                    $stmt = $pdo->prepare("INSERT INTO customers (user_id, phone, c_card) VALUES (?, ?, ?)");
                    $stmt->execute([$userId, $phone, $creditCard]);
                    break;
                    
                case 'Donor':
                    $stmt = $pdo->prepare("INSERT INTO donors (user_id, phone, c_card) VALUES (?, ?, ?)");
                    $stmt->execute([$userId, $phone, $creditCard]);
                    break;
                    
                case 'Needy':
                    $stmt = $pdo->prepare("INSERT INTO needys (user_id) VALUES (?)");
                    $stmt->execute([$userId]);
                    break;
                    
                case 'Restaurant':
                    $stmt = $pdo->prepare("INSERT INTO restaurants (user_id, phone) VALUES (?, ?)");
                    $stmt->execute([$userId, $phone]);
                    break;
                    
                default:
                    throw new Exception("Invalid member type: " . $memberType);
            }
            
            // Commit the transaction
            $pdo->commit();
            
            http_response_code(201);
            echo json_encode(['message' => 'User registered successfully']);
            
        } catch (Exception $e) {
            // Rollback the transaction on error
            $pdo->rollback();
            throw $e;
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
