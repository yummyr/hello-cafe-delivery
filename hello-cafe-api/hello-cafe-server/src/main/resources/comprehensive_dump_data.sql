-- Hello Cafe Delivery - Comprehensive Database Dump Data
-- Created: 2024-01-01
-- Purpose: Development and testing data with 20 records per table

-- Disable foreign key checks temporarily
SET FOREIGN_KEY_CHECKS = 0;

-- =============================================
-- 1. EMPLOYEE TABLE (20 records)
-- =============================================
INSERT INTO employee (name, username, password, phone, gender, status, create_time, update_time, create_employee, update_employee) VALUES
('John Smith', 'johnsmith', '$2a$10$7JB720yubVSOfvVWbfXCOOxjTOQcQjmrJF1ZM4nAVccp/.rkMlDWy', '555-0101', 'Male', 1, '2024-01-01 09:00:00', '2024-01-01 09:00:00', 1, 1),
('Emily Johnson', 'emilyjohnson', '$2a$10$7JB720yubVSOfvVWbfXCOOxjTOQcQjmrJF1ZM4nAVccp/.rkMlDWy', '555-0102', 'Female', 1, '2024-01-01 09:05:00', '2024-01-01 09:05:00', 1, 1),
('Michael Chen', 'michaelchen', '$2a$10$7JB720yubVSOfvVWbfXCOOxjTOQcQjmrJF1ZM4nAVccp/.rkMlDWy', '555-0103', 'Male', 1, '2024-01-01 09:10:00', '2024-01-01 09:10:00', 1, 1),
('Sarah Williams', 'sarahwilliams', '$2a$10$7JB720yubVSOfvVWbfXCOOxjTOQcQjmrJF1ZM4nAVccp/.rkMlDWy', '555-0104', 'Female', 1, '2024-01-01 09:15:00', '2024-01-01 09:15:00', 1, 1),
('David Brown', 'davidbrown', '$2a$10$7JB720yubVSOfvVWbfXCOOxjTOQcQjmrJF1ZM4nAVccp/.rkMlDWy', '555-0105', 'Male', 1, '2024-01-01 09:20:00', '2024-01-01 09:20:00', 1, 1),
('Jessica Davis', 'jessicadavis', '$2a$10$7JB720yubVSOfvVWbfXCOOxjTOQcQjmrJF1ZM4nAVccp/.rkMlDWy', '555-0106', 'Female', 1, '2024-01-01 09:25:00', '2024-01-01 09:25:00', 1, 1),
('Robert Wilson', 'robertwilson', '$2a$10$7JB720yubVSOfvVWbfXCOOxjTOQcQjmrJF1ZM4nAVccp/.rkMlDWy', '555-0107', 'Male', 1, '2024-01-01 09:30:00', '2024-01-01 09:30:00', 1, 1),
('Lisa Martinez', 'lisamartinez', '$2a$10$7JB720yubVSOfvVWbfXCOOxjTOQcQjmrJF1ZM4nAVccp/.rkMlDWy', '555-0108', 'Female', 1, '2024-01-01 09:35:00', '2024-01-01 09:35:00', 1, 1),
('James Anderson', 'jamesanderson', '$2a$10$7JB720yubVSOfvVWbfXCOOxjTOQcQjmrJF1ZM4nAVccp/.rkMlDWy', '555-0109', 'Male', 1, '2024-01-01 09:40:00', '2024-01-01 09:40:00', 1, 1),
('Maria Garcia', 'mariagarcia', '$2a$10$7JB720yubVSOfvVWbfXCOOxjTOQcQjmrJF1ZM4nAVccp/.rkMlDWy', '555-0110', 'Female', 1, '2024-01-01 09:45:00', '2024-01-01 09:45:00', 1, 1),
('William Taylor', 'williamtaylor', '$2a$10$7JB720yubVSOfvVWbfXCOOxjTOQcQjmrJF1ZM4nAVccp/.rkMlDWy', '555-0111', 'Male', 1, '2024-01-01 09:50:00', '2024-01-01 09:50:00', 1, 1),
('Jennifer Thomas', 'jenniferthomas', '$2a$10$7JB720yubVSOfvVWbfXCOOxjTOQcQjmrJF1ZM4nAVccp/.rkMlDWy', '555-0112', 'Female', 1, '2024-01-01 09:55:00', '2024-01-01 09:55:00', 1, 1),
('Christopher Lee', 'christopherlee', '$2a$10$7JB720yubVSOfvVWbfXCOOxjTOQcQjmrJF1ZM4nAVccp/.rkMlDWy', '555-0113', 'Male', 1, '2024-01-01 10:00:00', '2024-01-01 10:00:00', 1, 1),
('Amanda White', 'amandawhite', '$2a$10$7JB720yubVSOfvVWbfXCOOxjTOQcQjmrJF1ZM4nAVccp/.rkMlDWy', '555-0114', 'Female', 1, '2024-01-01 10:05:00', '2024-01-01 10:05:00', 1, 1),
('Daniel Harris', 'danielharris', '$2a$10$7JB720yubVSOfvVWbfXCOOxjTOQcQjmrJF1ZM4nAVccp/.rkMlDWy', '555-0115', 'Male', 1, '2024-01-01 10:10:00', '2024-01-01 10:10:00', 1, 1),
('Michelle Clark', 'michelleclark', '$2a$10$7JB720yubVSOfvVWbfXCOOxjTOQcQjmrJF1ZM4nAVccp/.rkMlDWy', '555-0116', 'Female', 1, '2024-01-01 10:15:00', '2024-01-01 10:15:00', 1, 1),
('Matthew Lewis', 'matthewlewis', '$2a$10$7JB720yubVSOfvVWbfXCOOxjTOQcQjmrJF1ZM4nAVccp/.rkMlDWy', '555-0117', 'Male', 1, '2024-01-01 10:20:00', '2024-01-01 10:20:00', 1, 1),
('Ashley Robinson', 'ashleyrobinson', '$2a$10$7JB720yubVSOfvVWbfXCOOxjTOQcQjmrJF1ZM4nAVccp/.rkMlDWy', '555-0118', 'Female', 1, '2024-01-01 10:25:00', '2024-01-01 10:25:00', 1, 1),
('Andrew Walker', 'andrewwalker', '$2a$10$7JB720yubVSOfvVWbfXCOOxjTOQcQjmrJF1ZM4nAVccp/.rkMlDWy', '555-0119', 'Male', 1, '2024-01-01 10:30:00', '2024-01-01 10:30:00', 1, 1),
('Stephanie Hall', 'stephaniehall', '$2a$10$7JB720yubVSOfvVWbfXCOOxjTOQcQjmrJF1ZM4nAVccp/.rkMlDWy', '555-0120', 'Female', 1, '2024-01-01 10:35:00', '2024-01-01 10:35:00', 1, 1);

