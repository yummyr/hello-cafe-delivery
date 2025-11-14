-- Clean up redundant address fields in orders table
-- These fields are redundant because we can get all this info from address_book table via address_book_id

-- First, let's check if there are any orders that might lose data
SELECT
    id,
    number,
    address_book_id,
    phone,
    address,
    user_name,
    name,
    'Current redundant data' as status
FROM orders
WHERE address_book_id IS NOT NULL
  AND (phone IS NOT NULL OR address IS NOT NULL OR user_name IS NOT NULL OR name IS NOT NULL)
LIMIT 10;

-- Verify that address_book table has the required data
SELECT
    o.id as order_id,
    o.address_book_id,
    o.phone as order_phone,
    o.address as order_address,
    o.user_name as order_user_name,
    o.name as order_name,
    a.name as address_name,
    a.phone as address_phone,
    a.address as address_address
FROM orders o
LEFT JOIN address_book a ON o.address_book_id = a.id
WHERE o.address_book_id IS NOT NULL
LIMIT 5;

-- If the verification shows data matches, we can safely remove the redundant columns:
-- Uncomment these commands after verification:

-- ALTER TABLE orders DROP COLUMN phone;
-- ALTER TABLE orders DROP COLUMN address;
-- ALTER TABLE orders DROP COLUMN user_name;
-- ALTER TABLE orders DROP COLUMN name;

-- Verify the changes
-- DESCRIBE orders;