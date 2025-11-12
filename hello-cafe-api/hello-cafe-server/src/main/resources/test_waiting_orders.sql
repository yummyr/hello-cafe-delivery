-- Insert test orders with status 2 (awaiting acceptance)
INSERT INTO orders (number, user_id, user_name, phone, address, amount, pay_method, pay_status, status, order_time, checkout_time, cancel_time, delivery_time, estimated_delivery_time, cancel_reason, rejection_reason, created_at, updated_at, created_by, updated_by)
VALUES
('ORD999999', 1, 'Test User 1', '123-456-7890', '123 Test St', 25.99, 1, 1, 2, NOW(), NULL, NULL, NULL, NOW() + INTERVAL 30 MINUTE, NULL, NULL, NOW(), NOW(), 'system', 'system'),
('ORD999998', 2, 'Test User 2', '234-567-8901', '456 Test Ave', 32.50, 1, 1, 2, NOW() - INTERVAL 15 MINUTE, NULL, NULL, NULL, NOW() + INTERVAL 30 MINUTE, NULL, NULL, NOW(), NOW(), 'system', 'system')
ON DUPLICATE KEY UPDATE status = VALUES(status), order_time = VALUES(order_time);

-- Insert corresponding order details (assuming menu items 1 and 2 exist)
INSERT INTO order_detail (order_id, name, image, menu_item_id, combo_id, dish_flavor, number, amount, tax, unit_price)
VALUES
(LAST_INSERT_ID(), 'Test Dish 1', 'dish1.jpg', 1, NULL, 'spicy', 2, 25.99, 2.08, 11.50),
(LAST_INSERT_ID() + 1, 'Test Dish 2', 'dish2.jpg', 2, NULL, 'mild', 1, 32.50, 2.60, 29.90)
ON DUPLICATE KEY UPDATE number = VALUES(number);