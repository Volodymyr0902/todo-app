import { MongoClient } from "mongodb";
import dotenv from "dotenv"

dotenv.config()

const dbURI = process.env.DB_URI || "mongodb://localhost:27017";

const client = new MongoClient(dbURI);

const getDb = async () => {
  await client.connect();
  return client.db();
};

export { client, getDb };
