
import mysql from "mysql2/promise";

const globalForMySQL = globalThis as typeof globalThis & {
  mysqlPool?: mysql.Pool;
};

function createDatabasePool() {
  if (!process.env.DB_HOST) {
    throw new Error("DB_HOST is not configured");
  }

  if (!process.env.DB_USERNAME) {
    throw new Error("DB_USERNAME is not configured");
  }

  if (!process.env.DB_DATABASE) {
    throw new Error("DB_DATABASE is not configured");
  }

  if (!process.env.DB_PASSWORD) {
    throw new Error("DB_PASSWORD is not configured");
  }

  return mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 4000),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,

    ssl: {
      minVersion: "TLSv1.2",
    },

    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 5,
    idleTimeout: 60000,
    queueLimit: 0,

    connectTimeout: 20000,

    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
  });
}

const db =
  globalForMySQL.mysqlPool ?? createDatabasePool();

if (process.env.NODE_ENV !== "production") {
  globalForMySQL.mysqlPool = db;
}

export default db;
