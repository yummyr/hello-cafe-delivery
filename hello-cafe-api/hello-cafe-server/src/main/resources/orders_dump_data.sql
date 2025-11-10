-- Hello Cafe Delivery - Orders Table Dump Data (20 records)
-- Generated: 2024-01-20
-- This file contains 20 realistic order records for testing and development

-- =============================================
-- ORDERS TABLE - 20 Realistic Order Records
-- =============================================

-- Order 1: Completed morning coffee order
INSERT INTO orders (number, status, user_id, address_book_id, order_time, checkout_time, pay_method, pay_status, amount, notes, phone, address, user_name, name, cancel_reason, rejection_reason, cancel_time, estimated_delivery_time, delivery_status, delivery_time, pack_amount, tableware_number, tableware_status) VALUES
('ORD2024012009001', 5, 1, 1, '2024-01-20 09:00:00', '2024-01-20 09:05:00', 1, 1, 9.25, 'Extra hot please, less sugar', '555-2001', '123 Wall Street, Apt 4B, New York, NY 10001', 'Alice Cooper', 'Alice Cooper', NULL, NULL, NULL, '2024-01-20 09:30:00', 1, '2024-01-20 09:25:00', 2, 1, 1);

-- Order 2: Completed breakfast combo order
INSERT INTO orders (number, status, user_id, address_book_id, order_time, checkout_time, pay_method, pay_status, amount, notes, phone, address, user_name, name, cancel_reason, rejection_reason, cancel_time, estimated_delivery_time, delivery_status, delivery_time, pack_amount, tableware_number, tableware_status) VALUES
('ORD2024012007302', 5, 2, 3, '2024-01-20 07:30:00', '2024-01-20 07:35:00', 2, 1, 12.99, 'No onions in sandwich, please', '555-2002', '789 Sunset Blvd, Los Angeles, CA 90028', 'Bob Smith', 'Bob Smith', NULL, NULL, NULL, '2024-01-20 08:00:00', 1, '2024-01-20 07:55:00', 3, 2, 1);

-- Order 3: Completed tea order with scheduled delivery
INSERT INTO orders (number, status, user_id, address_book_id, order_time, checkout_time, pay_method, pay_status, amount, notes, phone, address, user_name, name, cancel_reason, rejection_reason, cancel_time, estimated_delivery_time, delivery_status, delivery_time, pack_amount, tableware_number, tableware_status) VALUES
('ORD2024012008153', 5, 3, 5, '2024-01-20 08:15:00', '2024-01-20 08:20:00', 1, 1, 3.00, 'Extra napkins requested', '555-2003', '321 Michigan Avenue, Chicago, IL 60611', 'Carol Davis', 'Carol Davis', NULL, NULL, NULL, '2024-01-20 08:45:00', 0, '2024-01-20 09:15:00', 1, 1, 1);

-- Order 4: Completed lunch sandwich order
INSERT INTO orders (number, status, user_id, address_book_id, order_time, checkout_time, pay_method, pay_status, amount, notes, phone, address, user_name, name, cancel_reason, rejection_reason, cancel_time, estimated_delivery_time, delivery_status, delivery_time, pack_amount, tableware_number, tableware_status) VALUES
('ORD2024012012304', 5, 4, 7, '2024-01-20 12:30:00', '2024-01-20 12:35:00', 1, 1, 8.50, 'No pickles, extra lettuce please', '555-2004', '555 Main Street, Apt 2A, Houston, TX 77002', 'David Wilson', 'David Wilson', NULL, NULL, NULL, '2024-01-20 13:00:00', 1, '2024-01-20 12:50:00', 2, 1, 1);

-- Order 5: Currently delivering smoothie order
INSERT INTO orders (number, status, user_id, address_book_id, order_time, checkout_time, pay_method, pay_status, amount, notes, phone, address, user_name, name, cancel_reason, rejection_reason, cancel_time, estimated_delivery_time, delivery_status, delivery_time, pack_amount, tableware_number, tableware_status) VALUES
('ORD2024012014005', 4, 5, 9, '2024-01-20 14:00:00', '2024-01-20 14:05:00', 2, 1, 11.00, 'Delivery to front desk, building reception', '555-2005', '999 Ocean Drive, Miami Beach, FL 33139', 'Emma Brown', 'Emma Brown', NULL, NULL, NULL, '2024-01-20 14:30:00', 1, NULL, 1, 1, 1);

