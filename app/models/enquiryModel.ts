import type { ResultSetHeader, RowDataPacket } from "mysql2";
import db from "@/app/lib/db";

export const ENQUIRY_STATUSES = [
  "new",
  "contacted",
  "in_progress",
  "completed",
  "cancelled",
] as const;
export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number];

export type Enquiry = {
  id: number;
  productId: number | null;
  name: string;
  company: string | null;
  email: string;
  phone: string;
  product: string;
  message: string;
  status: EnquiryStatus;
  createdAt: string;
  updatedAt: string;
};
type EnquiryRow = RowDataPacket & {
  id: number;
  name: string;
  company: string | null;
  email: string;
  phone: string;
  product_id: number | null;
  product_name: string | null;
  message: string;
  status: EnquiryStatus;
  created_at: Date;
  updated_at: Date;
};

function map(row: EnquiryRow): Enquiry {
  return {
    id: row.id,
    name: row.name,
    company: row.company,
    email: row.email,
    phone: row.phone,
    productId: row.product_id,
    product: row.product_name || "General enquiry",
    message: row.message,
    status: row.status,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

export async function createEnquiry(input: {
  name: string;
  company?: string;
  email: string;
  phone: string;
  productId?: number | null;
  message: string;
}) {
  const [result] = await db.execute<ResultSetHeader>(
    "INSERT INTO enquiries (product_id, name, company, email, phone, message) VALUES (?, ?, ?, ?, ?, ?)",
    [
      input.productId || null,
      input.name,
      input.company || null,
      input.email,
      input.phone,
      input.message,
    ],
  );
  return result.insertId;
}

export async function listEnquiries(
  filters: {
    search?: string;
    status?: string;
    date?: string;
    sort?: string;
    page?: number;
    limit?: number;
  } = {},
) {
  const page = Math.max(1, filters.page || 1);
  const limit = Math.min(100, Math.max(1, filters.limit || 10));
  const params: (string | number)[] = [];
  const where: string[] = [];
  if (filters.search) {
    where.push(
      "(e.name LIKE ? OR e.email LIKE ? OR e.phone LIKE ? OR p.name LIKE ?)",
    );
    const term = `%${filters.search}%`;
    params.push(term, term, term, term);
  }
  if (
    filters.status &&
    ENQUIRY_STATUSES.includes(filters.status as EnquiryStatus)
  ) {
    where.push("e.status = ?");
    params.push(filters.status);
  }
  if (filters.date && /^\d{4}-\d{2}-\d{2}$/.test(filters.date)) {
    where.push("DATE(e.created_at) = ?");
    params.push(filters.date);
  }
  const clause = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const order = filters.sort === "oldest" ? "ASC" : "DESC";
  const offset = (page - 1) * limit;
  const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 100);

  const safeOffset = Math.max(Number(offset) || 0, 0);
  const [countRows] = await db.execute<(RowDataPacket & { total: number })[]>(
    `SELECT COUNT(*) AS total FROM enquiries e LEFT JOIN products p ON p.id = e.product_id ${clause}`,
    params,
  );
  const [rows] = await db.execute<EnquiryRow[]>(
    `SELECT e.*, p.name AS product_name
   FROM enquiries e
   LEFT JOIN products p ON p.id = e.product_id
   ${clause}
   ORDER BY e.created_at ${order}
   LIMIT ${safeLimit} OFFSET ${safeOffset}`,
    params,
  );
  return {
    data: rows.map(map),
    total: Number(countRows[0]?.total || 0),
    page,
    limit,
    totalPages: Math.ceil(Number(countRows[0]?.total || 0) / limit),
  };
}

export async function getEnquiry(id: number) {
  const [rows] = await db.execute<EnquiryRow[]>(
    "SELECT e.*, p.name AS product_name FROM enquiries e LEFT JOIN products p ON p.id = e.product_id WHERE e.id = ? LIMIT 1",
    [id],
  );
  return rows[0] ? map(rows[0]) : null;
}
export async function updateEnquiryStatus(id: number, status: EnquiryStatus) {
  const [result] = await db.execute<ResultSetHeader>(
    "UPDATE enquiries SET status = ? WHERE id = ?",
    [status, id],
  );
  return result.affectedRows > 0;
}
export async function deleteEnquiry(id: number) {
  const [result] = await db.execute<ResultSetHeader>(
    "DELETE FROM enquiries WHERE id = ?",
    [id],
  );
  return result.affectedRows > 0;
}
export async function getEnquiryStats() {
  const [rows] = await db.execute<
    (RowDataPacket & { status: EnquiryStatus; total: number })[]
  >("SELECT status, COUNT(*) AS total FROM enquiries GROUP BY status");
  const stats = Object.fromEntries(
    ENQUIRY_STATUSES.map((status) => [status, 0]),
  ) as Record<EnquiryStatus, number>;
  rows.forEach((row) => {
    stats[row.status] = Number(row.total);
  });
  return {
    total: Object.values(stats).reduce((sum, value) => sum + value, 0),
    ...stats,
  };
}
