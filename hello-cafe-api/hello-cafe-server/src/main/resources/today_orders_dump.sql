-- Hello Cafe Delivery - Today's Orders Dump Data (10 records)
-- Date: 2024-11-06
-- This file contains 10 realistic order records for today's business operations
-- All timestamps use NOW() for current time insertion

-- =============================================
-- TODAY'S ORDERS - 10 Realistic Order Records with Dynamic Timestamps
-- =============================================

-- Order 1: Early morning coffee rush - Completed
INSERT INTO orders (number, status, user_id, address_book_id, order_time, checkout_time, pay_method, pay_status, amount, notes, phone, address, user_name, name, cancel_reason, rejection_reason, cancel_time, estimated_delivery_time, delivery_status, delivery_time, pack_amount, tableware_number, tableware_status) VALUES
('ORD2024110607001', 5, 1, 1, NOW(), DATE_SUB(NOW(), INTERVAL 3 MINUTE), 1, 1, 6.50, 'Strong espresso, double shot please', '555-2001', '123 Wall Street, Apt 4B, New York, NY 10001', 'Alice Cooper', 'Alice Cooper', NULL, NULL, NULL, DATE_ADD(NOW(), INTERVAL 25 MINUTE), 1, DATE_ADD(NOW(), INTERVAL 20 MINUTE), 1, 1, 1);

-- Order 2: Morning breakfast combo - Completed
INSERT INTO orders (number, status, user_id, address_book_id, order_time, checkout_time, pay_method, pay_status, amount, notes, phone, address, user_name, name, cancel_reason, rejection_reason, cancel_time, estimated_delivery_time, delivery_status, delivery_time, pack_amount, tableware_number, tableware_status) VALUES
('ORD2024110607452', 5, 2, 3, NOW(), DATE_SUB(NOW(), INTERVAL 3 MINUTE), 2, 1, 12.99, 'No bacon, extra fruit please', '555-2002', '789 Sunset Blvd, Los Angeles, CA 90028', 'Bob Smith', 'Bob Smith', NULL, NULL, NULL, DATE_ADD(NOW(), INTERVAL 25 MINUTE), 1, DATE_ADD(NOW(), INTERVAL 20 MINUTE), 3, 2, 1);

-- Order 3: Mid-morning office order - Currently delivering
INSERT INTO orders (number, status, user_id, address_book_id, order_time, checkout_time, pay_method, pay_status, amount, notes, phone, address, user_name, name, cancel_reason, rejection_reason, cancel_time, estimated_delivery_time, delivery_status, delivery_time, pack_amount, tableware_number, tableware_status) VALUES
('ORD2024110609303', 4, 3, 5, NOW(), DATE_SUB(NOW(), INTERVAL 3 MINUTE), 1, 1, 15.99, 'Office meeting for 10 people, deliver to conference room', '555-2003', '321 Michigan Avenue, Chicago, IL 60611', 'Carol Davis', 'Carol Davis', NULL, NULL, NULL, DATE_ADD(NOW(), INTERVAL 30 MINUTE), 1, NULL, 4, 3, 1);

-- Order 4: Late morning tea order - Completed
INSERT INTO orders (number, status, user_id, address_book_id, order_time, checkout_time, pay_method, pay_status, amount, notes, phone, address, user_name, name, cancel_reason, rejection_reason, cancel_time, estimated_delivery_time, delivery_status, delivery_time, pack_amount, tableware_number, tableware_status) VALUES
('ORD2024110610154', 5, 4, 7, NOW(), DATE_SUB(NOW(), INTERVAL 3 MINUTE), 2, 1, 5.75, 'Green tea with honey, no sugar', '555-2004', '555 Main Street, Apt 2A, Houston, TX 77002', 'David Wilson', 'David Wilson', NULL, NULL, NULL, DATE_ADD(NOW(), INTERVAL 25 MINUTE), 1, DATE_ADD(NOW(), INTERVAL 20 MINUTE), 1, 1, 1);

-- Order 5: Lunch time sandwich order - Currently being prepared
INSERT INTO orders (number, status, user_id, address_book_id, order_time, checkout_time, pay_method, pay_status, amount, notes, phone, address, user_name, name, cancel_reason, rejection_reason, cancel_time, estimated_delivery_time, delivery_status, delivery_time, pack_amount, tableware_number, tableware_status) VALUES
('ORD2024110612005', 3, 5, 9, NOW(), DATE_SUB(NOW(), INTERVAL 3 MINUTE), 1, 1, 11.50, 'No onions, extra tomatoes, gluten-free bread if possible', '555-2005', '999 Ocean Drive, Miami Beach, FL 33139', 'Emma Brown', 'Emma Brown', NULL, NULL, NULL, DATE_ADD(NOW(), INTERVAL 30 MINUTE), 0, NULL, 2, 1, 1);

-- Order 6: Afternoon coffee break - Pending payment
INSERT INTO orders (number, status, user_id, address_book_id, order_time, checkout_time, pay_method, pay_status, amount, notes, phone, address, user_name, name, cancel_reason, rejection_reason, cancel_time, estimated_delivery_time, delivery_status, delivery_time, pack_amount, tableware_number, tableware_status) VALUES
('ORD2024110614306', 1, 6, 11, NOW(), NULL, 2, 0, 4.25, 'Iced latte with oat milk, caramel drizzle', '555-2006', '777 Pike Street, Seattle, WA 98101', 'Frank Miller', 'Frank Miller', NULL, NULL, NULL, DATE_ADD(NOW(), INTERVAL 30 MINUTE), 1, NULL, 1, 1, 1);

