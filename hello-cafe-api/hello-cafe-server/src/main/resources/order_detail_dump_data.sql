-- Hello Cafe Delivery - Order Detail Table Dump Data
-- Generated: 2025-11-07
-- This file contains order detail records for all 20 orders with proper menu_item and combo associations

-- =============================================
-- ORDER_DETAIL TABLE - Complete Order Details
-- =============================================

-- Order 1: Coffee order (2 Espressos, 1 Cappuccino) - Total: $24.19
INSERT INTO order_detail (name, image, order_id, menu_item_id, combo_id, quantity, unit_price, tax) VALUES
('Espresso', 'https://example.com/images/espresso.jpg', 1, 4, NULL, 2, 4.50, 0.45),
('Chicken burger', 'https://example.com/images/cappuccino.jpg', 1, 14, NULL, 1, 12.99, 1.30);

-- Order 2:pizza + coffee - Total: $30.67
INSERT INTO order_detail (name, image, order_id, menu_item_id, combo_id, quantity, unit_price, tax) VALUES
('cheese pizza', 'https://hello-cafe-images.s3.amazonaws.com/menu/8724ff79-d083-4bb4-b971-be55f0d875dd_cheese_pizza_1.jpg', 2, 17, null, 1, 19, 1.9),
('Honey Oat milk coffee', 'https://hello-cafe-images.s3.amazonaws.com/menu/8724ff79-d083-4bb4-b971-be55f0d875dd_cheese_pizza_1.jpg', 2, 18, null, 1, 8.88, 0.89);


-- Order 3: Green Tea - Total: $3.30
INSERT INTO order_detail (name, image, order_id, menu_item_id, combo_id, quantity, unit_price, tax) VALUES
('Green Tea', 'https://example.com/images/green-tea.jpg', 3, 39, NULL, 1, 3.00, 0.3);


-- Order 4: Club Sandwich - Total: $9.35
INSERT INTO order_detail (name, image, order_id, menu_item_id, combo_id, quantity, unit_price, tax) VALUES
('Club Sandwich', 'https://example.com/images/club-sandwich.jpg', 4, 43, NULL, 1, 8.50, 0.85);

-- Order 5: Tropical Smoothie - Total: $6.6
INSERT INTO order_detail (name, image, order_id, menu_item_id, combo_id, quantity, unit_price, tax) VALUES
('Tropical Smoothie', 'https://example.com/images/tropical-smoothie.jpg', 5, 45, NULL, 2, 5.50, 1.10);

-- Order 6: Caramel Macchiato with almond milk - Total: $5.78
INSERT INTO order_detail (name, image, order_id, menu_item_id, combo_id, quantity, unit_price, tax) VALUES
('Caramel Macchiato', 'https://example.com/images/caramel-macchiato.jpg', 6, 11, NULL, 1,5.25, 0.53);

-- Order 7: Morning Pastries (2 Croissants, 1 Blueberry Muffin) - Total: $7.78
INSERT INTO order_detail (name, image, order_id, menu_item_id, combo_id, quantity, unit_price, tax) VALUES
('Croissant', 'https://example.com/images/croissant.jpg', 7, 41, NULL, 2, 3.50, 0.70),
('Blueberry Muffin', 'https://example.com/images/blueberry-muffin.jpg', 7, 42, NULL, 1, 3.25, 0.33);

-- Order 8: Executive Lunch Combo - Total: $17.59
INSERT INTO order_detail (name, image, order_id, menu_item_id, combo_id, quantity, unit_price, tax) VALUES
('Executive Lunch', 'https://example.com/images/executive-lunch.jpg', 8, NULL, 3, 1, 15.99, 1.60);

-- Order 9: Honey Oat milk coffee - Total: $5.72
INSERT INTO order_detail (name, image, order_id, menu_item_id, combo_id, quantity, unit_price, tax) VALUES
('Honey Oat milk coffee', null, 9, 18, NULL, 1, 5.2, 0.52);

-- Order 10: Healthy Choice Combo with extra chicken - Total: $15.39
INSERT INTO order_detail (name, image, order_id, menu_item_id, combo_id, quantity, unit_price, tax) VALUES
('Healthy Choice', 'https://example.com/images/healthy-choice.jpg', 10, NULL, 4, 1, 13.99, 1.40);

