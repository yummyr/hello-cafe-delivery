INSERT INTO menu_item (id, name, category_id, price, image, description, status, create_time, update_time, create_employee, update_employee) VALUES
-- Espresso Classics
(4, 'Espresso', 1, 4.5, '', 'Rich and bold single shot espresso.', 1, NOW(), NOW(), 1, 1),
(5, 'Americano', 1, 5.0, '', 'Smooth espresso diluted with hot water.', 1, NOW(), NOW(), 1, 1),

-- Brewed Coffee
(6, 'House Blend', 2, 5.2, '', 'Classic medium roast brewed coffee.', 1, NOW(), NOW(), 1, 1),
(7, 'French Roast', 2, 5.5, '', 'Dark roast with smoky, bold flavor.', 1, NOW(), NOW(), 1, 1),

-- Cold Brew
(8, 'Classic Cold Brew', 3, 5.8, '', 'Slow-steeped coffee with smooth taste.', 1, NOW(), NOW(), 1, 1),
(9, 'Vanilla Cream Cold Brew', 3, 6.2, '', 'Cold brew topped with vanilla cream foam.', 1, NOW(), NOW(), 1, 1),

-- Latte Variations
(10, 'Vanilla Latte', 4, 6.0, '', 'Espresso blended with steamed milk and vanilla syrup.', 1, NOW(), NOW(), 1, 1),
(11, 'Caramel Latte', 4, 6.3, '', 'Silky latte sweetened with caramel drizzle.', 1, NOW(), NOW(), 1, 1),

-- Cappuccino & Macchiato
(12, 'Cappuccino', 5, 6.0, '', 'Espresso with equal parts steamed milk and foam.', 1, NOW(), NOW(), 1, 1),
(13, 'Caramel Macchiato', 5, 6.5, '', 'Espresso layered with milk and caramel.', 1, NOW(), NOW(), 1, 1),

-- Mocha & Flavored Coffee
(14, 'Classic Mocha', 6, 6.5, '', 'Espresso with chocolate and steamed milk.', 1, NOW(), NOW(), 1, 1),
(15, 'White Chocolate Mocha', 6, 6.8, '', 'Smooth espresso with white chocolate flavor.', 1, NOW(), NOW(), 1, 1),

-- Club Sandwiches
(16, 'Classic Club Sandwich', 7, 9.5, '', 'Triple-layer sandwich with turkey, bacon, and lettuce.', 1, NOW(), NOW(), 1, 1),

-- Turkey Sandwiches
(17, 'Turkey & Swiss Sandwich', 8, 9.2, '', 'Roasted turkey with Swiss cheese on sourdough.', 1, NOW(), NOW(), 1, 1),

-- Chicken Sandwiches
(18, 'Grilled Chicken Sandwich', 9, 10.0, '', 'Juicy grilled chicken with lettuce and tomato.', 1, NOW(), NOW(), 1, 1),

-- Vegetarian Sandwiches
(19, 'Avocado Veggie Sandwich', 10, 9.0, '', 'Loaded with avocado, sprouts, and hummus.', 1, NOW(), NOW(), 1, 1),

-- Breakfast Sandwiches
(20, 'Egg & Cheese Muffin', 11, 7.5, '', 'Scrambled egg and cheddar on an English muffin.', 1, NOW(), NOW(), 1, 1),

-- Beef Burgers
(21, 'Classic Beef Burger', 12, 11.5, '', 'Juicy beef patty with lettuce and tomato.', 1, NOW(), NOW(), 1, 1),

-- Chicken Burgers
(22, 'Crispy Chicken Burger', 13, 12.0, '', 'Crispy chicken fillet with mayo and pickles.', 1, NOW(), NOW(), 1, 1),

-- Veggie Burgers
(23, 'Mushroom Veggie Burger', 14, 11.0, '', 'Grilled mushroom patty with fresh greens.', 1, NOW(), NOW(), 1, 1),

-- Sliders
(24, 'Mini Cheeseburger Sliders', 15, 10.5, '', 'Three small cheeseburgers served together.', 1, NOW(), NOW(), 1, 1),

-- Berry Tarts
(25, 'Mixed Berry Tart', 16, 6.5, '', 'Fresh berries on creamy custard base.', 1, NOW(), NOW(), 1, 1),

-- Citrus Tarts
(26, 'Lemon Tart', 17, 6.3, '', 'Tangy lemon filling with buttery crust.', 1, NOW(), NOW(), 1, 1),

-- Chocolate Tarts
(27, 'Dark Chocolate Tart', 18, 6.8, '', 'Rich chocolate ganache in crisp shell.', 1, NOW(), NOW(), 1, 1),

-- Quiche & Savory Tarts
(28, 'Spinach Quiche', 19, 7.5, '', 'Flaky crust filled with spinach and cheese.', 1, NOW(), NOW(), 1, 1),

-- Combo Deals
(29, 'Coffee + Sandwich Combo', 20, 13.5, '', 'Hot coffee paired with your favorite sandwich.', 1, NOW(), NOW(), 1, 1),
(30, 'Coffee + Burger Combo', 21, 14.5, '', 'Classic combo of coffee and burger.', 1, NOW(), NOW(), 1, 1),
(31, 'Iced Drink + Panini Combo', 22, 15.0, '', 'Refreshing iced drink and warm panini.', 1, NOW(), NOW(), 1, 1),
(32, 'Smoothie + Dessert Combo', 23, 14.0, '', 'Smoothie served with a sweet treat.', 1, NOW(), NOW(), 1, 1),
(33, 'Tea + Tart Combo', 24, 13.0, '', 'A relaxing tea with a slice of tart.', 1, NOW(), NOW(), 1, 1),
(34, 'Breakfast Combo Deal', 25, 12.5, '', 'Morning sandwich with coffee and hash browns.', 1, NOW(), NOW(), 1, 1),
(35, 'Lunch Special Combo', 26, 15.5, '', 'Burger, fries, and drink combo.', 1, NOW(), NOW(), 1, 1),
(36, 'Value Meal Deal', 27, 13.5, '', 'Budget-friendly meal combo with fries.', 1, NOW(), NOW(), 1, 1),
(37, 'Family Combo', 28, 28.0, '', 'Meal set for sharing with 4–5 servings.', 1, NOW(), NOW(), 1, 1),
(38, 'Seasonal Combo', 29, 16.0, '', 'Limited-time combo featuring seasonal flavors.', 1, NOW(), NOW(), 1, 1);