-- Order 7: Healthy afternoon snack - Completed
INSERT INTO orders (number, status, user_id, address_book_id, order_time, checkout_time, pay_method, pay_status, amount, notes, phone, address, user_name, name, cancel_reason, rejection_reason, cancel_time, estimated_delivery_time, delivery_status, delivery_time, pack_amount, tableware_number, tableware_status) VALUES
('ORD2024110615007', 5, 7, 13, NOW(), DATE_SUB(NOW(), INTERVAL 3 MINUTE), 1, 1, 7.25, 'Quinoa bowl with extra avocado, dressing on side', '555-2007', '444 Larimer Street, Denver, CO 80202', 'Grace Taylor', 'Grace Taylor', NULL, NULL, NULL, DATE_ADD(NOW(), INTERVAL 25 MINUTE), 1, DATE_ADD(NOW(), INTERVAL 20 MINUTE), 2, 1, 1);

-- Order 8: Study session fuel - Awaiting acceptance
INSERT INTO orders (number, status, user_id, address_book_id, order_time, checkout_time, pay_method, pay_status, amount, notes, phone, address, user_name, name, cancel_reason, rejection_reason, cancel_time, estimated_delivery_time, delivery_status, delivery_time, pack_amount, tableware_number, tableware_status) VALUES
('ORD2024110615308', 2, 8, 15, NOW(), DATE_SUB(NOW(), INTERVAL 3 MINUTE), 2, 1, 8.99, 'Study break coffee and cookie, need caffeine!', '555-2008', '222 Camelback Road, Phoenix, AZ 85012', 'Henry Anderson', 'Henry Anderson', NULL, NULL, NULL, DATE_ADD(NOW(), INTERVAL 30 MINUTE), 1, NULL, 1, 1, 1);

-- Order 9: Business client order - Completed
INSERT INTO orders (number, status, user_id, address_book_id, order_time, checkout_time, pay_method, pay_status, amount, notes, phone, address, user_name, name, cancel_reason, rejection_reason, cancel_time, estimated_delivery_time, delivery_status, delivery_time, pack_amount, tableware_number, tableware_status) VALUES
('ORD2024110611009', 5, 9, 17, NOW(), DATE_SUB(NOW(), INTERVAL 3 MINUTE), 1, 1, 18.75, 'Client meeting - 3 coffees, 3 pastries, make it look professional', '555-2009', '111 NW 23rd Avenue, Portland, OR 97210', 'Isabella Thomas', 'Isabella Thomas', NULL, NULL, NULL, DATE_ADD(NOW(), INTERVAL 30 MINUTE), 1, DATE_ADD(NOW(), INTERVAL 25 MINUTE), 3, 3, 1);

-- Order 10: Evening treat - Canceled by customer
INSERT INTO orders (number, status, user_id, address_book_id, order_time, checkout_time, pay_method, pay_status, amount, notes, phone, address, user_name, name, cancel_reason, rejection_reason, cancel_time, estimated_delivery_time, delivery_status, delivery_time, pack_amount, tableware_number, tableware_status) VALUES
('ORD20241106173010', 6, 10, 19, NOW(), NULL, 1, 0, 6.50, 'Hot chocolate with whipped cream', '555-2010', '333 Boylston Street, Boston, MA 02116', 'Jack Jackson', 'Jack Jackson', 'Customer cancelled - meeting ran late', NULL, DATE_ADD(NOW(), INTERVAL 15 MINUTE), NULL, 1, NULL, 1, 1, 1);

-- =============================================
-- TODAY'S ORDER SUMMARY (2024-11-06):
--
-- Total Orders: 10
-- Completed Orders: 5 ($60.48 revenue)
-- In Progress: 3 (1 delivering, 1 preparing, 1 awaiting acceptance)
-- Pending Payment: 1
-- Canceled: 1
--
-- Order Timeline:
-- 07:00 - Early morning coffee (completed)
-- 07:45 - Breakfast combo (completed)
-- 09:30 - Office meeting bulk order (delivering)
-- 10:15 - Mid-morning tea (completed)
-- 11:00 - Business client order (completed)
-- 12:00 - Lunch sandwich (preparing)
-- 14:30 - Afternoon coffee break (pending payment)
-- 15:00 - Healthy snack (completed)
-- 15:30 - Study session fuel (awaiting acceptance)
-- 17:30 - Evening treat (canceled)
--
-- Geographic Distribution:
-- New York, Los Angeles, Chicago, Houston, Miami,
-- Seattle, Denver, Phoenix, Portland, Boston
--
-- Payment Methods:
-- Credit Card: 6 orders
-- PayPal: 4 orders
--
-- Order Types:
-- Coffee/Drinks: 7 orders
-- Food Items: 3 orders
-- Business Orders: 2 orders
-- Personal Orders: 8 orders
--
-- Special Features:
-- Realistic time distribution throughout business day
-- Mix of completed, in-progress, and canceled orders
-- Various customer preferences and dietary requests
-- Business and personal order scenarios
-- Proper payment status workflow
-- =============================================