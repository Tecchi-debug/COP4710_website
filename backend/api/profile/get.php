<?php
require_once '../config/cors.php';
require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $userId = $_GET['user_id'] ?? null;
    
    if (!$userId) {
        http_response_code(400);
        echo json_encode(['error' => 'User ID is required']);
        exit;
    }
    
    try {
        // Get basic user data
        $stmt = $pdo->prepare("SELECT user_id, name, email, addr, created_at FROM users WHERE user_id = ?");
        $stmt->execute([$userId]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$user) {
            http_response_code(404);
            echo json_encode(['error' => 'User not found']);
            exit;
        }
        
        // Determine user type and get additional data
        $userType = 'User';
        $additionalData = [];
        
        // Check for admin
        $stmt = $pdo->prepare("SELECT user_id FROM admins WHERE user_id = ?");
        $stmt->execute([$userId]);
        if ($stmt->fetch()) {
            $userType = 'Administrator';
        } else {
            // Check for restaurant
            $stmt = $pdo->prepare("SELECT user_id, phone FROM restaurants WHERE user_id = ?");
            $stmt->execute([$userId]);
            $restaurant = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($restaurant) {
                $userType = 'Restaurant';
                $additionalData['phone'] = $restaurant['phone'];
            } else {
                // Check for customer
                $stmt = $pdo->prepare("SELECT user_id, phone, c_card FROM customers WHERE user_id = ?");
                $stmt->execute([$userId]);
                $customer = $stmt->fetch(PDO::FETCH_ASSOC);
                if ($customer) {
                    $userType = 'Customer';
                    $additionalData['phone'] = $customer['phone'];
                    $additionalData['c_card'] = $customer['c_card'];
                } else {
                    // Check for donor
                    $stmt = $pdo->prepare("SELECT user_id, phone, c_card FROM donors WHERE user_id = ?");
                    $stmt->execute([$userId]);
                    $donor = $stmt->fetch(PDO::FETCH_ASSOC);
                    if ($donor) {
                        $userType = 'Donor';
                        $additionalData['phone'] = $donor['phone'];
                        $additionalData['c_card'] = $donor['c_card'];
                    } else {
                        // Check for needy
                        $stmt = $pdo->prepare("SELECT user_id FROM needys WHERE user_id = ?");
                        $stmt->execute([$userId]);
                        if ($stmt->fetch()) {
                            $userType = 'Needy';
                        }
                    }
                }
            }
        }
        
        $profile = array_merge($user, $additionalData, ['user_type' => $userType]);
        echo json_encode(['success' => true, 'profile' => $profile]);
        
    } catch (PDOException $e) {
        error_log("Profile get error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Database error occurred']);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
?>