# Merciful Tools – Database Schema

CREATE DATABASE IF NOT EXISTS merciful_tools;
USE merciful_tools;

-- =========================================
-- 1. USERS TABLE
-- Admin and user authentication
-- =========================================

CREATE TABLE IF NOT EXISTS users (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('SUPER_ADMIN', 'ADMIN') NOT NULL DEFAULT 'ADMIN',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY users_email_unique (email)
) ENGINE=InnoDB;


-- =========================================
-- 2. ADMIN SESSIONS TABLE
-- One user can have multiple sessions
-- =========================================

CREATE TABLE IF NOT EXISTS admin_sessions (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    token_hash CHAR(64) NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY admin_sessions_token_unique (token_hash),
    KEY admin_sessions_user_idx (user_id),
    KEY admin_sessions_expiry_idx (expires_at),

    CONSTRAINT admin_sessions_user_fk
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;


-- =========================================
-- 3. PRODUCTS TABLE
-- Main product information
-- =========================================

CREATE TABLE IF NOT EXISTS products (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(160) NOT NULL,
    description TEXT NULL,
    image_url VARCHAR(500) NOT NULL,
    source_url VARCHAR(500) NULL,
    slug VARCHAR(180) NOT NULL,
    sku VARCHAR(80) NOT NULL,
    status ENUM('inStock', 'outOfStock')
        NOT NULL DEFAULT 'inStock',

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY products_slug_unique (slug),
    UNIQUE KEY products_sku_unique (sku),
    KEY products_status_idx (status),
    KEY products_created_at_idx (created_at)
) ENGINE=InnoDB;


-- =========================================
-- 4. PRODUCT PRICES TABLE
-- One product can have multiple sizes/prices
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

    CONSTRAINT product_prices_price_check
        CHECK (price >= 0),

    CONSTRAINT product_prices_product_fk
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;


-- =========================================
-- 5. ENQUIRIES TABLE
-- Customer product enquiries
-- =========================================

CREATE TABLE IF NOT EXISTS enquiries (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    product_id BIGINT UNSIGNED NULL,

    name VARCHAR(160) NOT NULL,
    company VARCHAR(160) NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(40) NOT NULL,

    message TEXT NOT NULL,

    status ENUM(
        'new',
        'contacted',
        'in_progress',
        'completed',
        'cancelled'
    ) NOT NULL DEFAULT 'new',

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    KEY enquiries_product_idx (product_id),
    KEY enquiries_status_idx (status),
    KEY enquiries_created_at_idx (created_at),
    KEY enquiries_email_idx (email),

    CONSTRAINT enquiries_product_fk
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE SET NULL
) ENGINE=InnoDB;

## Database relationships

| Parent | Child | Relationship |
|---|---|---|
| users | admin_sessions | One-to-Many |
| products | product_prices | One-to-Many |
| products | enquiries | One-to-Many |

## File structure

```text
merciful-tools/
│
├── database/
│   └── schema.sql
│
├── app/
├── models/
├── lib/
├── components/
└── ...


**Important:** Run this schema on a fresh database.
 `CREATE TABLE IF NOT EXISTS` does not modify tables that already exist.
  For an existing database, use proper ALTER migrations rather than dropping your existing data.