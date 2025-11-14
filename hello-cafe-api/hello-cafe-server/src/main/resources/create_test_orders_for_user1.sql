-- Test order data for user1 (id=5)
-- This script creates orders with different statuses for testing

-- First, let's check if user exists and get some menu items
-- SELECT * FROM user WHERE id = 5;
-- SELECT id, name, price FROM menu_item LIMIT 5;
-- SELECT id, name, price FROM combo LIMIT 3;

-- Insert test orders with different statuses
-- Order 1: Pending Payment (status = 1)
INSERT INTO orders (
    number, status, user_id, address_book_id, order_time, pay_method, pay_status,
    amount, notes, phone, address, user_name, name, delivery_status, pack_amount, tableware_number, tableware_status
) VALUES (
    'ORD2023111301', 1, 5, 1, NOW(), 1, 0,
    25.50, 'Extra napkins please', '555-0101', '123 Main St, Apt 4B, New York, NY', 'user1', 'John Doe', 1, 2, 1, 1
);

-- Order 2: Awaiting Acceptance (status = 2)
INSERT INTO orders (
    number, status, user_id, address_book_id, order_time, checkout_time, pay_method, pay_status,
    amount, notes, phone, address, user_name, name, delivery_status, pack_amount, tableware_number, tableware_status
) VALUES (
    'ORD2023111302', 2, 5, 1, DATE_SUB(NOW(), INTERVAL 2 HOUR), DATE_SUB(NOW(), INTERVAL 1 HOUR), 1, 1,
    32.75, 'No onions please', '555-0101', '123 Main St, Apt 4B, New York, NY', 'user1', 'John Doe', 1, 3, 2, 1
);

-- Order 3: Accepted (status = 3)
INSERT INTO orders (
    number, status, user_id, address_book_id, order_time, checkout_time, pay_method, pay_status,
    amount, notes, phone, address, user_name, name, estimated_delivery_time, delivery_status, pack_amount, tableware_number, tableware_status
) VALUES (
    'ORD2023111303', 3, 5, 1, DATE_SUB(NOW(), INTERVAL 4 HOUR), DATE_SUB(NOW(), INTERVAL 3 HOUR), 2, 1,
    45.80, 'Extra spicy', '555-0101', '123 Main St, Apt 4B, New York, NY', 'user1', 'John Doe', DATE_ADD(NOW(), INTERVAL 30 MINUTE), 1, 4, 3, 1
);

-- Order 4: Delivering (status = 4)
INSERT INTO orders (
    number, status, user_id, address_book_id, order_time, checkout_time, pay_method, pay_status,
    amount, notes, phone, address, user_name, name, estimated_delivery_time, delivery_status, pack_amount, tableware_number, tableware_status
) VALUES (
    'ORD2023111304', 4, 5, 1, DATE_SUB(NOW(), INTERVAL 6 HOUR), DATE_SUB(NOW(), INTERVAL 5 HOUR), 1, 1,
    28.90, 'Deliver to front door', '555-0101', '123 Main St, Apt 4B, New York, NY', 'user1', 'John Doe', DATE_ADD(NOW(), INTERVAL 15 MINUTE), 1, 2, 1, 0
);

-- Order 5: Completed (status = 5)
INSERT INTO orders (
    number, status, user_id, address_book_id, order_time, checkout_time, pay_method, pay_status,
    amount, notes, phone, address, user_name, name, delivery_time, delivery_status, pack_amount, tableware_number, tableware_status
) VALUES (
    'ORD2023111305', 5, 5, 1, DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY), 1, 1,
    52.30, 'Great food!', '555-0101', '123 Main St, Apt 4B, New York, NY', 'user1', 'John Doe', DATE_SUB(NOW(), INTERVAL 20 HOUR), 1, 5, 2, 1
);

-- Order 6: Canceled (status = 6)
INSERT INTO orders (
    number, status, user_id, address_book_id, order_time, pay_method, pay_status,
    amount, notes, phone, address, user_name, name, cancel_reason, cancel_time, delivery_status, pack_amount, tableware_number, tableware_status
) VALUES (
    'ORD2023111306', 6, 5, 1, DATE_SUB(NOW(), INTERVAL 2 DAY), 1, 2,
    18.75, 'Changed my mind', '555-0101', '123 Main St, Apt 4B, New York, NY', 'user1', 'John Doe', 'Customer requested cancellation', DATE_SUB(NOW(), INTERVAL 2 DAY), 1, 1, 1, 1
);

-- Order 7: Another pending payment order for testing multiple pending orders
INSERT INTO orders (
    number, status, user_id, address_book_id, order_time, pay_method, pay_status,
    amount, notes, phone, address, user_name, name, delivery_status, pack_amount, tableware_number, tableware_status
) VALUES (
    'ORD2023111307', 1, 5, 1, NOW(), 2, 0,
    67.25, 'Birthday party - please include candles', '555-0101', '123 Main St, Apt 4B, New York, NY', 'user1', 'John Doe', 0, 8, 5, 1
);

