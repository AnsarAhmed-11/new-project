import db from "../lib/db";

export async function createProduct({ name, description, imageUrl, sourceUrl, slug, sku }) {
  const [result] = await db.execute(
    "INSERT INTO products (name, description, image_url, source_url, slug, sku) VALUES (?, ?, ?, ?, ?, ?)",
    [name, description || null, imageUrl, sourceUrl || null, slug, sku || null],
  );

  return result.insertId;
}

export async function getProductBySlug(slug) {
  const [rows] = await db.execute(
    `SELECT p.id, p.name, p.description, p.image_url AS imageUrl,
      p.source_url AS sourceUrl, p.slug, p.sku, p.status,
      COALESCE(JSON_ARRAYAGG(JSON_OBJECT('size', pp.size, 'price', pp.price, 'currency', pp.currency)), JSON_ARRAY()) AS prices
      FROM products p LEFT JOIN product_prices pp ON pp.product_id = p.id
      WHERE p.slug = ? GROUP BY p.id LIMIT 1`,
    [slug],
  );
  const product = rows[0];
  if (!product) return null;
  const prices = typeof product.prices === "string" ? JSON.parse(product.prices) : product.prices;
  return { ...product, prices: Array.isArray(prices) ? prices.filter((price) => price?.size) : [] };
}

export async function getProducts() {
  const [rows] = await db.execute(
    `SELECT p.id, p.name, p.description, p.image_url AS imageUrl,
      p.source_url AS sourceUrl, p.slug, p.sku, p.status,
      COALESCE(JSON_ARRAYAGG(JSON_OBJECT('size', pp.size, 'price', pp.price, 'currency', pp.currency)), JSON_ARRAY()) AS prices
      FROM products p LEFT JOIN product_prices pp ON pp.product_id = p.id
      GROUP BY p.id ORDER BY p.created_at DESC`,
  );

  return rows.map((product) => {
    const prices = typeof product.prices === "string" ? JSON.parse(product.prices) : product.prices;
    return {
      ...product,
      prices: Array.isArray(prices) ? prices.filter((price) => price?.size) : [],
    };
  });
}