-- =============================================
-- 2. CATEGORY TABLE (20 records)
# -- =============================================
# INSERT INTO category (name, type, sort, status, create_time, update_time, create_employee, update_employee) VALUES
# ('Coffee', 1, 1, 1, '2024-01-01 11:00:00', '2024-01-01 11:00:00', 1, 1),
# ('Tea', 1, 2, 1, '2024-01-01 11:05:00', '2024-01-01 11:05:00', 1, 1),
# ('Pastries', 1, 3, 1, '2024-01-01 11:10:00', '2024-01-01 11:10:00', 1, 1),
# ('Sandwiches', 1, 4, 1, '2024-01-01 11:15:00', '2024-01-01 11:15:00', 1, 1),
# ('Salads', 1, 5, 1, '2024-01-01 11:20:00', '2024-01-01 11:20:00', 1, 1),
# ('Smoothies', 1, 6, 1, '2024-01-01 11:25:00', '2024-01-01 11:25:00', 1, 1),
# ('Breakfast Combos', 2, 1, 1, '2024-01-01 11:30:00', '2024-01-01 11:30:00', 1, 1),
# ('Lunch Combos', 2, 2, 1, '2024-01-01 11:35:00', '2024-01-01 11:35:00', 1, 1),
# ('Desserts', 1, 7, 1, '2024-01-01 11:40:00', '2024-01-01 11:40:00', 1, 1),
# ('Juices', 1, 8, 1, '2024-01-01 11:45:00', '2024-01-01 11:45:00', 1, 1),
# ('Snacks', 1, 9, 1, '2024-01-01 11:50:00', '2024-01-01 11:50:00', 1, 1),
# ('Specialty Drinks', 1, 10, 1, '2024-01-01 11:55:00', '2024-01-01 11:55:00', 1, 1),
# ('Soups', 1, 11, 1, '2024-01-01 12:00:00', '2024-01-01 12:00:00', 1, 1),
# ('Wraps', 1, 12, 1, '2024-01-01 12:05:00', '2024-01-01 12:05:00', 1, 1),
# ('Dinner Combos', 2, 3, 1, '2024-01-01 12:10:00', '2024-01-01 12:10:00', 1, 1),
# ('Family Combos', 2, 4, 1, '2024-01-01 12:15:00', '2024-01-01 12:15:00', 1, 1),
# ('Healthy Options', 1, 13, 1, '2024-01-01 12:20:00', '2024-01-01 12:20:00', 1, 1),
# ('Kids Menu', 1, 14, 1, '2024-01-01 12:25:00', '2024-01-01 12:25:00', 1, 1),
# ('Seasonal Specials', 1, 15, 1, '2024-01-01 12:30:00', '2024-01-01 12:30:00', 1, 1),
# ('Beverages', 1, 16, 1, '2024-01-01 12:35:00', '2024-01-01 12:35:00', 1, 1);

-- =============================================

-- =============================================
-- 4. MENU_ITEM TABLE (20 records)
-- =============================================
INSERT INTO menu_item (name, category_id, price, image, description, status, create_time, update_time, create_employee, update_employee) VALUES
('Green Tea', 2, 3.00, 'https://example.com/images/green-tea.jpg', 'Organic Japanese green tea', 1, '2024-01-01 14:20:00', '2024-01-01 14:20:00', 1, 1),
('Earl Grey Tea', 2, 2.75, 'https://example.com/images/earl-grey.jpg', 'Classic black tea with bergamot', 1, '2024-01-01 14:25:00', '2024-01-01 14:25:00', 1, 1),
('Croissant', 3, 3.50, 'https://example.com/images/croissant.jpg', 'Buttery French croissant, flaky and golden', 1, '2024-01-01 14:30:00', '2024-01-01 14:30:00', 1, 1),
('Blueberry Muffin', 3, 3.25, 'https://example.com/images/blueberry-muffin.jpg', 'Fresh baked muffin with real blueberries', 1, '2024-01-01 14:35:00', '2024-01-01 14:35:00', 1, 1),
('Club Sandwich', 4, 8.50, 'https://example.com/images/club-sandwich.jpg', 'Triple-decker with turkey, bacon, lettuce, tomato', 1, '2024-01-01 14:40:00', '2024-01-01 14:40:00', 1, 1),
('Caesar Salad', 5, 7.25, 'https://example.com/images/caesar-salad.jpg', 'Romaine lettuce with parmesan and croutons', 1, '2024-01-01 14:45:00', '2024-01-01 14:45:00', 1, 1),
('Tropical Smoothie', 6, 5.50, 'https://example.com/images/tropical-smoothie.jpg', 'Mango, pineapple, and banana blend', 1, '2024-01-01 14:50:00', '2024-01-01 14:50:00', 1, 1),
('Chocolate Cake', 8, 5.25, 'https://example.com/images/chocolate-cake.jpg', 'Rich chocolate layer cake with ganache', 1, '2024-01-01 14:55:00', '2024-01-01 14:55:00', 1, 1),
('Orange Juice', 9, 4.00, 'https://example.com/images/orange-juice.jpg', 'Fresh squeezed orange juice', 1, '2024-01-01 15:00:00', '2024-01-01 15:00:00', 1, 1),
('Bagel with Cream Cheese', 10, 3.75, 'https://example.com/images/bagel.jpg', 'Toasted bagel with cream cheese spread', 1, '2024-01-01 15:05:00', '2024-01-01 15:05:00', 1, 1),
('Caramel Macchiato', 11, 5.25, 'https://example.com/images/caramel-macchiato.jpg', 'Espresso with vanilla and caramel drizzle', 1, '2024-01-01 15:10:00', '2024-01-01 15:10:00', 1, 1),
('Tomato Soup', 12, 4.50, 'https://example.com/images/tomato-soup.jpg', 'Creamy tomato soup with basil', 1, '2024-01-01 15:15:00', '2024-01-01 15:15:00', 1, 1),
('Chicken Wrap', 13, 7.75, 'https://example.com/images/chicken-wrap.jpg', 'Grilled chicken with vegetables in tortilla', 1, '2024-01-01 15:20:00', '2024-01-01 15:20:00', 1, 1),
('Quinoa Bowl', 14, 8.25, 'https://example.com/images/quinoa-bowl.jpg', 'Healthy quinoa with roasted vegetables', 1, '2024-01-01 15:25:00', '2024-01-01 15:25:00', 1, 1),
('Iced Coffee', 15, 3.75, 'https://example.com/images/iced-coffee.jpg', 'Cold brewed coffee over ice', 1, '2024-01-01 15:30:00', '2024-01-01 15:30:00', 1, 1),
('Apple Pie', 16, 4.50, 'https://example.com/images/apple-pie.jpg', 'Traditional apple pie with cinnamon', 1, '2024-01-01 15:35:00', '2024-01-01 15:35:00', 1, 1);

