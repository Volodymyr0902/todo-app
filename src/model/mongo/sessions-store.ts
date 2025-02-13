import MongoStore from "connect-mongo";
import dotenv from "dotenv"

dotenv.config()

export default MongoStore.create({
  mongoUrl: process.env.DB_URI || "mongodb://localhost:27017",
  dbName: process.env.DB_NAME || "todos_db",
  collectionName: process.env.SESSIONS_COLLECTION || "sessions"
})