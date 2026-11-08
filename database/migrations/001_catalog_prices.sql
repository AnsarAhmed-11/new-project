-- =========================================
-- 1. UPDATE PRODUCTS TABLE
-- =========================================

ALTER TABLE products
  ADD COLUMN source_url VARCHAR(500) NULL,
  ADD COLUMN slug VARCHAR(180) NULL,
  ADD COLUMN sku VARCHAR(80) NULL,
  ADD COLUMN status ENUM('inStock', 'outOfStock')
      NOT NULL DEFAULT 'inStock';


-- =========================================
-- 2. CREATE PRODUCT PRICES TABLE
-- =========================================

CREATE TABLE IF NOT EXISTS product_prices (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    product_id BIGINT UNSIGNED NOT NULL,
    size VARCHAR(80) NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    currency CHAR(3) NOT NULL DEFAULT 'INR',

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    UNIQUE KEY product_prices_product_size_unique
        (product_id, size),

    KEY product_prices_product_idx (product_id),

    CONSTRAINT product_prices_price_check
        CHECK (price >= 0),

    CONSTRAINT product_prices_product_fk
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;