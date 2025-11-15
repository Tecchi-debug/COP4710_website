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
 * Fresh Database Setup Script
 * Drops existing database and creates everything fresh
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
    
    // Step 2: Drop and recreate database
    $pdo->exec("DROP DATABASE IF EXISTS `$dbname`");
    $pdo->exec("CREATE DATABASE `$dbname`");
    echo "Database '$dbname' recreated successfully.\n";
    
    // Step 3: Select the database
    $pdo->exec("USE `$dbname`");
    echo "Using database '$dbname'.\n";
    
    // Step 4: Create all tables in correct order
    $sql_commands = [
        "CREATE TABLE users (
            user_id      BIGINT PRIMARY KEY AUTO_INCREMENT,
            name         VARCHAR(100) NOT NULL,
            email        VARCHAR(120) UNIQUE NOT NULL,
            pwd          VARCHAR(255) NOT NULL,
            addr         VARCHAR(200),
            created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )",
        
        "CREATE TABLE admins (
            user_id BIGINT PRIMARY KEY,
            CONSTRAINT fk_admin_user
                FOREIGN KEY (user_id) REFERENCES users(user_id)
                ON DELETE CASCADE
        )",
        
        "CREATE TABLE customers (
            user_id BIGINT PRIMARY KEY,
            phone   VARCHAR(30),
            c_card  VARCHAR(100),
            CONSTRAINT fk_customer_user
                FOREIGN KEY (user_id) REFERENCES users(user_id)
                ON DELETE CASCADE
        )",
        
        "CREATE TABLE donors (
            user_id BIGINT PRIMARY KEY,
            phone   VARCHAR(30),
            c_card  VARCHAR(100),
            CONSTRAINT fk_donor_user
                FOREIGN KEY (user_id) REFERENCES users(user_id)
                ON DELETE CASCADE
        )",
        
        "CREATE TABLE needys (
            user_id   BIGINT PRIMARY KEY,
            CONSTRAINT fk_needy_user
                FOREIGN KEY (user_id) REFERENCES users(user_id)
                ON DELETE CASCADE
        )",
        
        "CREATE TABLE restaurants (
            user_id BIGINT PRIMARY KEY,
            phone   VARCHAR(30),
            CONSTRAINT fk_restaurant_user
                FOREIGN KEY (user_id) REFERENCES users(user_id)
                ON DELETE CASCADE
        )",
        
        "CREATE TABLE reports (
            report_id    BIGINT PRIMARY KEY AUTO_INCREMENT,
            report_type  VARCHAR(50) NOT NULL,
            report_year  INT,
            report       VARCHAR(50) NOT NULL,
            created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )",
        
        "CREATE TABLE plates (
            plate_id     BIGINT PRIMARY KEY AUTO_INCREMENT,
            description  TEXT,
            name         VARCHAR(120)
        )",
        
        "CREATE TABLE offers (
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
                ON DELETE CASCADE
        )",
        
        "CREATE TABLE reservations (
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
        
        "CREATE TABLE user_pickups (
            user_id        BIGINT NOT NULL,
            reservation_id BIGINT NOT NULL,
            pickup_time    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (user_id, reservation_id),
            CONSTRAINT fk_pickup_user
                FOREIGN KEY (user_id) REFERENCES users(user_id)
                ON DELETE CASCADE,
            CONSTRAINT fk_pickup_reservation
                FOREIGN KEY (reservation_id) REFERENCES reservations(reservation_id)
                ON DELETE CASCADE
        )"
    ];
    
    $table_names = ['users', 'admins', 'customers', 'donors', 'needys', 'restaurants', 'reports', 'plates', 'offers', 'reservations', 'user_pickups'];
    $created_tables = [];
    $failed_tables = [];
    
    // Execute each SQL command
    for ($i = 0; $i < count($sql_commands); $i++) {
        try {
            $pdo->exec($sql_commands[$i]);
            $created_tables[] = $table_names[$i];
            echo "✓ Table '{$table_names[$i]}' created successfully.\n";
        } catch (PDOException $e) {
            $failed_tables[] = ['table' => $table_names[$i], 'error' => $e->getMessage()];
            echo "✗ Failed to create table '{$table_names[$i]}': " . $e->getMessage() . "\n";
        }
    }
    
    // Step 5: Verify all tables exist
    $stmt = $pdo->query("SHOW TABLES");
    $existing_tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    echo "\n=== DATABASE SETUP COMPLETE ===\n";
    echo "Database: $dbname\n";
    echo "Tables created: " . count($created_tables) . "/" . count($table_names) . "\n";
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
        http_response_code(207);
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