-- Test data created using a Large Language Model for ease of testing
USE wnk_db;
-- 1. Create Base Users (31 Total)
-- Password 'pass123' is used for everyone for simplicity
INSERT INTO users (user_id, name, email, pwd, addr) VALUES 
(1, 'Admin User', 'admin@wnk.com', 'pass123', 'Admin HQ'),
-- Restaurants (2-6)
(2, 'Burger King', 'contact@bk.com', 'pass123', '123 Main St'),
(3, 'Pizza Hut', 'manager@pizzahut.com', 'pass123', '456 Oak Ave'),
(4, 'Subway', 'fresh@subway.com', 'pass123', '789 Pine Ln'),
(5, 'Taco Bell', 'yo@tacobell.com', 'pass123', '321 Elm St'),
(6, 'Olive Garden', 'info@olivegarden.com', 'pass123', '654 Maple Dr'),
-- Customers (7-16)
(7, 'John Doe', 'john@gmail.com', 'pass123', 'Apt 1'),
(8, 'Jane Smith', 'jane@yahoo.com', 'pass123', 'Apt 2'),
(9, 'Mike Ross', 'mike@pearson.com', 'pass123', 'Apt 3'),
(10, 'Rachel Zane', 'rachel@pearson.com', 'pass123', 'Apt 4'),
(11, 'Harvey Specter', 'harvey@pearson.com', 'pass123', 'Penthouse 1'),
(12, 'Louis Litt', 'louis@pearson.com', 'pass123', 'Apt 6'),
(13, 'Donna Paulsen', 'donna@pearson.com', 'pass123', 'Apt 7'),
(14, 'Jessica Pearson', 'jessica@pearson.com', 'pass123', 'Penthouse 2'),
(15, 'Alex Williams', 'alex@gmail.com', 'pass123', 'Apt 9'),
(16, 'Samantha Wheeler', 'sam@hotmail.com', 'pass123', 'Apt 10'),
-- Donors (17-26)
(17, 'Bruce Wayne', 'bruce@wayne.com', 'pass123', 'Wayne Manor'),
(18, 'Tony Stark', 'tony@stark.com', 'pass123', 'Stark Tower'),
(19, 'Clark Kent', 'clark@dailyplanet.com', 'pass123', 'Metropolis'),
(20, 'Diana Prince', 'diana@themyscira.com', 'pass123', 'Paris'),
(21, 'Steve Rogers', 'steve@avengers.com', 'pass123', 'Brooklyn'),
(22, 'Natasha Romanoff', 'nat@shield.gov', 'pass123', 'Unknown'),
(23, 'Peter Parker', 'peter@queens.com', 'pass123', 'Queens'),
(24, 'Wanda Maximoff', 'wanda@magic.com', 'pass123', 'Westview'),
(25, 'Vision', 'vis@jarvis.com', 'pass123', 'Westview'),
(26, 'TChalla', 'king@wakanda.com', 'pass123', 'Wakanda'),
-- Needy (27-31)
(27, 'Needy One', 'n1@help.com', 'pass123', 'Shelter A'),
(28, 'Needy Two', 'n2@help.com', 'pass123', 'Shelter A'),
(29, 'Needy Three', 'n3@help.com', 'pass123', 'Shelter B'),
(30, 'Needy Four', 'n4@help.com', 'pass123', 'Shelter B'),
(31, 'Needy Five', 'n5@help.com', 'pass123', 'Street C');

-- 2. Populate Role Tables (Linking back to Users)
INSERT INTO admins (user_id) VALUES (1);

INSERT INTO restaurants (user_id, phone) VALUES 
(2, '555-0001'), (3, '555-0002'), (4, '555-0003'), (5, '555-0004'), (6, '555-0005');

INSERT INTO customers (user_id, phone, c_card) VALUES 
(7, '555-0101', '4111-1111'), (8, '555-0102', '4111-1112'), (9, '555-0103', '4111-1113'), 
(10, '555-0104', '4111-1114'), (11, '555-0105', '4111-1115'), (12, '555-0106', '4111-1116'), 
(13, '555-0107', '4111-1117'), (14, '555-0108', '4111-1118'), (15, '555-0109', '4111-1119'), 
(16, '555-0110', '4111-1120');

INSERT INTO donors (user_id, phone, c_card) VALUES 
(17, '555-0201', '5111-2221'), (18, '555-0202', '5111-2222'), (19, '555-0203', '5111-2223'),
(20, '555-0204', '5111-2224'), (21, '555-0205', '5111-2225'), (22, '555-0206', '5111-2226'),
(23, '555-0207', '5111-2227'), (24, '555-0208', '5111-2228'), (25, '555-0209', '5111-2229'),
(26, '555-0210', '5111-2230');