-- =============================================
-- 5. MENU_ITEM_FLAVORS TABLE (20 records)
-- =============================================
INSERT INTO menu_item_flavors (menu_item_id, name, value ) VALUES
(1, 'Temperature', '["Hot", "Iced"]'),
(1, 'Size', '["Single", "Double"]'),
(2, 'Temperature', '["Hot", "Iced"]'),
(2, 'Size', '["Small", "Medium", "Large"]'),
(2, 'Milk Type', '["Whole", "Skim", "Almond", "Soy", "Oat"]'),
(3, 'Temperature', '["Hot", "Iced"]'),
(3, 'Size', '["Small", "Medium", "Large"]'),
(3, 'Flavor Syrup', '["Vanilla", "Caramel", "Hazelnut", "None"]'),
(4, 'Temperature', '["Hot", "Iced"]'),
(4, 'Size', '["Small", "Medium", "Large"]'),
(5, 'Sweetness', '["No Sugar", "Less Sugar", "Regular", "Extra Sugar"]'),
(6, 'Sweetness', '["No Sugar", "Less Sugar", "Regular", "Extra Sugar"]'),
(7, 'Toasting', '["Not Toasted", "Lightly Toasted", "Well Toasted"]'),
(8, 'Temperature', '["Room Temperature", "Warm"]'),
(10, 'Dressing', '["Light", "Regular", "No Dressing"]'),
(10, 'Add-ons', '["Grilled Chicken", "Shrimp", "No Add-ons"]'),
(11, 'Protein Boost', '["No Boost", "Protein Powder", "Peanut Butter"]'),
(11, 'Sweetness', '["No Sugar", "Less Sugar", "Regular", "Honey"]'),
(13, 'Bread Type', '["White", "Whole Wheat", "Rye", "Sourdough"]'),
(15, 'Temperature', '["Hot", "Iced"]');

-- =============================================
-- 6. COMBO TABLE (20 records)
-- =============================================
INSERT INTO combo (name, category_id, price, image, description, status, create_time, update_time, create_employee, update_employee) VALUES
('Breakfast Deluxe', 6, 12.99, 'https://example.com/images/breakfast-deluxe.jpg', 'Coffee, croissant, and fruit cup', 1, '2024-01-01 17:30:00', '2024-01-01 17:30:00', 1, 1),
('Morning Power', 6, 10.99, 'https://example.com/images/morning-power.jpg', 'Espresso, bagel, and yogurt', 1, '2024-01-01 17:35:00', '2024-01-01 17:35:00', 1, 1),
('Executive Lunch', 7, 15.99, 'https://example.com/images/executive-lunch.jpg', 'Sandwich, salad, and drink', 1, '2024-01-01 17:40:00', '2024-01-01 17:40:00', 1, 1),
('Healthy Choice', 7, 13.99, 'https://example.com/images/healthy-choice.jpg', 'Quinoa bowl, green tea, and fruit', 1, '2024-01-01 17:45:00', '2024-01-01 17:45:00', 1, 1),
('Coffee Lover Special', 7, 11.99, 'https://example.com/images/coffee-lover.jpg', 'Two coffees and pastry selection', 1, '2024-01-01 17:50:00', '2024-01-01 17:50:00', 1, 1),
('Team Meeting Package', 7, 45.99, 'https://example.com/images/team-meeting.jpg', '4 coffees, 4 pastries, serves 4', 1, '2024-01-01 17:55:00', '2024-01-01 17:55:00', 1, 1),
('Study Break Combo', 7, 8.99, 'https://example.com/images/study-break.jpg', 'Coffee and cookie', 1, '2024-01-01 18:00:00', '2024-01-01 18:00:00', 1, 1),
('Afternoon Tea Set', 8, 14.99, 'https://example.com/images/afternoon-tea.jpg', 'Tea selection and pastries', 1, '2024-01-01 18:05:00', '2024-01-01 18:05:00', 1, 1),
('Dinner Delight', 9, 18.99, 'https://example.com/images/dinner-delight.jpg', 'Main course, soup, and drink', 1, '2024-01-01 18:10:00', '2024-01-01 18:10:00', 1, 1),
('Family Feast', 10, 52.99, 'https://example.com/images/family-feast.jpg', '4 main courses, 4 sides, 4 drinks', 1, '2024-01-01 18:15:00', '2024-01-01 18:15:00', 1, 1),
('Couple Special', 10, 32.99, 'https://example.com/images/couple-special.jpg', '2 main courses, shared dessert, 2 drinks', 1, '2024-01-01 18:20:00', '2024-01-01 18:20:00', 1, 1),
('Kids Happy Meal', 11, 7.99, 'https://example.com/images/kids-happy.jpg', 'Small sandwich, fruit, juice, toy', 1, '2024-01-01 18:25:00', '2024-01-01 18:25:00', 1, 1),
('Vegan Delight', 12, 14.99, 'https://example.com/images/vegan-delight.jpg', 'Plant-based main, salad, and smoothie', 1, '2024-01-01 18:30:00', '2024-01-01 18:30:00', 1, 1),
('Protein Power', 12, 16.99, 'https://example.com/images/protein-power.jpg', 'High-protein meal with shake', 1, '2024-01-01 18:35:00', '2024-01-01 18:35:00', 1, 1),
('Sweet Treat', 13, 9.99, 'https://example.com/images/sweet-treat.jpg', 'Dessert and specialty coffee', 1, '2024-01-01 18:40:00', '2024-01-01 18:40:00', 1, 1),
('Quick Lunch', 13, 11.99, 'https://example.com/images/quick-lunch.jpg', 'Wrap and drink combo', 1, '2024-01-01 18:45:00', '2024-01-01 18:45:00', 1, 1),
 ('Weekend Brunch', 14, 19.99, 'https://example.com/images/weekend-brunch.jpg', 'Eggs, bacon, toast, coffee, juice', 1, '2024-01-01 18:50:00', '2024-01-01 18:50:00', 1, 1),
