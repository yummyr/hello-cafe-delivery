-- Fix null status values in database tables
-- This script updates any NULL status values to appropriate defaults

-- Update MenuItem records with NULL status (default to DISABLE = 0)
UPDATE menu_item SET status = 0 WHERE status IS NULL;

-- Update Category records with NULL status (default to DISABLE = 0)
UPDATE category SET status = 0 WHERE status IS NULL;

-- Update Employee records with NULL status (default to DISABLE = 0)
UPDATE employee SET status = 0 WHERE status IS NULL;

-- Update Combo records with NULL status (default to DISABLE = 0)
UPDATE combo SET status = 0 WHERE status IS NULL;

-- Verify the updates
SELECT 'menu_item' as table_name, COUNT(*) as null_count FROM menu_item WHERE status IS NULL
UNION ALL
SELECT 'category' as table_name, COUNT(*) as null_count FROM category WHERE status IS NULL
UNION ALL
SELECT 'employee' as table_name, COUNT(*) as null_count FROM employee WHERE status IS NULL
UNION ALL
SELECT 'combo' as table_name, COUNT(*) as null_count FROM combo WHERE status IS NULL;