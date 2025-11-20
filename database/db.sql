USE wnk_db;

CREATE TABLE users (
    user_id      BIGINT PRIMARY KEY AUTO_INCREMENT,
    name         VARCHAR(100) NOT NULL,
    email        VARCHAR(120) UNIQUE NOT NULL,
    pwd          VARCHAR(255) NOT NULL,
    addr         VARCHAR(200),
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE admins (
    user_id BIGINT PRIMARY KEY,
    CONSTRAINT fk_admin_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE
);

CREATE TABLE customers (
    user_id BIGINT PRIMARY KEY,
    phone   VARCHAR(30),
    c_card  VARCHAR(100),
    CONSTRAINT fk_customer_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE
);

CREATE TABLE donors (
    user_id BIGINT PRIMARY KEY,
    phone   VARCHAR(30),
    c_card  VARCHAR(100),
    CONSTRAINT fk_donor_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE
);

CREATE TABLE needys (
    user_id   BIGINT PRIMARY KEY,
    CONSTRAINT fk_needy_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE
);

CREATE TABLE restaurants (
    user_id BIGINT PRIMARY KEY,
    phone   VARCHAR(30),
    CONSTRAINT fk_restaurant_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE
);

CREATE TABLE reports (
    report_id    BIGINT PRIMARY KEY AUTO_INCREMENT,
    report_type  VARCHAR(50) NOT NULL,
    report_year  INT,
    report       VARCHAR(50) NOT NULL,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE plates (
    plate_id     BIGINT PRIMARY KEY AUTO_INCREMENT,
    description  TEXT,
    name         VARCHAR(120)
);

CREATE TABLE offers (
    offer_id      BIGINT PRIMARY KEY AUTO_INCREMENT,
    restaurant_id BIGINT NOT NULL,
    plate_id      BIGINT NOT NULL,
    from_time     TIMESTAMP NOT NULL,
    to_time       TIMESTAMP NOT NULL,
    qty           INT NOT NULL,
    price         DECIMAL(10, 2) NOT NULL,
    CONSTRAINT fk_offer_restaurant
        FOREIGN KEY (restaurant_id) REFERENCES restaurants(user_id),
    CONSTRAINT fk_offer_plate
        FOREIGN KEY (plate_id) REFERENCES plates(plate_id)
        ON DELETE RESTRICT
);

CREATE TABLE reservations (
    reservation_id   BIGINT PRIMARY KEY AUTO_INCREMENT,
    reserved_by_id   BIGINT NOT NULL,  -- customer/donor/needy
    reserved_for_id  BIGINT NULL,      -- for donor → needy cases
    offer_id         BIGINT NOT NULL,
    qty              INT NOT NULL DEFAULT 1,
    status           VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    CONSTRAINT fk_res_by
        FOREIGN KEY (reserved_by_id) REFERENCES users(user_id),
    CONSTRAINT fk_res_for
        FOREIGN KEY (reserved_for_id) REFERENCES users(user_id),
    CONSTRAINT fk_res_offer
        FOREIGN KEY (offer_id) REFERENCES offers(offer_id)
        ON DELETE RESTRICT
);

CREATE TABLE user_pickups (
    user_id        BIGINT NOT NULL,
    reservation_id BIGINT NOT NULL,
    pickup_time    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, reservation_id),
    CONSTRAINT fk_pickup_user
        FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT fk_pickup_reservation
        FOREIGN KEY (reservation_id) REFERENCES reservations(reservation_id)
        ON DELETE CASCADE
);