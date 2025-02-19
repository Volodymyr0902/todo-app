import dotenv from "dotenv";
import {session} from "../../app-mysql";
const MySQLStore = require("express-mysql-session")(session);

dotenv.config();

const options = {
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "todos_db",
};

export default new MySQLStore(options);