-- Order 8: Another completed order from a few days ago
INSERT INTO orders (
    number, status, user_id, address_book_id, order_time, checkout_time, pay_method, pay_status,
    amount, notes, phone, address, user_name, name, delivery_time, delivery_status, pack_amount, tableware_number, tableware_status
) VALUES (
    'ORD2023111308', 5, 5, 1, DATE_SUB(NOW(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY), 1, 1,
    29.95, 'Lunch special', '555-0101', '123 Main St, Apt 4B, New York, NY', 'user1', 'John Doe', DATE_SUB(NOW(), INTERVAL 3 DAY), 1, 1, 1, 1
);

-- Get the inserted order IDs for order details
SET @order1_id = LAST_INSERT_ID() - 7;  -- ORD2023111301
SET @order2_id = LAST_INSERT_ID() - 6;  -- ORD2023111302
SET @order3_id = LAST_INSERT_ID() - 5;  -- ORD2023111303
SET @order4_id = LAST_INSERT_ID() - 4;  -- ORD2023111304
SET @order5_id = LAST_INSERT_ID() - 3;  -- ORD2023111305
SET @order6_id = LAST_INSERT_ID() - 2;  -- ORD2023111306
SET @order7_id = LAST_INSERT_ID() - 1;  -- ORD2023111307
SET @order8_id = LAST_INSERT_ID();      -- ORD2023111308

-- Insert order details for each order
-- Order 1 Details (Pending Payment) - 2 menu items + 1 combo
INSERT INTO order_detail (name, image, order_id, menu_item_id, combo_id, quantity, unit_price, tax) VALUES
('House Blend Coffee', '/images/coffee1.jpg', @order1_id, 1, NULL, 2, 5.20, 0.52),
('Croissant', '/images/croissant.jpg', @order1_id, 2, NULL, 1, 8.50, 0.85),
('Breakfast Combo', '/images/breakfast.jpg', @order1_id, NULL, 1, 1, 15.30, 1.53);

-- Order 2 Details (Awaiting Acceptance) - 3 menu items
INSERT INTO order_detail (name, image, order_id, menu_item_id, combo_id, quantity, unit_price, tax) VALUES
('Cappuccino', '/images/cappuccino.jpg', @order2_id, 3, NULL, 1, 12.50, 1.25),
('Bagel with Cream Cheese', '/images/bagel.jpg', @order2_id, 4, NULL, 2, 6.25, 0.63),
('Orange Juice', '/images/juice.jpg', @order2_id, 5, NULL, 1, 7.50, 0.75);

-- Order 3 Details (Accepted) - 1 combo + 2 menu items
INSERT INTO order_detail (name, image, order_id, menu_item_id, combo_id, quantity, unit_price, tax) VALUES
('Lunch Special Combo', '/images/lunch.jpg', @order3_id, NULL, 2, 1, 25.80, 2.58),
('Caesar Salad', '/images/salad.jpg', @order3_id, 6, NULL, 1, 12.00, 1.20),
('Iced Tea', '/images/tea.jpg', @order3_id, 7, NULL, 2, 4.00, 0.40);

-- Order 4 Details (Delivering) - 2 menu items
INSERT INTO order_detail (name, image, order_id, menu_item_id, combo_id, quantity, unit_price, tax) VALUES
('Turkey Sandwich', '/images/sandwich.jpg', @order4_id, 8, NULL, 2, 14.50, 1.45),
('French Fries', '/images/fries.jpg', @order4_id, 9, NULL, 1, 6.90, 0.69);

-- Order 5 Details (Completed) - combo + multiple items
INSERT INTO order_detail (name, image, order_id, menu_item_id, combo_id, quantity, unit_price, tax) VALUES
('Dinner for Two Combo', '/images/dinner.jpg', @order5_id, NULL, 3, 1, 35.00, 3.50),
('Chocolate Cake', '/images/cake.jpg', @order5_id, 10, NULL, 1, 8.50, 0.85),
('Red Wine', '/images/wine.jpg', @order5_id, 11, NULL, 1, 12.50, 1.25);

-- Order 6 Details (Canceled) - 1 menu item
INSERT INTO order_detail (name, image, order_id, menu_item_id, combo_id, quantity, unit_price, tax) VALUES
('Espresso', '/images/espresso.jpg', @order6_id, 12, NULL, 1, 4.25, 0.43);

-- Order 7 Details (Pending Payment) - Party order with multiple items
INSERT INTO order_detail (name, image, order_id, menu_item_id, combo_id, quantity, unit_price, tax) VALUES
('Party Combo', '/images/party.jpg', @order7_id, NULL, 4, 2, 28.50, 2.85),
('Pizza Margherita', '/images/pizza.jpg', @order7_id, 13, NULL, 3, 12.75, 1.28),
('Soft Drinks', '/images/drinks.jpg', @order7_id, 14, NULL, 6, 3.50, 0.35);

-- Order 8 Details (Completed) - Simple lunch
INSERT INTO order_detail (name, image, order_id, menu_item_id, combo_id, quantity, unit_price, tax) VALUES
('Soup of the Day', '/images/soup.jpg', @order8_id, 15, NULL, 1, 8.95, 0.90),
('Garlic Bread', '/images/bread.jpg', @order8_id, 16, NULL, 2, 10.50, 1.05);

-- Verify the data was inserted correctly
SELECT
    o.id, o.number, o.status, o.amount, o.order_time, o.checkout_time, o.delivery_time,
    COUNT(od.id) as item_count,
    CASE o.status
        WHEN 1 THEN 'Pending Payment'
        WHEN 2 THEN 'Awaiting Acceptance'
        WHEN 3 THEN 'Accepted'
        WHEN 4 THEN 'Delivering'
        WHEN 5 THEN 'Completed'
        WHEN 6 THEN 'Canceled'
        ELSE 'Unknown'
    END as status_text
FROM orders o
LEFT JOIN order_detail od ON o.id = od.order_id
WHERE o.user_id = 5
GROUP BY o.id, o.number, o.status, o.amount, o.order_time, o.checkout_time, o.delivery_time
ORDER BY o.order_time DESC;

-- Show order details for each order
SELECT
    o.number as order_number,
    o.status as order_status,
    od.name as item_name,
    od.quantity,
    od.unit_price,
    (od.quantity * od.unit_price) as subtotal
FROM orders o
JOIN order_detail od ON o.id = od.order_id
WHERE o.user_id = 5
ORDER BY o.order_time DESC, od.id;