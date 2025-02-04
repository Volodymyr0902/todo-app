import express from "express";
import bodyParser from "body-parser";
import router from "./routers/router";
import { getDb } from "./db/mongo/db";

const port = 8080;
const hostname = "localhost";

const app = express();

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(bodyParser.json());
app.use("/api/v1", router);

app.get("/", (req, res) => {
  res.render("index");
});

getDb()
  .then(() => {
    app.listen(port, hostname, (err) => {
      if (err) {
        console.error(`Failed to start server: ${err}`);
      }
      console.log(`Server started on ${hostname} on port ${port}...`);
    });
  })
  .catch((err) => {
    console.error(`Failed to connect to DB: ${err}`);
  });
