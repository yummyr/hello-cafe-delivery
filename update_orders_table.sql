-- Update hello_cafe_db orders table
-- Remove redundant columns that are available through address_book relationship

-- First, let's verify the current structure
DESCRIBE orders;

-- Check if there are any orders with pack_amount data (to understand if we need to handle this)
SELECT
    id,
    number,
    pack_amount,
    user_name,
    name,
    phone,
    address,
    address_book_id
FROM orders
WHERE pack_amount IS NOT NULL
   OR user_name IS NOT NULL
   OR name IS NOT NULL
   OR phone IS NOT NULL
   OR address IS NOT NULL
LIMIT 10;

-- Verify that address_book_id exists and has valid relationships
SELECT
    o.id as order_id,
    o.number,
    o.address_book_id,
    o.pack_amount as old_pack_amount,
    o.user_name as old_user_name,
    o.name as old_name,
    o.phone as old_phone,
    o.address as old_address,
    a.name as address_name,
    a.phone as address_phone,
    a.address as address_detail,
    CONCAT(a.address, ', ', a.city, ', ', a.state, ' ', a.zipcode) as full_address
FROM orders o
LEFT JOIN address_book a ON o.address_book_id = a.id
WHERE o.address_book_id IS NOT NULL
LIMIT 5;

-- Remove the redundant columns
ALTER TABLE orders
DROP COLUMN user_name,
DROP COLUMN name,
DROP COLUMN phone,
DROP COLUMN address,
DROP COLUMN pack_amount;

-- Verify the updated structure
DESCRIBE orders;

-- Final verification - check orders table after changes
SELECT
    id,
    number,
    address_book_id,
    status,
    amount,
    order_time
FROM orders
LIMIT 5;