import MongoStore from "connect-mongo";

export default MongoStore.create({
  mongoUrl: "mongodb://localhost:27017",
  dbName: "todos_db",
  collectionName: "sessions"
})