('Summer Special', 15, 13.99, 'https://example.com/images/summer-special.jpg', 'Cold drink, salad, and light dessert', 1, '2024-01-01 18:55:00', '2024-01-01 18:55:00', 1, 1),
('Winter Warmer', 15, 15.99, 'https://example.com/images/winter-warmer.jpg', 'Hot soup, coffee, and hearty pastry', 1, '2024-01-01 19:00:00', '2024-01-01 19:00:00', 1, 1),
('Coffee Tasting', 16, 24.99, 'https://example.com/images/coffee-tasting.jpg', '3 different coffee samples with notes', 1, '2024-01-01 19:05:00', '2024-01-01 19:05:00', 1, 1);

-- =============================================
-- 7. COMBO_ITEM TABLE (20 records)
-- =============================================
INSERT INTO combos (combo_id, menu_item_id, name, price, quantity) VALUES
(1, 1, 'Espresso', 2.50, 1),
(1, 7, 'Croissant', 3.50, 1),
(1, 9, 'Seasonal Fruit Cup', 4.50, 1),
(2, 1, 'Espresso', 2.50, 1),
(2, 14, 'Bagel with Cream Cheese', 3.75, 1),
(2, 17, 'Greek Yogurt', 4.50, 1),
(3, 9, 'Club Sandwich', 8.50, 1),
(3, 10, 'Caesar Salad', 7.25, 1),
(3, 4, 'Americano', 3.25, 1),
(4, 18, 'Quinoa Bowl', 8.25, 1),
(4, 5, 'Green Tea', 3.00, 1),
(4, 9, 'Seasonal Fruit Cup', 4.50, 1),
(5, 2, 'Cappuccino', 4.25, 2),
(5, 8, 'Blueberry Muffin', 3.25, 2),
(6, 1, 'Espresso', 2.50, 4),
(6, 7, 'Croissant', 3.50, 4),
(7, 1, 'Espresso', 2.50, 1),
(7, 20, 'Chocolate Chip Cookie', 2.50, 1),
(8, 2, 'Earl Grey Tea', 2.75, 2),
(8, 8, 'Blueberry Muffin', 3.25, 2);

