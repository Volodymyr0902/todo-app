import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

export default mysql
  .createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "",
    multipleStatements: true,
  }).promise();