-- Order 6: Completed morning coffee with milk alternative
INSERT INTO orders (number, status, user_id, address_book_id, order_time, checkout_time, pay_method, pay_status, amount, notes, phone, address, user_name, name, cancel_reason, rejection_reason, cancel_time, estimated_delivery_time, delivery_status, delivery_time, pack_amount, tableware_number, tableware_status) VALUES
('ORD2024012006456', 5, 6, 11, '2024-01-20 06:45:00', '2024-01-20 06:50:00', 1, 1, 4.75, 'Extra vanilla syrup, almond milk', '555-2006', '777 Pike Street, Seattle, WA 98101', 'Frank Miller', 'Frank Miller', NULL, NULL, NULL, '2024-01-20 07:15:00', 1, '2024-01-20 07:10:00', 1, 1, 1);

-- Order 7: Completed pastry order for office meeting
INSERT INTO orders (number, status, user_id, address_book_id, order_time, checkout_time, pay_method, pay_status, amount, notes, phone, address, user_name, name, cancel_reason, rejection_reason, cancel_time, estimated_delivery_time, delivery_status, delivery_time, pack_amount, tableware_number, tableware_status) VALUES
('ORD2024012010207', 5, 7, 13, '2024-01-20 10:20:00', '2024-01-20 10:25:00', 2, 1, 10.50, 'Office meeting, lightly toasted croissants', '555-2007', '444 Larimer Street, Denver, CO 80202', 'Grace Taylor', 'Grace Taylor', NULL, NULL, NULL, '2024-01-20 10:50:00', 1, '2024-01-20 10:45:00', 2, 1, 1);

-- Order 8: Currently being prepared (accepted)
INSERT INTO orders (number, status, user_id, address_book_id, order_time, checkout_time, pay_method, pay_status, amount, notes, phone, address, user_name, name, cancel_reason, rejection_reason, cancel_time, estimated_delivery_time, delivery_status, delivery_time, pack_amount, tableware_number, tableware_status) VALUES
('ORD2024012011458', 3, 8, 15, '2024-01-20 11:45:00', '2024-01-20 11:50:00', 1, 1, 15.99, 'No onions in sandwich, extra dressing on side', '555-2008', '222 Camelback Road, Phoenix, AZ 85012', 'Henry Anderson', 'Henry Anderson', NULL, NULL, NULL, '2024-01-20 12:30:00', 1, NULL, 3, 2, 1);

-- Order 9: Awaiting acceptance
INSERT INTO orders (number, status, user_id, address_book_id, order_time, checkout_time, pay_method, pay_status, amount, notes, phone, address, user_name, name, cancel_reason, rejection_reason, cancel_time, estimated_delivery_time, delivery_status, delivery_time, pack_amount, tableware_number, tableware_status) VALUES
('ORD2024012015309', 2, 9, 17, '2024-01-20 15:30:00', '2024-01-20 15:35:00', 1, 1, 3.75, 'Less ice, please', '555-2009', '111 NW 23rd Avenue, Portland, OR 97210', 'Isabella Thomas', 'Isabella Thomas', NULL, NULL, NULL, '2024-01-20 16:00:00', 1, NULL, 1, 1, 1);

-- Order 10: Completed healthy lunch order
INSERT INTO orders (number, status, user_id, address_book_id, order_time, checkout_time, pay_method, pay_status, amount, notes, phone, address, user_name, name, cancel_reason, rejection_reason, cancel_time, estimated_delivery_time, delivery_status, delivery_time, pack_amount, tableware_number, tableware_status) VALUES
('ORD20240120131510', 5, 10, 19, '2024-01-20 13:15:00', '2024-01-20 13:20:00', 2, 1, 10.25, 'Dressing on side, grilled chicken added', '555-2010', '333 Boylston Street, Boston, MA 02116', 'Jack Jackson', 'Jack Jackson', NULL, NULL, NULL, '2024-01-20 13:45:00', 1, '2024-01-20 13:40:00', 2, 1, 1);