-- =============================================
-- 8. USER TABLE (20 records)
-- =============================================
INSERT INTO user (username, password, email, name, phone, gender, avatar, create_date) VALUES
('coffee_lover_01', '$2a$10$7JB720yubVSOfvVWbfXCOOxjTOQcQjmrJF1ZM4nAVccp/.rkMlDWy', 'user01@example.com', 'Alice Cooper', '555-2001', 'Female',  'https://example.com/avatars/user01.jpg', '2024-01-01'),
('java_dev_2024', '$2a$10$7JB720yubVSOfvVWbfXCOOxjTOQcQjmrJF1ZM4nAVccp/.rkMlDWy', 'user02@example.com', 'Bob Smith', '555-2002', 'Male',  'https://example.com/avatars/user02.jpg', '2024-01-01'),
('morning_person', '$2a$10$7JB720yubVSOfvVWbfXCOOxjTOQcQjmrJF1ZM4nAVccp/.rkMlDWy', 'user03@example.com', 'Carol Davis', '555-2003', 'Female',  'https://example.com/avatars/user03.jpg', '2024-01-02'),
('student_life', '$2a$10$7JB720yubVSOfvVWbfXCOOxjTOQcQjmrJF1ZM4nAVccp/.rkMlDWy', 'user04@example.com', 'David Wilson', '555-2004', 'Male',  'https://example.com/avatars/user04.jpg', '2024-01-02'),
('office_worker', '$2a$10$7JB720yubVSOfvVWbfXCOOxjTOQcQjmrJF1ZM4nAVccp/.rkMlDWy', 'user05@example.com', 'Emma Brown', '555-2005', 'Female',  'https://example.com/avatars/user05.jpg', '2024-01-03'),
('fitness_fan', '$2a$10$7JB720yubVSOfvVWbfXCOOxjTOQcQjmrJF1ZM4nAVccp/.rkMlDWy', 'user06@example.com', 'Frank Miller', '555-2006', 'Male',  'https://example.com/avatars/user06.jpg', '2024-01-03'),
('tea_time', '$2a$10$7JB720yubVSOfvVWbfXCOOxjTOQcQjmrJF1ZM4nAVccp/.rkMlDWy', 'user07@example.com', 'Grace Taylor', '555-2007', 'Female',  'https://example.com/avatars/user07.jpg', '2024-01-04'),
('book_reader', '$2a$10$7JB720yubVSOfvVWbfXCOOxjTOQcQjmrJF1ZM4nAVccp/.rkMlDWy', 'user08@example.com', 'Henry Anderson', '555-2008', 'Male',  'https://example.com/avatars/user08.jpg', '2024-01-04'),
('freelancer_life', '$2a$10$7JB720yubVSOfvVWbfXCOOxjTOQcQjmrJF1ZM4nAVccp/.rkMlDWy', 'user09@example.com', 'Isabella Thomas', '555-2009', 'Female',  'https://example.com/avatars/user09.jpg', '2024-01-05'),
('travel_buddy', '$2a$10$7JB720yubVSOfvVWbfXCOOxjTOQcQjmrJF1ZM4nAVccp/.rkMlDWy', 'user10@example.com', 'Jack Jackson', '555-2010', 'Male',  'https://example.com/avatars/user10.jpg', '2024-01-05'),
('weekend_warrior', '$2a$10$7JB720yubVSOfvVWbfXCOOxjTOQcQjmrJF1ZM4nAVccp/.rkMlDWy', 'user11@example.com', 'Kate White', '555-2011', 'Female',  'https://example.com/avatars/user11.jpg', '2024-01-06'),
('remote_worker', '$2a$10$7JB720yubVSOfvVWbfXCOOxjTOQcQjmrJF1ZM4nAVccp/.rkMlDWy', 'user12@example.com', 'Liam Harris', '555-2012', 'Male', 'https://example.com/avatars/user12.jpg', '2024-01-06'),
('health_conscious', '$2a$10$7JB720yubVSOfvVWbfXCOOxjTOQcQjmrJF1ZM4nAVccp/.rkMlDWy', 'user13@example.com', 'Maya Martin', '555-2013', 'Female',  'https://example.com/avatars/user13.jpg', '2024-01-07'),
('night_owl', '$2a$10$7JB720yubVSOfvVWbfXCOOxjTOQcQjmrJF1ZM4nAVccp/.rkMlDWy', 'user14@example.com', 'Noah Thompson', '555-2014', 'Male',  'https://example.com/avatars/user14.jpg', '2024-01-07'),
('early_bird', '$2a$10$7JB720yubVSOfvVWbfXCOOxjTOQcQjmrJF1ZM4nAVccp/.rkMlDWy', 'user15@example.com', 'Olivia Garcia', '555-2015', 'Female',  'https://example.com/avatars/user15.jpg', '2024-01-08'),
('foodie_adventurer', '$2a$10$7JB720yubVSOfvVWbfXCOOxjTOQcQjmrJF1ZM4nAVccp/.rkMlDWy', 'user16@example.com', 'Peter Martinez', '555-2016', 'Male', 'https://example.com/avatars/user16.jpg', '2024-01-08'),
('coffee_addict', '$2a$10$7JB720yubVSOfvVWbfXCOOxjTOQcQjmrJF1ZM4nAVccp/.rkMlDWy', 'user17@example.com', 'Quinn Robinson', '555-2017', 'Female', 'https://example.com/avatars/user17.jpg', '2024-01-09'),
('smoothie_fan', '$2a$10$7JB720yubVSOfvVWbfXCOOxjTOQcQjmrJF1ZM4nAVccp/.rkMlDWy', 'user18@example.com', 'Rachel Clark', '555-2018', 'Female', 'https://example.com/avatars/user18.jpg', '2024-01-09'),
('business_professional', '$2a$10$7JB720yubVSOfvVWbfXCOOxjTOQcQjmrJF1ZM4nAVccp/.rkMlDWy', 'user19@example.com', 'Sam Rodriguez', '555-2019', 'Male',  'https://example.com/avatars/user19.jpg', '2024-01-10'),
('casual_diner', '$2a$10$7JB720yubVSOfvVWbfXCOOxjTOQcQjmrJF1ZM4nAVccp/.rkMlDWy', 'user20@example.com', 'Tina Lewis', '555-2020', 'Female',  'https://example.com/avatars/user20.jpg', '2024-01-10');

