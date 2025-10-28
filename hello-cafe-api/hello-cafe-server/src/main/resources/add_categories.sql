-- =======================
-- add categories
-- =======================
-- Insert default menu categories
INSERT INTO category (name, type, sort, status, create_time, update_time, create_employee, update_employee)
VALUES
    ('Coffee', 1, 1, 0, NOW(), NOW(), 1, 1),
    ('Burgers', 1, 2, 0, NOW(), NOW(), 1, 1),
    ('Sandwiches', 1, 3, 0, NOW(), NOW(), 1, 1),
    ('Bread', 1, 4, 0, NOW(), NOW(), 1, 1),
    ('Cake', 1, 5, 0, NOW(), NOW(), 1, 1),
    ('Soup', 1, 6, 0, NOW(), NOW(), 1, 1),
    ('Fries', 1, 7, 0, NOW(), NOW(), 1, 1),
    ('Salad', 1, 8, 0, NOW(), NOW(), 1, 1),
    ('Pizza', 1, 9, 0, NOW(), NOW(), 1, 1),
    ('Pasta', 1, 10, 0, NOW(), NOW(), 1, 1),
    ('Combo Meals', 2, 11, 0, NOW(), NOW(), 1, 1)

