<?php
// Add CORS headers for API access
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

/**
 * Automated Database Setup Script
 * Creates the entire wnk_db database with all required tables
 */

// Database configuration
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "wnk_db";

try {
    // Step 1: Connect to MySQL server (without database)
    $pdo = new PDO("mysql:host=$servername;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "Connected to MySQL server successfully.\n";
    
    // Step 2: Create database
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `$dbname`");
    echo "Database '$dbname' created or already exists.\n";
    
    // Step 3: Select the database
    $pdo->exec("USE `$dbname`");
    echo "Using database '$dbname'.\n";
    
    // Step 4: Create all tables
    $tables = [
        'users' => "
            CREATE TABLE IF NOT EXISTS users (
                user_id      BIGINT PRIMARY KEY AUTO_INCREMENT,
                name         VARCHAR(100) NOT NULL,
                email        VARCHAR(120) UNIQUE NOT NULL,
                pwd          VARCHAR(255) NOT NULL,
                addr         VARCHAR(200),
                created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )",
            
        'admins' => "
            CREATE TABLE IF NOT EXISTS admins (
                user_id BIGINT PRIMARY KEY,
                CONSTRAINT fk_admin_user
                    FOREIGN KEY (user_id) REFERENCES users(user_id)
                    ON DELETE CASCADE
            )",
            
        'customers' => "
            CREATE TABLE IF NOT EXISTS customers (
                user_id BIGINT PRIMARY KEY,
                phone   VARCHAR(30),
                c_card  VARCHAR(100),
                CONSTRAINT fk_customer_user
                    FOREIGN KEY (user_id) REFERENCES users(user_id)
                    ON DELETE CASCADE
            )",
            
        'donors' => "
            CREATE TABLE IF NOT EXISTS donors (
                user_id BIGINT PRIMARY KEY,
                phone   VARCHAR(30),
                c_card  VARCHAR(100),
                CONSTRAINT fk_donor_user
                    FOREIGN KEY (user_id) REFERENCES users(user_id)
                    ON DELETE CASCADE
            )",
            
        'needys' => "
            CREATE TABLE IF NOT EXISTS needys (
                user_id   BIGINT PRIMARY KEY,
                CONSTRAINT fk_needy_user
                    FOREIGN KEY (user_id) REFERENCES users(user_id)
                    ON DELETE CASCADE
            )",
            
        'restaurants' => "
            CREATE TABLE IF NOT EXISTS restaurants (
                user_id BIGINT PRIMARY KEY,
                phone   VARCHAR(30),
                CONSTRAINT fk_restaurant_user
                    FOREIGN KEY (user_id) REFERENCES users(user_id)
                    ON DELETE CASCADE
            )",
            
        'reports' => "
            CREATE TABLE IF NOT EXISTS reports (
                report_id    BIGINT PRIMARY KEY AUTO_INCREMENT,
                report_type  VARCHAR(50) NOT NULL,
                report_year  INT,
                report       VARCHAR(50) NOT NULL,
                created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )",
            
        'plates' => "
            CREATE TABLE IF NOT EXISTS plates (
                plate_id     BIGINT PRIMARY KEY AUTO_INCREMENT,
                description  TEXT,
                name         VARCHAR(120)
            )",
            
        'offers' => "
            CREATE TABLE IF NOT EXISTS offers (
                offer_id      BIGINT PRIMARY KEY AUTO_INCREMENT,
                restaurant_id BIGINT NOT NULL,
                plate_id      BIGINT NOT NULL,
                from_time     DATETIME NOT NULL,
                to_time       DATETIME NOT NULL,
                qty           INT NOT NULL,
                price         DECIMAL(10, 2) NOT NULL,
                CONSTRAINT fk_offer_restaurant
                    FOREIGN KEY (restaurant_id) REFERENCES restaurants(user_id)
                    ON DELETE CASCADE,
                CONSTRAINT fk_offer_plate
                    FOREIGN KEY (plate_id) REFERENCES plates(plate_id)
                    ON DELETE RESTRICT
            )",
            
        'reservations' => "
            CREATE TABLE IF NOT EXISTS reservations (
                reservation_id   BIGINT PRIMARY KEY AUTO_INCREMENT,
                reserved_by_id   BIGINT NOT NULL,
                reserved_for_id  BIGINT NULL,
                offer_id         BIGINT NOT NULL,
                qty              INT NOT NULL DEFAULT 1,
                status           VARCHAR(30) NOT NULL DEFAULT 'PENDING',
                CONSTRAINT fk_res_by
                    FOREIGN KEY (reserved_by_id) REFERENCES users(user_id)
                    ON DELETE CASCADE,
                CONSTRAINT fk_res_for
                    FOREIGN KEY (reserved_for_id) REFERENCES users(user_id)
                    ON DELETE SET NULL,
                CONSTRAINT fk_res_offer
                    FOREIGN KEY (offer_id) REFERENCES offers(offer_id)
                    ON DELETE CASCADE
            )",
            
        'user_pickups' => "
            CREATE TABLE IF NOT EXISTS user_pickups (
                user_id        BIGINT NOT NULL,
                reservation_id BIGINT NOT NULL,
                pickup_time    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (user_id, reservation_id),
                CONSTRAINT fk_pickup_user
                    FOREIGN KEY (user_id) REFERENCES users(user_id),
                CONSTRAINT fk_pickup_reservation
                    FOREIGN KEY (reservation_id) REFERENCES reservations(reservation_id)
                    ON DELETE CASCADE
            )"
    ];
    
    // Create tables in order (respecting foreign key dependencies)
    $created_tables = [];
    $failed_tables = [];
    
    foreach ($tables as $table_name => $sql) {
        try {
            $pdo->exec($sql);
            $created_tables[] = $table_name;
            echo "✓ Table '$table_name' created successfully.\n";
        } catch (PDOException $e) {
            $failed_tables[] = ['table' => $table_name, 'error' => $e->getMessage()];
            echo "✗ Failed to create table '$table_name': " . $e->getMessage() . "\n";
        }
    }
    
    // Step 5: Verify all tables exist
    $stmt = $pdo->query("SHOW TABLES");
    $existing_tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    echo "\n=== DATABASE SETUP COMPLETE ===\n";
    echo "Database: $dbname\n";
    echo "Tables created: " . count($created_tables) . "/" . count($tables) . "\n";
    echo "Existing tables: " . implode(', ', $existing_tables) . "\n";
    
    if (empty($failed_tables)) {
        $response = [
            'status' => 'success',
            'message' => 'Database and all tables created successfully!',
            'database' => $dbname,
            'tables_created' => $created_tables,
            'total_tables' => count($existing_tables)
        ];
        http_response_code(200);
    } else {
        $response = [
            'status' => 'partial_success',
            'message' => 'Database created but some tables failed',
            'database' => $dbname,
            'tables_created' => $created_tables,
            'failed_tables' => $failed_tables,
            'total_tables' => count($existing_tables)
        ];
        http_response_code(207); // Multi-status
    }
    
    echo json_encode($response, JSON_PRETTY_PRINT);
    
} catch (PDOException $e) {
    $error_response = [
        'status' => 'error',
        'message' => 'Database setup failed: ' . $e->getMessage()
    ];
    echo "ERROR: " . $e->getMessage() . "\n";
    echo json_encode($error_response, JSON_PRETTY_PRINT);
    http_response_code(500);
}
?>