-- =============================================
-- 9. ADDRESS_BOOK TABLE (20 records)
-- =============================================
INSERT INTO address_book (user_id, name, gender, phone, state,  city, zipcode,  address, label, is_default) VALUES
(1, 'Alice Cooper', 'Female', '555-2001', 'NY',   'Manhattan', '101',  '123 Wall Street, Apt 4B', 'Home', 1),
(1, 'Alice Cooper', 'Female', '555-2001', 'NY',  'Manhattan', '102',  '456 Broadway, Office 1200', 'Work', 0),
(2, 'Bob Smith', 'Male', '555-2002', 'CA',  'Los Angeles', '201',  '789 Sunset Blvd', 'Home', 1),
(3, 'Carol Davis', 'Female', '555-2003', 'IL',  'Chicago', '301',  '321 Michigan Avenue', 'Work', 1),
(4, 'David Wilson', 'Male', '555-2004', 'TX',   'Houston', '401',  '555 Main Street, Apt 2A', 'Home',1),
(5, 'Emma Brown', 'Female', '555-2005', 'FL',  'Miami', '501',  '999 Ocean Drive', 'Home', 1),
(6, 'Frank Miller', 'Male', '555-2006', 'WA',   'Seattle', '601',  '777 Pike Street', 'Home', 1),
(7, 'Grace Taylor', 'Female', '555-2007', 'CO',  'Denver', '701',  '444 Larimer Street', 'Work', 1),
(8, 'Henry Anderson', 'Male', '555-2008', 'AZ',  'Phoenix', '801',  '222 Camelback Road', 'Home', 1),
(9, 'Isabella Thomas', 'Female', '555-2009', 'OR',  'Portland', '901',  '111 NW 23rd Avenue', 'Home', 1),
(10, 'Jack Jackson', 'Male', '555-2010', 'MA',  'Boston', '1001', '333 Boylston Street', 'Work', 1),
(11, 'Kate White', 'Female', '555-2011', 'NV',   'Las Vegas', '1101', '666 Las Vegas Blvd', 'Home', 1),
(12, 'Liam Harris', 'Male', '555-2012', 'TN',   'Nashville', '1201',  '555 Music Square East', 'Work', 1),
(13, 'Maya Martin', 'Female', '555-2013', 'GA',   'Atlanta', '1301',  '888 Peachtree Road', 'Home', 1),
(14, 'Noah Thompson', 'Male', '555-2014', 'NC',   'Charlotte', '1401',  '444 Trade Street', 'Work', 1),
(15, 'Olivia Garcia', 'Female', '555-2015', 'PA',  'Philadelphia', '1501',  '777 Market Street', 'Home', 1),
(16, 'Peter Martinez', 'Male', '555-2016', 'MI',  'Detroit', '1601',  '111 Woodward Avenue', 'Work', 1),
(17, 'Quinn Robinson', 'Female', '555-2017', 'OH',  'Columbus', '1701',  '222 High Street', 'Home', 1),
(18, 'Rachel Clark', 'Female', '555-2018', 'VA',   'Richmond', '1801',  '555 Broad Street', 'Work', 1),
(19, 'Sam Rodriguez', 'Male', '555-2019', 'WI',   'Milwaukee', '1901',  '333 North Broadway', 'Home', 1),
(20, 'Tina Lewis', 'Female', '555-2020', 'MD',   'Baltimore', '2001', '444 Light Street', 'Home', 1);

-- =============================================
-- 10. SHOPPING_CART TABLE (20 records)
-- =============================================
INSERT INTO shopping_cart (name, image, user_id, menu_item_id, combo_id, quantity, unit_price, flavor, create_time) VALUES
('Espresso', 'https://example.com/images/espresso.jpg', 1, 1, NULL, 2, 2.50, '{"Temperature": "Hot", "Size": "Double"}', '2024-01-15 09:00:00'),
('Cappuccino', 'https://example.com/images/cappuccino.jpg', 1, 2, NULL, 1, 4.25, '{"Temperature": "Hot", "Size": "Medium", "Milk Type": "Whole"}', '2024-01-15 09:05:00'),
('Breakfast Deluxe', 'https://example.com/images/breakfast-deluxe.jpg', 2, NULL, 1, 1, 12.99, '{}', '2024-01-15 07:30:00'),
('Green Tea', 'https://example.com/images/green-tea.jpg', 3, 5, NULL, 1, 3.00, '{"Sweetness": "No Sugar"}', '2024-01-15 08:15:00'),
('Club Sandwich', 'https://example.com/images/club-sandwich.jpg', 4, 9, NULL, 1, 8.50, '{}', '2024-01-15 12:30:00'),
('Tropical Smoothie', 'https://example.com/images/tropical-smoothie.jpg', 5, 11, NULL, 2, 5.50, '{"Protein Boost": "Protein Powder", "Sweetness": "Regular"}', '2024-01-15 14:00:00'),
('Latte', 'https://example.com/images/latte.jpg', 6, 3, NULL, 1, 4.75, '{"Temperature": "Iced", "Size": "Large", "Flavor Syrup": "Vanilla"}', '2024-01-15 06:45:00'),
('Croissant', 'https://example.com/images/croissant.jpg', 7, 7, NULL, 3, 3.50, '{"Toasting": "Lightly Toasted"}', '2024-01-15 10:20:00'),
('Executive Lunch', 'https://example.com/images/executive-lunch.jpg', 8, NULL, 3, 1, 15.99, '{}', '2024-01-15 11:45:00'),
('Iced Coffee', 'https://example.com/images/iced-coffee.jpg', 9, 19, NULL, 1, 3.75, '{"Temperature": "Iced", "Size": "Medium"}', '2024-01-15 15:30:00'),
('Caesar Salad', 'https://example.com/images/caesar-salad.jpg', 10, 10, NULL, 1, 7.25, '{"Dressing": "Light", "Add-ons": "Grilled Chicken"}', '2024-01-15 13:15:00'),
('Chocolate Cake', 'https://example.com/images/chocolate-cake.jpg', 11, 12, NULL, 1, 5.25, '{}', '2024-01-15 16:45:00'),
('Healthy Choice', 'https://example.com/images/healthy-choice.jpg', 12, NULL, 4, 1, 13.99, '{}', '2024-01-15 12:00:00'),
('Americano', 'https://example.com/images/americano.jpg', 13, 4, NULL, 2, 3.25, '{"Temperature": "Hot", "Size": "Large"}', '2024-01-15 07:00:00'),
('Blueberry Muffin', 'https://example.com/images/blueberry-muffin.jpg', 14, 8, NULL, 2, 3.25, '{"Temperature": "Warm"}', '2024-01-15 09:30:00'),
('Earl Grey Tea', 'https://example.com/images/earl-grey.jpg', 15, 6, NULL, 1, 2.75, '{"Sweetness": "Less Sugar"}', '2024-01-15 14:30:00'),
('Chicken Wrap', 'https://example.com/images/chicken-wrap.jpg', 16, 16, NULL, 1, 7.75, '{}', '2024-01-15 12:45:00'),
('Coffee Lover Special', 'https://example.com/images/coffee-lover.jpg', 17, NULL, 5, 1, 11.99, '{}', '2024-01-15 08:00:00'),
('Orange Juice', 'https://example.com/images/orange-juice.jpg', 18, 13, NULL, 1, 4.00, '{}', '2024-01-15 10:45:00'),
('Study Break Combo', 'https://example.com/images/study-break.jpg', 19, NULL, 7, 1, 8.99, '{}', '2024-01-15 19:30:00');

