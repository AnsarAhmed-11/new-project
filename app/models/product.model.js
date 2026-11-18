
import db from "../lib/db";

/** @typedef {{ size: string, price: number, currency?: string }} ProductPriceInput */
/** @typedef {{
 * name: string,
 * description?: string | null,
 * imageUrl: string,
 * imageKitFileId?: string | null,
 * imageKitFilePath?: string | null,
 * sourceUrl?: string | null,
 * slug: string,
 * sku: string,
 * status?: 'inStock' | 'outOfStock',
 * prices?: ProductPriceInput[]
 * }} CreateProductInput */

const PRODUCT_FIELDS = `
  p.id,
  p.name,
  p.description,
  p.image_url AS imageUrl,
  p.imagekit_file_id AS imageKitFileId,
  p.imagekit_file_path AS imageKitFilePath,
  p.source_url AS sourceUrl,
  p.slug,
  p.sku,
  p.status,
  p.created_at AS createdAt,
  p.updated_at AS updatedAt,
  COALESCE(
    JSON_ARRAYAGG(
      CASE
        WHEN pp.id IS NULL THEN NULL
        ELSE JSON_OBJECT(
          'id', pp.id,
          'size', pp.size,
          'price', pp.price,
          'currency', pp.currency
        )
      END
    ),
    JSON_ARRAY()
  ) AS prices
`;

function parseProduct(row) {
  if (!row) return null;

  let prices = row.prices;
  if (typeof prices === "string") {
    try {
      prices = JSON.parse(prices);
    } catch {
      prices = [];
    }
  }

  return {
    ...row,
    prices: Array.isArray(prices)
      ? prices.filter((price) => price?.size)
      : [],
  };
}

async function selectProduct(connection, where, params) {
  const [rows] = await connection.execute(
    `SELECT ${PRODUCT_FIELDS}
     FROM products p
     LEFT JOIN product_prices pp ON pp.product_id = p.id
     WHERE ${where}
     GROUP BY p.id
     LIMIT 1`,
    params
  );

  return parseProduct(rows[0]);
}

/** @param {CreateProductInput} input */
export async function createProduct({
  name,
  description,
  imageUrl,
  imageKitFileId = null,
  imageKitFilePath = null,
  sourceUrl,
  slug,
  sku,
  status = "inStock",
  prices = [],
}) {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [result] = await connection.execute(
      `INSERT INTO products
       (
         name,
         description,
         image_url,
         imagekit_file_id,
         imagekit_file_path,
         source_url,
         slug,
         sku,
         status
       )
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        description || null,
        imageUrl,
        imageKitFileId,
        imageKitFilePath,
        sourceUrl || null,
        slug,
        sku,
        status,
      ]
    );

    for (const price of prices) {
      await connection.execute(
        `INSERT INTO product_prices
         (product_id, size, price, currency)
         VALUES (?, ?, ?, ?)`,
        [
          result.insertId,
          price.size,
          price.price,
          price.currency || "INR",
        ]
      );
    }

    await connection.commit();

    return result.insertId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function getProductById(id) {
  return selectProduct(db, "p.id = ?", [id]);
}

export async function getProductBySlug(slug) {
  return selectProduct(db, "p.slug = ?", [slug]);
}

export async function getProducts() {
  const [rows] = await db.execute(`
    SELECT ${PRODUCT_FIELDS}
    FROM products p
    LEFT JOIN product_prices pp ON pp.product_id = p.id
    GROUP BY p.id
    ORDER BY p.created_at DESC
  `);

  return rows.map(parseProduct);
}

export async function updateProduct(
  id,
  {
    name,
    description,
    imageUrl,
    imageKitFileId,
    imageKitFilePath,
    sourceUrl,
    slug,
    sku,
    status,
    prices,
  }
) {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const values = [
      name,
      description || null,
      sourceUrl || null,
      slug,
      sku,
      status,
    ];

    let sql = `
      UPDATE products
      SET
        name = ?,
        description = ?,
        source_url = ?,
        slug = ?,
        sku = ?,
        status = ?
    `;

    // Update image details only when a new image is supplied.
    if (imageUrl) {
      sql += `,
        image_url = ?,
        imagekit_file_id = ?,
        imagekit_file_path = ?
      `;

      values.push(
        imageUrl,
        imageKitFileId || null,
        imageKitFilePath || null
      );
    }

    values.push(id);

    const [result] = await connection.execute(
      `${sql} WHERE id = ?`,
      values
    );

    if (!result.affectedRows) {
      await connection.rollback();
      return false;
    }

    if (Array.isArray(prices)) {
      await connection.execute(
        "DELETE FROM product_prices WHERE product_id = ?",
        [id]
      );

      for (const price of prices) {
        await connection.execute(
          `INSERT INTO product_prices
           (product_id, size, price, currency)
           VALUES (?, ?, ?, ?)`,
          [
            id,
            price.size,
            price.price,
            price.currency || "INR",
          ]
        );
      }
    }

    await connection.commit();

    return true;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function deleteProduct(id) {
  const [result] = await db.execute(
    "DELETE FROM products WHERE id = ?",
    [id]
  );

  return result.affectedRows > 0;
}
