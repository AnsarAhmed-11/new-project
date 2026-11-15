import mysql from "mysql2/promise";

// const db = mysql.createPool({
//   host: process.env.DB_HOST || "127.0.0.1",
//   port: Number(process.env.DB_PORT || 3306),
//   user: process.env.DB_USER || process.env.DB_USERNAME || "root",
//   password: process.env.DB_PASSWORD || "",
//   database: process.env.DB_DATABASE || "merciful_tools",
//   waitForConnections: true,
//   connectionLimit: 10,
// });
const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 4000),
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD || "merciful_tools",
  database: process.env.DB_DATABASE,

  ssl: {
    minVersion: "TLSv1.2",
  },

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default db;