-- =============================================
-- 11. ORDERS TABLE (20 records)
-- =============================================
INSERT INTO orders (number, status, user_id, address_book_id, order_time, checkout_time, pay_method, pay_status, amount, notes, phone, address, user_name, name, cancel_reason, rejection_reason, cancel_time, estimated_delivery_time, delivery_status, delivery_time, pack_amount, tableware_number, tableware_status) VALUES
('ORD2024011509001', 5, 1, 1, '2024-01-15 09:00:00', '2024-01-15 09:05:00', 1, 1, 9.25, 'Extra hot please', '555-2001', '123 Wall Street, Apt 4B', 'Alice Cooper', 'Alice Cooper', NULL, NULL, NULL, '2024-01-15 09:30:00', 1, '2024-01-15 09:25:00', 2, 1, 1),
('ORD2024011507302', 5, 2, 3, '2024-01-15 07:30:00', '2024-01-15 07:35:00', 1, 1, 12.99, 'No onions please', '555-2002', '789 Sunset Blvd', 'Bob Smith', 'Bob Smith', NULL, NULL, NULL, '2024-01-15 08:00:00', 1, '2024-01-15 07:55:00', 3, 2, 1),
('ORD2024011508153', 5, 3, 5, '2024-01-15 08:15:00', '2024-01-15 08:20:00', 2, 1, 3.00, 'Extra napkins', '555-2003', '321 Michigan Avenue', 'Carol Davis', 'Carol Davis', NULL, NULL, NULL, '2024-01-15 08:45:00', 0, '2024-01-15 09:15:00', 1, 1, 1),
('ORD2024011512304', 5, 4, 7, '2024-01-15 12:30:00', '2024-01-15 12:35:00', 1, 1, 8.50, 'No pickles', '555-2004', '555 Main Street, Apt 2A', 'David Wilson', 'David Wilson', NULL, NULL, NULL, '2024-01-15 13:00:00', 1, '2024-01-15 12:50:00', 2, 1, 1),
('ORD2024011514005', 4, 5, 9, '2024-01-15 14:00:00', '2024-01-15 14:05:00', 1, 1, 11.00, 'Delivery to front desk', '555-2005', '999 Ocean Drive', 'Emma Brown', 'Emma Brown', NULL, NULL, NULL, '2024-01-15 14:30:00', 1, NULL, 1, 1, 1),
('ORD2024011506456', 5, 6, 11, '2024-01-15 06:45:00', '2024-01-15 06:50:00', 1, 1, 4.75, 'Extra vanilla', '555-2006', '777 Pike Street', 'Frank Miller', 'Frank Miller', NULL, NULL, NULL, '2024-01-15 07:15:00', 1, '2024-01-15 07:10:00', 1, 1, 1),
('ORD2024011510207', 5, 7, 13, '2024-01-15 10:20:00', '2024-01-15 10:25:00', 2, 1, 10.50, 'Lightly toasted', '555-2007', '444 Larimer Street', 'Grace Taylor', 'Grace Taylor', NULL, NULL, NULL, '2024-01-15 10:50:00', 1, '2024-01-15 10:45:00', 2, 1, 1),
('ORD2024011511458', 3, 8, 15, '2024-01-15 11:45:00', '2024-01-15 11:50:00', 1, 1, 15.99, 'No onions in sandwich', '555-2008', '222 Camelback Road', 'Henry Anderson', 'Henry Anderson', NULL, NULL, NULL, '2024-01-15 12:30:00', 1, NULL, 3, 2, 1),
('ORD2024011515309', 2, 9, 17, '2024-01-15 15:30:00', NULL, 1, 1, 3.75, 'Less ice', '555-2009', '111 NW 23rd Avenue', 'Isabella Thomas', 'Isabella Thomas', NULL, NULL, NULL, '2024-01-15 16:00:00', 1, NULL, 1, 1, 1),
('ORD20240115131510', 5, 10, 19, '2024-01-15 13:15:00', '2024-01-15 13:20:00', 2, 1, 10.25, 'Dressing on side', '555-2010', '333 Boylston Street', 'Jack Jackson', 'Jack Jackson', NULL, NULL, NULL, '2024-01-15 13:45:00', 1, '2024-01-15 13:40:00', 2, 1, 1),
('ORD20240115164511', 1, 11, 20, '2024-01-15 16:45:00', NULL, 1, 0, 5.25, 'Birthday treat!', '555-2011', '666 Las Vegas Blvd', 'Kate White', 'Kate White', NULL, NULL, NULL, '2024-01-15 17:15:00', 1, NULL, 1, 1, 1),
('ORD20240115120012', 5, 12, 1, '2024-01-15 12:00:00', '2024-01-15 12:05:00', 1, 1, 13.99, 'Extra protein', '555-2012', '123 Wall Street, Apt 4B', 'Liam Harris', 'Liam Harris', NULL, NULL, NULL, '2024-01-15 12:30:00', 0, '2024-01-15 13:00:00', 2, 1, 1),
('ORD20240115070013', 5, 13, 3, '2024-01-15 07:00:00', '2024-01-15 07:05:00', 1, 1, 6.50, 'Strong coffee', '555-2013', '789 Sunset Blvd', 'Maya Martin', 'Maya Martin', NULL, NULL, NULL, '2024-01-15 07:30:00', 1, '2024-01-15 07:25:00', 2, 2, 1),
('ORD20240115093014', 5, 14, 5, '2024-01-15 09:30:00', '2024-01-15 09:35:00', 2, 1, 6.50, 'Warm muffins', '555-2014', '321 Michigan Avenue', 'Noah Thompson', 'Noah Thompson', NULL, NULL, NULL, '2024-01-15 10:00:00', 1, '2024-01-15 09:55:00', 2, 1, 1),
('ORD20240115143015', 5, 15, 7, '2024-01-15 14:30:00', '2024-01-15 14:35:00', 1, 1, 2.75, 'No sugar added', '555-2015', '555 Main Street, Apt 2A', 'Olivia Garcia', 'Olivia Garcia', NULL, NULL, NULL, '2024-01-15 15:00:00', 1, '2024-01-15 14:50:00', 1, 1, 1),
('ORD20240115124516', 6, 16, 9, '2024-01-15 12:45:00', NULL, 1, 0, 7.75, 'Changed mind', '555-2016', '999 Ocean Drive', 'Peter Martinez', 'Peter Martinez', 'Customer requested cancellation', NULL, '2024-01-15 13:00:00', NULL, 1, NULL, 1, 1, 1),
('ORD20240115080017', 5, 17, 11, '2024-01-15 08:00:00', '2024-01-15 08:05:00', 1, 1, 11.99, 'Office delivery', '555-2017', '777 Pike Street', 'Quinn Robinson', 'Quinn Robinson', NULL, NULL, NULL, '2024-01-15 08:30:00', 1, '2024-01-15 08:25:00', 3, 2, 1),
('ORD20240115104518', 5, 18, 13, '2024-01-15 10:45:00', '2024-01-15 10:50:00', 2, 1, 4.00, 'Fresh squeezed', '555-2018', '444 Larimer Street', 'Rachel Clark', 'Rachel Clark', NULL, NULL, NULL, '2024-01-15 11:15:00', 1, '2024-01-15 11:10:00', 1, 1, 1),
('ORD20240115193019', 2, 19, 15, '2024-01-15 19:30:00', '2024-01-15 19:35:00', 1, 1, 8.99, 'Study fuel', '555-2019', '222 Camelback Road', 'Sam Rodriguez', 'Sam Rodriguez', NULL, NULL, NULL, '2024-01-15 20:00:00', 1, NULL, 1, 1, 1),
('ORD20240115080020', 5, 20, 17, '2024-01-15 08:00:00', '2024-01-15 08:05:00', 1, 1, 9.25, 'Breakfast meeting', '555-2020', '333 North Broadway', 'Tina Lewis', 'Tina Lewis', NULL, NULL, NULL, '2024-01-15 08:30:00', 1, '2024-01-15 08:25:00', 2, 1, 1);

