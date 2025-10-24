-- =======================
-- add categories
-- =======================
-- Coffee varieties (sort: 1)
INSERT IGNORE INTO category (name, type, sort, status, create_time, update_time, create_employee, update_employee) VALUES
('Espresso Classics', 1, 1, 1, NOW(), NOW(), 1, 1),
('Brewed Coffee', 1, 1, 1, NOW(), NOW(), 1, 1),
('Cold Brew', 1, 3, 1, NOW(), NOW(), 1, 1),
('Latte Variations', 1, 1, 1, NOW(), NOW(), 1, 1),
('Cappuccino & Macchiato', 1, 1, 1, NOW(), NOW(), 1, 1),
('Mocha & Flavored Coffee', 1, 1, 1, NOW(), NOW(), 1, 1),

-- Sandwiches by type (sort: 2)
('Club Sandwiches', 1, 2, 1, NOW(), NOW(), 1, 1),
('Turkey Sandwiches', 1, 2, 1, NOW(), NOW(), 1, 1),
('Chicken Sandwiches', 1, 2, 1, NOW(), NOW(), 1, 1),
('Vegetarian Sandwiches', 1, 2, 1, NOW(), NOW(), 1, 1),
('Breakfast Sandwiches', 1, 2, 1, NOW(), NOW(), 1, 1),

-- Burgers (sort: 3)
('Beef Burgers', 1, 3, 1, NOW(), NOW(), 1, 1),
('Chicken Burgers', 1, 3, 1, NOW(), NOW(), 1, 1),
('Veggie Burgers', 1, 3, 1, NOW(), NOW(), 1, 1),
('Sliders', 1, 3, 1, NOW(), NOW(), 1, 1),

-- Tarts (sort: 4)
('Berry Tarts', 1, 4, 1, NOW(), NOW(), 1, 1),
('Citrus Tarts', 1, 4, 1, NOW(), NOW(), 1, 1),
('Chocolate Tarts', 1, 4, 1, NOW(), NOW(), 1, 1),
('Quiche & Savory Tarts', 1, 4, 1, NOW(), NOW(), 1, 1),

-- Combo meals (drink + main course + side) (sort: 5)
('Coffee + Sandwich + Fries', 2, 5, 1, NOW(), NOW(), 1, 1),
('Coffee + Burger + Fries', 2, 5, 1, NOW(), NOW(), 1, 1),
('Iced Drink + Panini + Salad', 2, 5, 1, NOW(), NOW(), 1, 1),
('Smoothie + Sandwich + Dessert', 2, 5, 1, NOW(), NOW(), 1, 1),
('Tea + Tart Combo', 2, 5, 1, NOW(), NOW(), 1, 1),
('Breakfast Combo Deals', 2, 5, 1, NOW(), NOW(), 1, 1),
('Lunch Special Combos', 2, 5, 1, NOW(), NOW(), 1, 1),
('Value Meal Deals', 2, 5, 1, NOW(), NOW(), 1, 1),
('Family Combos', 2, 5, 1, NOW(), NOW(), 1, 1),
('Seasonal Special Combos', 2, 5, 1, NOW(), NOW(), 1, 1);