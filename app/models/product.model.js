import db from "../lib/db";

const Product_fields = [
  "name",
  "slug",
  "description",
  "category_id",
  "sku",
  "status",
];
export async function createProduct({ name, description, imageUrl }) {
  const [result] = await db.execute(
    "INSERT INTO products (name, description, image_url) VALUES (?, ?, ?)",
    [name, description || null, imageUrl],
  );

  return result.insertId;
}

export async function getProducts() {
  const [rows] = await db.execute(
    "SELECT id, name, description, image_url AS imageUrl, created_at AS createdAt FROM products ORDER BY created_at DESC",
  );

  return rows;
}