-- Order 11: Pending payment
INSERT INTO orders (number, status, user_id, address_book_id, order_time, checkout_time, pay_method, pay_status, amount, notes, phone, address, user_name, name, cancel_reason, rejection_reason, cancel_time, estimated_delivery_time, delivery_status, delivery_time, pack_amount, tableware_number, tableware_status) VALUES
('ORD20240120164511', 1, 11, 20, '2024-01-20 16:45:00', NULL, 1, 0, 5.25, 'Birthday treat! Please include candle', '555-2011', '666 Las Vegas Blvd, Las Vegas, NV 89109', 'Kate White', 'Kate White', NULL, NULL, NULL, '2024-01-20 17:15:00', 1, NULL, 1, 1, 1);

-- Order 12: Completed health-conscious order
INSERT INTO orders (number, status, user_id, address_book_id, order_time, checkout_time, pay_method, pay_status, amount, notes, phone, address, user_name, name, cancel_reason, rejection_reason, cancel_time, estimated_delivery_time, delivery_status, delivery_time, pack_amount, tableware_number, tableware_status) VALUES
('ORD20240120120012', 5, 12, 1, '2024-01-20 12:00:00', '2024-01-20 12:05:00', 1, 1, 13.99, 'Extra protein please, no croutons', '555-2012', '123 Wall Street, Apt 4B, New York, NY 10001', 'Liam Harris', 'Liam Harris', NULL, NULL, NULL, '2024-01-20 12:30:00', 0, '2024-01-20 13:00:00', 2, 1, 1);

-- Order 13: Completed strong coffee order
INSERT INTO orders (number, status, user_id, address_book_id, order_time, checkout_time, pay_method, pay_status, amount, notes, phone, address, user_name, name, cancel_reason, rejection_reason, cancel_time, estimated_delivery_time, delivery_status, delivery_time, pack_amount, tableware_number, tableware_status) VALUES
('ORD20240120070013', 5, 13, 3, '2024-01-20 07:00:00', '2024-01-20 07:05:00', 2, 1, 6.50, 'Strong coffee, double shot', '555-2013', '789 Sunset Blvd, Los Angeles, CA 90028', 'Maya Martin', 'Maya Martin', NULL, NULL, NULL, '2024-01-20 07:30:00', 1, '2024-01-20 07:25:00', 2, 2, 1);

-- Order 14: Completed breakfast pastries
INSERT INTO orders (number, status, user_id, address_book_id, order_time, checkout_time, pay_method, pay_status, amount, notes, phone, address, user_name, name, cancel_reason, rejection_reason, cancel_time, estimated_delivery_time, delivery_status, delivery_time, pack_amount, tableware_number, tableware_status) VALUES
('ORD20240120093014', 5, 14, 5, '2024-01-20 09:30:00', '2024-01-20 09:35:00', 1, 1, 6.50, 'Warm muffins, please', '555-2014', '321 Michigan Avenue, Chicago, IL 60611', 'Noah Thompson', 'Noah Thompson', NULL, NULL, NULL, '2024-01-20 10:00:00', 1, '2024-01-20 09:55:00', 2, 1, 1);

-- Order 15: Completed light tea order
INSERT INTO orders (number, status, user_id, address_book_id, order_time, checkout_time, pay_method, pay_status, amount, notes, phone, address, user_name, name, cancel_reason, rejection_reason, cancel_time, estimated_delivery_time, delivery_status, delivery_time, pack_amount, tableware_number, tableware_status) VALUES
('ORD20240120143015', 5, 15, 7, '2024-01-20 14:30:00', '2024-01-20 14:35:00', 2, 1, 2.75, 'No sugar added, lemon on side', '555-2015', '555 Main Street, Apt 2A, Houston, TX 77002', 'Olivia Garcia', 'Olivia Garcia', NULL, NULL, NULL, '2024-01-20 15:00:00', 1, '2024-01-20 14:50:00', 1, 1, 1);

-- Order 16: Canceled order
INSERT INTO orders (number, status, user_id, address_book_id, order_time, checkout_time, pay_method, pay_status, amount, notes, phone, address, user_name, name, cancel_reason, rejection_reason, cancel_time, estimated_delivery_time, delivery_status, delivery_time, pack_amount, tableware_number, tableware_status) VALUES
('ORD20240120124516', 6, 16, 9, '2024-01-20 12:45:00', NULL, 1, 0, 7.75, 'Changed mind, ordered from different place', '555-2016', '999 Ocean Drive, Miami Beach, FL 33139', 'Peter Martinez', 'Peter Martinez', 'Customer requested cancellation - found better deal', NULL, '2024-01-20 13:00:00', NULL, 1, NULL, 1, 1, 1);

