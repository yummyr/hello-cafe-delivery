-- Create menu_item_flavors table
CREATE TABLE menu_item_flavors (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    menu_item_id BIGINT NOT NULL,
    name VARCHAR(50) NOT NULL COMMENT 'Flavor name e.g., Sweetness, Temperature, Ice Level',
    value VARCHAR(255) NOT NULL,
    FOREIGN KEY (menu_item_id) REFERENCES menu_item(id) ON DELETE CASCADE
);

-- Insert sample flavor data with each flavor type having independent IDs
INSERT INTO menu_item_flavors (menu_item_id, name, value) VALUES
-- Sweetness options
(4, 'Sweetness', '["Full Sugar"]'),
-- Temperature options
(4, 'Temperature', '["Cold"]'),
(4, 'Milk Option', '["Oat Milk"]'),
-- Milk options
(6, 'Milk Option', '["Whole Milk"]'),
-- Ice level options
(6, 'Ice Level', '["No Ice"]'),
-- Espresso shot options
(5, 'Espresso Shot', '[ "Double"]');