INSERT INTO needys (user_id) VALUES (27), (28), (29), (30), (31);

-- 3. Create Plates (Generic items)
INSERT INTO plates (name, description) VALUES 
('Whopper', 'Flame grilled burger'), ('Fries', 'Salty potato sticks'), ('Coke', 'Cold soda'), ('Nuggets', 'Chicken bites'), ('Sundae', 'Ice cream'),
('Pepperoni Pizza', 'Large pizza'), ('Cheese Sticks', 'Mozzarella sticks'), ('Wings', 'Spicy wings'), ('Pasta', 'Creamy alfredo'), ('Breadsticks', 'Garlic bread'),
('Footlong Sub', 'Turkey and ham'), ('Cookie', 'Choco chip'), ('Chips', 'Lays chips'), ('Soup', 'Chicken noodle'), ('Salad', 'Veggie delight'),
('Taco', 'Crunchy beef'), ('Burrito', 'Bean and cheese'), ('Nachos', 'Cheese and jalapeno'), ('Quesadilla', 'Chicken and cheese'), ('Churros', 'Cinnamon sweet'),
('Lasagna', 'Meat sauce'), ('Fettuccine', 'Alfredo sauce'), ('Tiramisu', 'Coffee cake'), ('Minestrone', 'Veggie soup'), ('Risotto', 'Mushroom rice');

-- 4. Create Offers (Linking Restaurants to Plates)
-- Restaurant 2 (Burger King) sells plates 1-5
INSERT INTO offers (restaurant_id, plate_id, from_time, to_time, qty, price) VALUES
(2, 1, NOW(), NOW() + INTERVAL 1 YEAR, 100, 9.99),
(2, 2, NOW(), NOW() + INTERVAL 1 YEAR, 100, 3.99),
(2, 3, NOW(), NOW() + INTERVAL 1 YEAR, 100, 1.99),
(2, 4, NOW(), NOW() + INTERVAL 1 YEAR, 100, 5.99),
(2, 5, NOW(), NOW() + INTERVAL 1 YEAR, 100, 2.99),
-- Restaurant 3 (Pizza Hut) sells plates 6-10
(3, 6, NOW(), NOW() + INTERVAL 1 YEAR, 100, 15.99),
(3, 7, NOW(), NOW() + INTERVAL 1 YEAR, 100, 6.99),
(3, 8, NOW(), NOW() + INTERVAL 1 YEAR, 100, 8.99),
(3, 9, NOW(), NOW() + INTERVAL 1 YEAR, 100, 12.99),
(3, 10, NOW(), NOW() + INTERVAL 1 YEAR, 100, 4.99),
-- Restaurant 4 (Subway) sells plates 11-15
(4, 11, NOW(), NOW() + INTERVAL 1 YEAR, 100, 8.50),
(4, 12, NOW(), NOW() + INTERVAL 1 YEAR, 100, 1.50),
(4, 13, NOW(), NOW() + INTERVAL 1 YEAR, 100, 1.50),
(4, 14, NOW(), NOW() + INTERVAL 1 YEAR, 100, 3.50),
(4, 15, NOW(), NOW() + INTERVAL 1 YEAR, 100, 7.50),
-- Restaurant 5 (Taco Bell) sells plates 16-20
(5, 16, NOW(), NOW() + INTERVAL 1 YEAR, 100, 2.50),
(5, 17, NOW(), NOW() + INTERVAL 1 YEAR, 100, 3.50),
(5, 18, NOW(), NOW() + INTERVAL 1 YEAR, 100, 4.50),
(5, 19, NOW(), NOW() + INTERVAL 1 YEAR, 100, 5.50),
(5, 20, NOW(), NOW() + INTERVAL 1 YEAR, 100, 1.50),
-- Restaurant 6 (Olive Garden) sells plates 21-25
(6, 21, NOW(), NOW() + INTERVAL 1 YEAR, 100, 16.50),
(6, 22, NOW(), NOW() + INTERVAL 1 YEAR, 100, 15.50),
(6, 23, NOW(), NOW() + INTERVAL 1 YEAR, 100, 8.50),
(6, 24, NOW(), NOW() + INTERVAL 1 YEAR, 100, 6.50),
(6, 25, NOW(), NOW() + INTERVAL 1 YEAR, 100, 14.50);