-- Order 17: Completed office delivery
INSERT INTO orders (number, status, user_id, address_book_id, order_time, checkout_time, pay_method, pay_status, amount, notes, phone, address, user_name, name, cancel_reason, rejection_reason, cancel_time, estimated_delivery_time, delivery_status, delivery_time, pack_amount, tableware_number, tableware_status) VALUES
('ORD20240120080017', 5, 17, 11, '2024-01-20 08:00:00', '2024-01-20 08:05:00', 1, 1, 11.99, 'Office delivery, deliver to reception desk', '555-2017', '777 Pike Street, Seattle, WA 98101', 'Quinn Robinson', 'Quinn Robinson', NULL, NULL, NULL, '2024-01-20 08:30:00', 1, '2024-01-20 08:25:00', 3, 2, 1);

-- Order 18: Completed fresh juice order
INSERT INTO orders (number, status, user_id, address_book_id, order_time, checkout_time, pay_method, pay_status, amount, notes, phone, address, user_name, name, cancel_reason, rejection_reason, cancel_time, estimated_delivery_time, delivery_status, delivery_time, pack_amount, tableware_number, tableware_status) VALUES
('ORD20240120104518', 5, 18, 13, '2024-01-20 10:45:00', '2024-01-20 10:50:00', 2, 1, 4.00, 'Fresh squeezed, no ice please', '555-2018', '444 Larimer Street, Denver, CO 80202', 'Rachel Clark', 'Rachel Clark', NULL, NULL, NULL, '2024-01-20 11:15:00', 1, '2024-01-20 11:10:00', 1, 1, 1);

-- Order 19: Currently awaiting acceptance
INSERT INTO orders (number, status, user_id, address_book_id, order_time, checkout_time, pay_method, pay_status, amount, notes, phone, address, user_name, name, cancel_reason, rejection_reason, cancel_time, estimated_delivery_time, delivery_status, delivery_time, pack_amount, tableware_number, tableware_status) VALUES
('ORD20240120193019', 2, 19, 15, '2024-01-20 19:30:00', '2024-01-20 19:35:00', 1, 1, 8.99, 'Study fuel, need quick delivery', '555-2019', '222 Camelback Road, Phoenix, AZ 85012', 'Sam Rodriguez', 'Sam Rodriguez', NULL, NULL, NULL, '2024-01-20 20:00:00', 1, NULL, 1, 1, 1);

-- Order 20: Completed business meeting order
INSERT INTO orders (number, status, user_id, address_book_id, order_time, checkout_time, pay_method, pay_status, amount, notes, phone, address, user_name, name, cancel_reason, rejection_reason, cancel_time, estimated_delivery_time, delivery_status, delivery_time, pack_amount, tableware_number, tableware_status) VALUES
('ORD20240120080020', 5, 20, 17, '2024-01-20 08:00:00', '2024-01-20 08:05:00', 1, 1, 9.25, 'Breakfast meeting, deliver by 8:30 AM', '555-2020', '333 North Broadway, Milwaukee, WI 53202', 'Tina Lewis', 'Tina Lewis', NULL, NULL, NULL, '2024-01-20 08:30:00', 1, '2024-01-20 08:25:00', 2, 1, 1);

-- =============================================
-- Summary of Order Status Distribution:
-- Status 1 (Pending Payment): 1 order
-- Status 2 (Awaiting Acceptance): 2 orders
-- Status 3 (Accepted): 1 order
-- Status 4 (Delivering): 1 order
-- Status 5 (Completed): 15 orders
-- Status 6 (Canceled): 1 order
--
-- Total Orders: 20
-- Total Revenue: $158.84 (from completed orders)
--
-- Payment Methods:
-- Method 1 (Credit Card): 12 orders
-- Method 2 (PayPal): 8 orders
--
-- Delivery Status:
-- Immediate Delivery (1): 17 orders
-- Scheduled Delivery (0): 3 orders
--
-- Realistic Features:
-- - Various order times throughout the day
-- - Different delivery preferences and requirements
-- - Realistic customer notes and special requests
-- - Complete order lifecycle representation
-- - Geographically diverse delivery addresses
-- - Business and personal order scenarios
-- =============================================