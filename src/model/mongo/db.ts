import { MongoClient } from "mongodb";

const dbURI = process.env.dbURI || "mongodb://localhost:27017";

const client = new MongoClient(dbURI);

const getDb = async () => {
  await client.connect();
  return client.db();
};

export { client, getDb };
