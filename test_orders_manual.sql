-- 简化的SQL脚本，用于为user1创建测试订单数据
-- 请手动执行以下SQL语句

-- 1. 首先检查user1是否存在
SELECT id, username FROM user WHERE id = 5 OR username = 'user1';

-- 2. 检查现有的menu items和combos
SELECT id, name, price FROM menu_item LIMIT 10;
SELECT id, name, price FROM combo LIMIT 5;

-- 3. 插入测试订单（不同的状态）
-- Order 1: Pending Payment (status = 1)
INSERT INTO orders (number, status, user_id, order_time, pay_method, pay_status, amount, notes, phone, address, user_name, name, delivery_status, pack_amount, tableware_number, tableware_status)
VALUES ('ORD2023111301', 1, 5, NOW(), 1, 0, 25.50, 'Extra napkins please', '555-0101', '123 Main St, Apt 4B, New York, NY', 'user1', 'John Doe', 1, 2, 1, 1);

-- Order 2: Awaiting Acceptance (status = 2)
INSERT INTO orders (number, status, user_id, order_time, checkout_time, pay_method, pay_status, amount, notes, phone, address, user_name, name, delivery_status, pack_amount, tableware_number, tableware_status)
VALUES ('ORD2023111302', 2, 5, DATE_SUB(NOW(), INTERVAL 2 HOUR), DATE_SUB(NOW(), INTERVAL 1 HOUR), 1, 1, 32.75, 'No onions please', '555-0101', '123 Main St, Apt 4B, New York, NY', 'user1', 'John Doe', 1, 3, 2, 1);

-- Order 3: Accepted (status = 3)
INSERT INTO orders (number, status, user_id, order_time, checkout_time, pay_method, pay_status, amount, notes, phone, address, user_name, name, estimated_delivery_time, delivery_status, pack_amount, tableware_number, tableware_status)
VALUES ('ORD2023111303', 3, 5, DATE_SUB(NOW(), INTERVAL 4 HOUR), DATE_SUB(NOW(), INTERVAL 3 HOUR), 2, 1, 45.80, 'Extra spicy', '555-0101', '123 Main St, Apt 4B, New York, NY', 'user1', 'John Doe', DATE_ADD(NOW(), INTERVAL 30 MINUTE), 1, 4, 3, 1);

-- Order 4: Delivering (status = 4)
INSERT INTO orders (number, status, user_id, order_time, checkout_time, pay_method, pay_status, amount, notes, phone, address, user_name, name, estimated_delivery_time, delivery_status, pack_amount, tableware_number, tableware_status)
VALUES ('ORD2023111304', 4, 5, DATE_SUB(NOW(), INTERVAL 6 HOUR), DATE_SUB(NOW(), INTERVAL 5 HOUR), 1, 1, 28.90, 'Deliver to front door', '555-0101', '123 Main St, Apt 4B, New York, NY', 'user1', 'John Doe', DATE_ADD(NOW(), INTERVAL 15 MINUTE), 1, 2, 1, 0);

-- Order 5: Completed (status = 5)
INSERT INTO orders (number, status, user_id, order_time, checkout_time, pay_method, pay_status, amount, notes, phone, address, user_name, name, delivery_time, delivery_status, pack_amount, tableware_number, tableware_status)
VALUES ('ORD2023111305', 5, 5, DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY), 1, 1, 52.30, 'Great food!', '555-0101', '123 Main St, Apt 4B, New York, NY', 'user1', 'John Doe', DATE_SUB(NOW(), INTERVAL 20 HOUR), 1, 5, 2, 1);

-- Order 6: Canceled (status = 6)
INSERT INTO orders (number, status, user_id, order_time, pay_method, pay_status, amount, notes, phone, address, user_name, name, cancel_reason, cancel_time, delivery_status, pack_amount, tableware_number, tableware_status)
VALUES ('ORD2023111306', 6, 5, DATE_SUB(NOW(), INTERVAL 2 DAY), 1, 2, 18.75, 'Changed my mind', '555-0101', '123 Main St, Apt 4B, New York, NY', 'user1', 'John Doe', 'Customer requested cancellation', DATE_SUB(NOW(), INTERVAL 2 DAY), 1, 1, 1, 1);

-- 4. 获取刚插入的订单ID
-- 假设刚插入的订单ID为1-6（根据实际数据库情况调整）

-- 5. 插入订单详情（请根据实际的menu_item_id和combo_id调整）
-- Order 1 Details
INSERT INTO order_detail (name, image, order_id, menu_item_id, quantity, unit_price, tax) VALUES
('House Blend Coffee', '/images/coffee1.jpg', 1, 1, 2, 5.20, 0.52),
('Croissant', '/images/croissant.jpg', 1, 2, 1, 8.50, 0.85),
('Breakfast Combo', '/images/breakfast.jpg', 1, NULL, 1, 15.30, 1.53);

-- Order 2 Details
INSERT INTO order_detail (name, image, order_id, menu_item_id, quantity, unit_price, tax) VALUES
('Cappuccino', '/images/cappuccino.jpg', 2, 3, 1, 12.50, 1.25),
('Bagel with Cream Cheese', '/images/bagel.jpg', 2, 4, 2, 6.25, 0.63),
('Orange Juice', '/images/juice.jpg', 2, 5, 1, 7.50, 0.75);

-- Order 3 Details
INSERT INTO order_detail (name, image, order_id, menu_item_id, quantity, unit_price, tax) VALUES
('Caesar Salad', '/images/salad.jpg', 3, 6, 1, 12.00, 1.20),
('Iced Tea', '/images/tea.jpg', 3, 7, 2, 4.00, 0.40);

-- Order 4 Details
INSERT INTO order_detail (name, image, order_id, menu_item_id, quantity, unit_price, tax) VALUES
('Turkey Sandwich', '/images/sandwich.jpg', 4, 8, 2, 14.50, 1.45),
('French Fries', '/images/fries.jpg', 4, 9, 1, 6.90, 0.69);

-- Order 5 Details
INSERT INTO order_detail (name, image, order_id, menu_item_id, quantity, unit_price, tax) VALUES
('Chocolate Cake', '/images/cake.jpg', 5, 10, 1, 8.50, 0.85),
('Red Wine', '/images/wine.jpg', 5, 11, 1, 12.50, 1.25);

-- Order 6 Details
INSERT INTO order_detail (name, image, order_id, menu_item_id, quantity, unit_price, tax) VALUES
('Espresso', '/images/espresso.jpg', 6, 12, 1, 4.25, 0.43);

-- 6. 验证插入的数据
SELECT
    o.id, o.number, o.status, o.amount, o.order_time,
    CASE o.status
        WHEN 1 THEN 'Pending Payment'
        WHEN 2 THEN 'Awaiting Acceptance'
        WHEN 3 THEN 'Accepted'
        WHEN 4 THEN 'Delivering'
        WHEN 5 THEN 'Completed'
        WHEN 6 THEN 'Canceled'
        ELSE 'Unknown'
    END as status_text,
    COUNT(od.id) as item_count
FROM orders o
LEFT JOIN order_detail od ON o.id = od.order_id
WHERE o.user_id = 5
GROUP BY o.id, o.number, o.status, o.amount, o.order_time
ORDER BY o.order_time DESC;

-- 7. 显示订单详情
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