-- Create 5 dummy order history records for user1 (user_id = 5)
-- These orders will have different statuses to test the order history functionality

-- First, let's create some sample orders
INSERT INTO orders (number, user_id, status, order_time, amount, pay_method, pay_status, phone, user_name, address, delivery_status, estimated_delivery_time, pack_amount, tableware_number, tableware_status, notes, created_at, updated_by, updated_at, created_by) VALUES
-- Order 1: Completed order
('ORD2025111201001', 5, 5, '2025-11-10 12:30:00', 25.99, 1, 1, '123-456-7890', 'user1', '123 Main St, Apt 4B, New York, NY 10001', 1, '2025-11-10 13:00:00', 2.50, 2, 1, 'Extra napkins please', '2025-11-10 12:30:00', 5, '2025-11-10 13:45:00', 5),

-- Order 2: In delivery
('ORD2025111202002', 5, 4, '2025-11-11 18:15:00', 32.50, 1, 1, '123-456-7890', 'user1', '123 Main St, Apt 4B, New York, NY 10001', 1, '2025-11-11 18:45:00', 3.00, 1, 1, 'No onions', '2025-11-11 18:15:00', 5, '2025-11-11 19:20:00', 5),

-- Order 3: Accepted/Awaiting delivery
('ORD2025111203003', 5, 2, '2025-11-12 09:00:00', 18.75, 1, 1, '123-456-7890', 'user1', '123 Main St, Apt 4B, New York, NY 10001', 0, '2025-11-12 09:30:00', 1.75, 3, 1, 'Deliver to front desk', '2025-11-12 09:00:00', 5, '2025-11-12 09:15:00', 5),

-- Order 4: Cancelled order
('ORD2025111204004', 5, 6, '2025-11-11 14:20:00', 41.25, 1, 0, '123-456-7890', 'user1', '123 Main St, Apt 4B, New York, NY 10001', 0, '2025-11-11 14:50:00', 4.00, 2, 1, 'Customer requested cancellation', '2025-11-11 14:20:00', 5, '2025-11-11 14:35:00', 5),

-- Order 5: Pending payment
('ORD2025111205005', 5, 1, '2025-11-12 11:45:00', 28.99, 2, 0, '123-456-7890', 'user1', '123 Main St, Apt 4B, New York, NY 10001', 0, '2025-11-12 12:15:00', 2.99, 1, 1, 'Extra sauce', '2025-11-12 11:45:00', 5, '2025-11-12 11:45:00', 5);

-- Update the cancel_time for the cancelled order
UPDATE orders SET cancel_time = '2025-11-11 14:35:00' WHERE number = 'ORD2025111204004';

-- Update the delivery_time for the order in delivery
UPDATE orders SET delivery_time = '2025-11-11 19:20:00' WHERE number = 'ORD2025111202002';

-- Update the checkout_time for the completed order
UPDATE orders SET checkout_time = '2025-11-10 13:45:00' WHERE number = 'ORD2025111201001';

-- Now create order details for each order
-- Order 1 details (Completed) - Burger combo
INSERT INTO order_detail (order_id, name, image, combo_id, combo_name, quantity, unit_price, tax, created_at, updated_by, updated_at, created_by) VALUES
(1, 'Classic Burger Combo', '/assets/burgers.jpeg', 1, 'Classic Burger Combo', 1, 15.99, 1.20, '2025-11-10 12:30:00', 5, '2025-11-10 12:30:00', 5),
(1, 'French Fries', '/assets/burgers.jpeg', 1, 'Classic Burger Combo', 1, 0.00, 0.00, '2025-11-10 12:30:00', 5, '2025-11-10 12:30:00', 5);

-- Order 2 details (In delivery) - Sandwich and drink
INSERT INTO order_detail (order_id, name, image, menu_item_id, quantity, unit_price, tax, created_at, updated_by, updated_at, created_by) VALUES
(2, 'Club Sandwich', '/assets/sandwiches.jpeg', 2, 1, 12.99, 0.97, '2025-11-11 18:15:00', 5, '2025-11-11 18:15:00', 5),
(2, 'Iced Coffee', '/assets/house_coffee.jpeg', 5, 1, 4.50, 0.34, '2025-11-11 18:15:00', 5, '2025-11-11 18:15:00', 5);

-- Order 3 details (Accepted) - Salad combo
INSERT INTO order_detail (order_id, name, image, combo_id, combo_name, quantity, unit_price, tax, created_at, updated_by, updated_at, created_by) VALUES
(3, 'Caesar Salad Combo', '/assets/salads.jpeg', 2, 'Caesar Salad Combo', 1, 12.99, 0.97, '2025-11-12 09:00:00', 5, '2025-11-12 09:00:00', 5);

-- Order 4 details (Cancelled) - Multiple items
INSERT INTO order_detail (order_id, name, image, menu_item_id, quantity, unit_price, tax, created_at, updated_by, updated_at, created_by) VALUES
(4, 'Breakfast Sandwich', '/assets/meal.jpeg', 1, 2, 18.50, 1.39, '2025-11-11 14:20:00', 5, '2025-11-11 14:20:00', 5),
(4, 'Orange Juice', '/assets/house_coffee.jpeg', 3, 1, 3.99, 0.30, '2025-11-11 14:20:00', 5, '2025-11-11 14:20:00', 5);

-- Order 5 details (Pending payment) - Bakery items
INSERT INTO order_detail (order_id, name, image, combo_id, combo_name, quantity, unit_price, tax, created_at, updated_by, updated_at, created_by) VALUES
(5, 'Morning Bakery Box', '/assets/bakery.jpeg', 3, 'Morning Bakery Box', 1, 16.99, 1.27, '2025-11-12 11:45:00', 5, '2025-11-12 11:45:00', 5);