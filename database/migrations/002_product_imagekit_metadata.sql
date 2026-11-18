-- Add ImageKit metadata used to validate and clean up product images.
-- This migration is additive and preserves all existing product data.
ALTER TABLE products
  ADD COLUMN imagekit_file_id VARCHAR(255) NULL,
  ADD COLUMN imagekit_file_path VARCHAR(500) NULL;