-- =============================================
-- 12. ORDER_DETAIL TABLE (20 records)
-- =============================================
INSERT INTO order_detail (name, image, order_id, menu_item_id, combo_id, quantity, unit_price, tax) VALUES
('Espresso', 'https://example.com/images/espresso.jpg', 1, 1, NULL, 2, 2.50, 0.25),
('Cappuccino', 'https://example.com/images/cappuccino.jpg', 1, 2, NULL, 1, 4.25, 0.43),
('Breakfast Deluxe', 'https://example.com/images/breakfast-deluxe.jpg', 2, NULL, 1, 1, 12.99, 1.30),
('Green Tea', 'https://example.com/images/green-tea.jpg', 3, 5, NULL, 1, 3.00, 0.30),
('Club Sandwich', 'https://example.com/images/club-sandwich.jpg', 4, 9, NULL, 1, 8.50, 0.85),
('Tropical Smoothie', 'https://example.com/images/tropical-smoothie.jpg', 5, 11, NULL, 2, 5.50, 0.55),
('Latte', 'https://example.com/images/latte.jpg', 6, 3, NULL, 1, 4.75, 0.48),
('Croissant', 'https://example.com/images/croissant.jpg', 7, 7, NULL, 3, 3.50, 0.35),
('Executive Lunch', 'https://example.com/images/executive-lunch.jpg', 8, NULL, 3, 1, 15.99, 1.60),
('Iced Coffee', 'https://example.com/images/iced-coffee.jpg', 9, 19, NULL, 1, 3.75, 0.38),
('Caesar Salad', 'https://example.com/images/caesar-salad.jpg', 10, 10, NULL, 1, 7.25, 0.73),
('Chocolate Cake', 'https://example.com/images/chocolate-cake.jpg', 11, 12, NULL, 1, 5.25, 0.53),
('Healthy Choice', 'https://example.com/images/healthy-choice.jpg', 12, NULL, 4, 1, 13.99, 1.40),
('Americano', 'https://example.com/images/americano.jpg', 13, 4, NULL, 2, 3.25, 0.33),
('Blueberry Muffin', 'https://example.com/images/blueberry-muffin.jpg', 14, 8, NULL, 2, 3.25, 0.33),
('Earl Grey Tea', 'https://example.com/images/earl-grey.jpg', 15, 6, NULL, 1, 2.75, 0.28),
('Chicken Wrap', 'https://example.com/images/chicken-wrap.jpg', 16, 16, NULL, 1, 7.75, 0.78),
('Coffee Lover Special', 'https://example.com/images/coffee-lover.jpg', 17, NULL, 5, 1, 11.99, 1.20),
('Orange Juice', 'https://example.com/images/orange-juice.jpg', 18, 13, NULL, 1, 4.00, 0.40),
('Study Break Combo', 'https://example.com/images/study-break.jpg', 19, NULL, 7, 1, 8.99, 0.90);

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Summary of inserted records:
-- Employee: 20 records
-- Category: 20 records
-- Shop: 5 records
-- MenuItem: 20 records
-- MenuItemFlavors: 20 records
-- Combo: 20 records
-- ComboItem: 20 records
-- User: 20 records
-- AddressBook: 20 records
-- ShoppingCart: 20 records
-- Orders: 20 records
-- OrderDetail: 20 records
--
-- Total: 225 records across all tables

-- This dump data provides comprehensive test coverage for:
-- - Employee management with audit trails
-- - Menu categories and items with flavor options
-- - Shop locations with different operating hours
-- - User accounts and address management
-- - Shopping cart functionality
-- - Order processing with various statuses
-- - Combo deals and their components
-- - Payment and delivery tracking
-- - Realistic business scenarios and data relationships