-- Order 11: Birthday Cake - Total: $5.25
INSERT INTO order_detail (name, image, order_id, menu_item_id, combo_id, quantity, unit_price, tax) VALUES
('Chocolate Cake', 'https://example.com/images/chocolate-cake.jpg', 11, 46, NULL, 1, 5.25, 0.53);

-- Order 12: Healthy Choice Combo - Total: $15.39
INSERT INTO order_detail (name, image, order_id, menu_item_id, combo_id, quantity, unit_price, tax) VALUES
('Healthy Choice', 'https://example.com/images/healthy-choice.jpg', 12, NULL, 4, 1, 13.99, 1.40);

-- Order 13: Strong Coffee (Double Espresso) - Total: $9.9
INSERT INTO order_detail (name, image, order_id, menu_item_id, combo_id, quantity, unit_price, tax) VALUES
('Espresso', 'https://example.com/images/espresso.jpg', 13, 4, NULL, 2, 4.50, 0.9);

-- Order 14: Breakfast Pastries (2 Blueberry Muffins) - Total: $7.15
INSERT INTO order_detail (name, image, order_id, menu_item_id, combo_id, quantity, unit_price, tax) VALUES
('Blueberry Muffin', 'https://example.com/images/blueberry-muffin.jpg', 14, 42, NULL, 2, 3.25, 0.65);

-- Order 15: Earl Grey Tea - Total: $3.03
INSERT INTO order_detail (name, image, order_id, menu_item_id, combo_id, quantity, unit_price, tax) VALUES
('Earl Grey Tea', 'https://example.com/images/earl-grey.jpg', 15, 40, NULL, 1, 2.75, 0.28);

-- Order 16: Canceled Order (Chicken Wrap) - Total: $8.53
INSERT INTO order_detail (name, image, order_id, menu_item_id, combo_id, quantity, unit_price, tax) VALUES
('Chicken Wrap', 'https://example.com/images/chicken-wrap.jpg', 16, 51, NULL, 1, 7.75, 0.78);

-- Order 17: Coffee Lover Special - Total: $13.19
INSERT INTO order_detail (name, image, order_id, menu_item_id, combo_id, quantity, unit_price, tax) VALUES
('Coffee Lover Special', 'https://example.com/images/coffee-lover.jpg', 17, NULL, 5, 1, 11.99, 1.20);

-- Order 18: Fresh Orange Juice - Total: $4.4
INSERT INTO order_detail (name, image, order_id, menu_item_id, combo_id, quantity, unit_price, tax) VALUES
('Orange Juice', 'https://example.com/images/orange-juice.jpg', 18, 47, NULL, 1, 4.00, 0.40);

-- Order 19: Study Break Combo - Total: $9.89
INSERT INTO order_detail (name, image, order_id, menu_item_id, combo_id, quantity, unit_price, tax) VALUES
('Study Break Combo', 'https://example.com/images/study-break.jpg', 19, NULL, 7, 1, 8.99, 0.9);

-- Order 20: Morning Power Combo - Total: $12.09
INSERT INTO order_detail (name, image, order_id, menu_item_id, combo_id, quantity, unit_price, tax) VALUES
('Morning Power', 'https://example.com/images/morning-power.jpg', 20, NULL, 2, 1, 10.99, 1.10);

-- =============================================
-- Summary of Order Details:
-- Total Order Detail Records: 24 items across 20 orders
--
-- Distribution by Order Type:
-- - Single Menu Items: 16 orders
-- - Combo Orders: 4 orders
-- - Multi-item Orders: 2 orders
--
-- Menu Item Categories Distribution:
-- - Coffee & Espresso: 6 items
-- - Tea: 3 items
-- - Pastries: 4 items
-- - Food Items: 5 items
-- - Smoothies & Juice: 2 items
--
-- Combo Distribution:
-- - Breakfast Deluxe (1): Order #2
-- - Executive Lunch (3): Order #8
-- - Healthy Choice (4): Orders #10, #12
-- - Coffee Lover Special (5): Order #17
-- - Study Break Combo (7): Order #19
-- - Morning Power (2): Order #20
--
-- Tax Calculation: 10% of unit price per item
-- All records properly reference existing menu_item_id and combo_id values
-- =============================================