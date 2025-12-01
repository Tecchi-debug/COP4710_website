<?php
require_once '../config/cors.php';
require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $userId = $input['user_id'] ?? null;
    $name = $input['name'] ?? null;
    $email = $input['email'] ?? null;
    $addr = $input['addr'] ?? null;
    $phone = $input['phone'] ?? null;
    $c_card = $input['c_card'] ?? null;
    
    if (!$userId) {
        http_response_code(400);
        echo json_encode(['error' => 'User ID is required']);
        exit;
    }
    
    try {
        $pdo->beginTransaction();
        
        // Update basic user data
        $stmt = $pdo->prepare("UPDATE users SET name = ?, email = ?, addr = ? WHERE user_id = ?");
        $stmt->execute([$name, $email, $addr, $userId]);
        
        // Determine user type to update additional data
        $userType = '';
        
        // Check what type of user this is
        $stmt = $pdo->prepare("SELECT user_id FROM restaurants WHERE user_id = ?");
        $stmt->execute([$userId]);
        if ($stmt->fetch()) {
            $userType = 'Restaurant';
            // Update restaurant phone
            if ($phone !== null) {
                $stmt = $pdo->prepare("UPDATE restaurants SET phone = ? WHERE user_id = ?");
                $stmt->execute([$phone, $userId]);
            }
        } else {
            $stmt = $pdo->prepare("SELECT user_id FROM customers WHERE user_id = ?");
            $stmt->execute([$userId]);
            if ($stmt->fetch()) {
                $userType = 'Customer';
                // Update customer phone and credit card
                if ($phone !== null || $c_card !== null) {
                    $stmt = $pdo->prepare("UPDATE customers SET phone = ?, c_card = ? WHERE user_id = ?");
                    $stmt->execute([$phone, $c_card, $userId]);
                }
            } else {
                $stmt = $pdo->prepare("SELECT user_id FROM donors WHERE user_id = ?");
                $stmt->execute([$userId]);
                if ($stmt->fetch()) {
                    $userType = 'Donor';
                    // Update donor phone and credit card
                    if ($phone !== null || $c_card !== null) {
                        $stmt = $pdo->prepare("UPDATE donors SET phone = ?, c_card = ? WHERE user_id = ?");
                        $stmt->execute([$phone, $c_card, $userId]);
                    }
                }
            }
        }
        
        $pdo->commit();
        echo json_encode(['success' => true, 'message' => 'Profile updated successfully']);
        
    } catch (PDOException $e) {
        $pdo->rollBack();
        error_log("Profile update error: " . $e->getMessage());
        
        // Check for duplicate email error
        if (strpos($e->getMessage(), 'Duplicate entry') !== false && strpos($e->getMessage(), 'email') !== false) {
            http_response_code(400);
            echo json_encode(['error' => 'Email address is already in use']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Database error occurred']);
        }
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
?>