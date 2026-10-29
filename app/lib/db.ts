import mysql, { type Pool } from "mysql2/promise";

const globalForDb = globalThis as typeof globalThis & {
  mysqlPool?: Pool;
};

export const db = globalForDb.mysqlPool ?? mysql.createPool({
  host: process.env.MYSQL_HOST ?? "127.0.0.1",
  port: Number(process.env.MYSQL_PORT ?? 3306),
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

if (process.env.NODE_ENV !== "production") {
  globalForDb.mysqlPool = db;
}
