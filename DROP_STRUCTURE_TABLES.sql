-- Drop structure-related tables from database
-- Run this in your Supabase SQL Editor

-- Drop structure_settings table
DROP TABLE IF EXISTS structure_settings CASCADE;

-- Drop structures table
DROP TABLE IF EXISTS structures CASCADE;

-- Note: This will permanently delete all structure data
-- Make sure you have a backup if you need to restore this data later
