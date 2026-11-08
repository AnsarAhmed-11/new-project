-- Catalogue seed from Merciful Price List No. 9 (valid from 15 Sep. 2021).
-- Product images use assets committed under public/uploads/products.
INSERT INTO products (name, description, image_url, source_url, slug, sku)
VALUES
  ('Solid Centers', 'Fixed centres for accurate support during turning operations.', '/uploads/products/cc47627b-24cd-4695-844c-f4892f42cb3c.jpg', '/uploads/products/cc47627b-24cd-4695-844c-f4892f42cb3c.jpg', 'solid-centers', 'MIT-SC'),
  ('Live Center', 'Revolving live centres for smooth and accurate turning.', '/uploads/products/cc47627b-24cd-4695-844c-f4892f42cb3c.jpg', '/uploads/products/cc47627b-24cd-4695-844c-f4892f42cb3c.jpg', 'live-center', 'MIT-LC'),
  ('Dead Center', 'Reliable dead centres in carbon-steel and carbide-tipped options.', '/uploads/products/cc47627b-24cd-4695-844c-f4892f42cb3c.jpg', '/uploads/products/cc47627b-24cd-4695-844c-f4892f42cb3c.jpg', 'dead-center', 'MIT-DC'),
  ('Extension Sleeve', 'Morse taper drill sleeves for extending tool reach.', '/uploads/products/cc47627b-24cd-4695-844c-f4892f42cb3c.jpg', '/uploads/products/cc47627b-24cd-4695-844c-f4892f42cb3c.jpg', 'extension-sleeve', 'MIT-ES'),
  ('Machinist Divider', 'Accurate spring-type layout and measurement tool.', '/uploads/products/cc47627b-24cd-4695-844c-f4892f42cb3c.jpg', '/uploads/products/cc47627b-24cd-4695-844c-f4892f42cb3c.jpg', 'machinist-divider', 'MIT-MD')
ON DUPLICATE KEY UPDATE name = VALUES(name), description = VALUES(description), image_url = VALUES(image_url), source_url = VALUES(source_url);

INSERT INTO product_prices (product_id, size, price)
SELECT p.id, v.size, v.price FROM products p JOIN (
  SELECT 'solid-centers' slug, 'MT 1' size, 270.00 price UNION ALL SELECT 'solid-centers', 'MT 2', 270.00 UNION ALL SELECT 'solid-centers', 'MT 3', 480.00 UNION ALL SELECT 'solid-centers', 'MT 4', 810.00 UNION ALL SELECT 'solid-centers', 'MT 5', 2100.00 UNION ALL SELECT 'solid-centers', 'MT 6', 7500.00
  UNION ALL SELECT 'dead-center', 'MT 1-6 - carbon steel', 7500.00 UNION ALL SELECT 'dead-center', 'MT 1-6 - carbide tipped', 12000.00
  UNION ALL SELECT 'live-center', 'MT 1 - male point', 1800.00 UNION ALL SELECT 'live-center', 'MT 2 - male point', 1950.00 UNION ALL SELECT 'live-center', 'MT 3 - male point', 2640.00 UNION ALL SELECT 'live-center', 'MT 4 - male point', 3300.00 UNION ALL SELECT 'live-center', 'MT 5 - male point', 6300.00 UNION ALL SELECT 'live-center', 'MT 6 - male point', 18000.00
  UNION ALL SELECT 'live-center', 'MT 1 - carbide tipped', 2700.00 UNION ALL SELECT 'live-center', 'MT 2 - carbide tipped', 2700.00 UNION ALL SELECT 'live-center', 'MT 3 - carbide tipped', 5400.00 UNION ALL SELECT 'live-center', 'MT 4 - carbide tipped', 7200.00 UNION ALL SELECT 'live-center', 'MT 5 - carbide tipped', 12000.00 UNION ALL SELECT 'live-center', 'MT 6 - carbide tipped', 36000.00
  UNION ALL SELECT 'extension-sleeve', 'MT 0-1 - W/S grade', 180.00 UNION ALL SELECT 'extension-sleeve', 'MT 1-2 - W/S grade', 192.00 UNION ALL SELECT 'extension-sleeve', 'MT 2-3 - W/S grade', 261.00 UNION ALL SELECT 'extension-sleeve', 'MT 3-4 - W/S grade', 435.00 UNION ALL SELECT 'extension-sleeve', 'MT 4-5 - W/S grade', 1170.00 UNION ALL SELECT 'extension-sleeve', 'MT 5-6 - W/S grade', 4500.00
  UNION ALL SELECT 'machinist-divider', '6 in - workshop grade', 96.00 UNION ALL SELECT 'machinist-divider', '6 in - A grade', 270.00 UNION ALL SELECT 'machinist-divider', '10 in - A grade', 300.00 UNION ALL SELECT 'machinist-divider', '12 in - A grade', 390.00
) v ON v.slug = p.slug
ON DUPLICATE KEY UPDATE price = VALUES(price);
