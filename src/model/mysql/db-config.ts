import connection from "./connection"
import fs from "fs/promises"
import path from 'path'

export const configDB = async () => {
  const sqlPath = path.resolve(__dirname, "../../../queries/config.sql");
  const sql = await fs.readFile(sqlPath, { encoding: "utf8" });
  await connection.query(sql)
}