-- 5. Customer Orders (Regular purchases, paying for themselves)
-- Users 7-16 buying random offers
INSERT INTO reservations (reserved_by_id, reserved_for_id, offer_id, qty, status) VALUES
(7, 7, 1, 1, 'COMPLETED'), (7, 7, 2, 2, 'COMPLETED'), -- Cust 7 (2 orders)
(8, 8, 6, 1, 'COMPLETED'), -- Cust 8 (1 order)
(9, 9, 11, 1, 'COMPLETED'), (9, 9, 12, 1, 'COMPLETED'), (9, 9, 13, 1, 'COMPLETED'), -- Cust 9 (3 orders)
(10, 10, 16, 4, 'COMPLETED'), -- Cust 10 (1 order, qty 4)
(11, 11, 21, 1, 'COMPLETED'), (11, 11, 25, 1, 'COMPLETED'), -- Cust 11 (2 orders)
(12, 12, 1, 1, 'COMPLETED'), (12, 12, 2, 1, 'COMPLETED'), (12, 12, 3, 1, 'COMPLETED'), (12, 12, 4, 1, 'COMPLETED'), -- Cust 12 (4 orders)
(13, 13, 6, 1, 'COMPLETED'), -- Cust 13 (1 order)
(14, 14, 21, 2, 'COMPLETED'), (14, 14, 22, 2, 'COMPLETED'), -- Cust 14 (2 orders)
(15, 15, 11, 1, 'COMPLETED'), -- Cust 15 (1 order)
(16, 16, 16, 1, 'COMPLETED'), (16, 16, 17, 1, 'COMPLETED'), (16, 16, 18, 1, 'COMPLETED'), (16, 16, 19, 1, 'COMPLETED'), (16, 16, 20, 1, 'COMPLETED'); -- Cust 16 (5 orders)

-- 6. Donor Orders (Donating to Needy)
-- Donors 17-26 buying for Needy 27-31
-- Note: This generates the "Free plates received" data for Needy and "Donation Report" for Donors
INSERT INTO reservations (reserved_by_id, reserved_for_id, offer_id, qty, status) VALUES
-- Donor 17 helps Needy 27 (3 times)
(17, 27, 1, 1, 'COMPLETED'), (17, 27, 2, 1, 'COMPLETED'), (17, 27, 3, 1, 'COMPLETED'),
-- Donor 18 helps Needy 28 (3 times)
(18, 28, 6, 1, 'COMPLETED'), (18, 28, 7, 1, 'COMPLETED'), (18, 28, 8, 1, 'COMPLETED'),
-- Donor 19 helps Needy 29 (3 times)
(19, 29, 11, 1, 'COMPLETED'), (19, 29, 12, 1, 'COMPLETED'), (19, 29, 13, 1, 'COMPLETED'),
-- Donor 20 helps Needy 30 (3 times)
(20, 30, 16, 1, 'COMPLETED'), (20, 30, 17, 1, 'COMPLETED'), (20, 30, 18, 1, 'COMPLETED'),
-- Donor 21 helps Needy 31 (3 times)
(21, 31, 21, 1, 'COMPLETED'), (21, 31, 22, 1, 'COMPLETED'), (21, 31, 23, 1, 'COMPLETED'),
-- Other Donors making random donations or purchases
(22, 27, 5, 1, 'COMPLETED'), -- Extra for Needy 27
(23, 28, 10, 1, 'COMPLETED'), -- Extra for Needy 28
(24, 29, 15, 1, 'COMPLETED'),
(25, 30, 20, 1, 'COMPLETED'),
(26, 31, 25, 1, 'COMPLETED');

-- 7. Needy Pickups 
-- This fulfills the requirement: "Needy can have 3 pickup"
-- The IDs below correspond to the auto-generated Reservation IDs from section 6.
-- Assuming Reservation IDs start at around 21 (after the 20 customer orders in section 5)
-- Adjust these IDs if you have existing data in your reservations table!

-- Needy 27 picks up the first 3 donations made by Donor 17
INSERT INTO user_pickups (user_id, reservation_id) VALUES
(27, 21), (27, 22), (27, 23),
-- Needy 28 picks up donations made by Donor 18
(28, 24), (28, 25), (28, 26),
-- Needy 29 picks up donations made by Donor 19
(29, 27), (29, 28), (29, 29),
-- Needy 30 picks up donations made by Donor 20
(30, 30), (30, 31), (30, 32),
-- Needy 31 picks up donations made by Donor 21
(31, 33), (31, 34), (31, 35);