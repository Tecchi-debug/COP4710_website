CREATE TABLE IF NOT EXISTS users (
    uid INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    credit_card VARCHAR(20),
    phone VARCHAR(20),
    role ENUM('admin', 'restaurant', 'customer', 'donor', 'needy') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS plates (
    pid INT AUTO_INCREMENT PRIMARY KEY,
    rid INT NOT NULL,
    price DECIMAL(8,2) NOT NULL,
    qty INT NOT NULL,
    end_time TIME NOT NULL,
    FOREIGN KEY (rid) REFERENCES users(uid)
);

CREATE TABLE IF NOT EXISTS orders(
    oid INT AUTO_INCREMENT PRIMARY KEY,
    payer_id INT NOT NULL,
    receiver_id INT NOT NULL,
    total DECIMAL(8,2) NOT NULL,
    FOREIGN KEY (payer_id) REFERENCES users(uid),    
    FOREIGN KEY (receiver_id_id) REFERENCES users(uid),    
);

CREATE TABLE IF NOT EXISTS order_item (
    oid INT NOT NULL,
    pid INT NOT NULL,
    qty INT NOT NULL,
    PRIMARY KEY (oid, pid),
    FOREIGN KEY (oid) REFERENCES orders(oid),
    FOREIGN KEY (pid) REFERENCES plates(pid)
);
