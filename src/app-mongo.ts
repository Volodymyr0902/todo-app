import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import cors from "cors";
import dotenv from "dotenv";
import sessionsStore from "./model/mongo/sessions-store";
import crudRouter from "./routers/crud-router";
import authRouter from "./routers/auth-router";
import uniRouter from "./routers/uni-router";
import { getDb } from "./model/mongo/db";
import { errorHandler } from "./controllers/error-handler";
import { ErrorMessages } from "./controllers/error-messages";

dotenv.config();

const port = process.env.PORT ? parseInt(process.env.PORT) : 8080;
const hostname = process.env.HOST || "localhost";

const app = express();

app.set("view engine", "ejs");

app.use(
  cors({
    origin: process.env.CLIENT || 'http://localhost:5500',
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    exposedHeaders: ["Set-Cookie"]
  })
);

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    name: process.env.SESSION_NAME || "sid",
    secret: process.env.SESSION_SECRET || "super-secret-key",
    resave: false,
    saveUninitialized: false,
    store: sessionsStore,
    cookie: {
      maxAge: 1000 * 60 * 60, // 1 hour
      // sameSite: "lax",
      sameSite: "none",
      httpOnly: true,
      // secure: false,
      secure: true,
    },
  })
);

app.use("/api/v1", crudRouter, authRouter); // divided
app.use("/api/v2", uniRouter); // using query string

// Render the main page
app.get("/", (req, res) => {
  try {
    res.render("index");
  } catch (err) {
    console.error(`${ErrorMessages.INDEX_RENDER}: ${err}`);
    res.status(500).json({ error: ErrorMessages.INDEX_RENDER });
  }
});

app.use(errorHandler);

// Connect to the DB and start the server
getDb()
  .then(() => {
    app.listen(port, hostname, (err) => {
      if (err) {
        console.error(`${ErrorMessages.SERVER_START}: ${err}`);
      }
      console.log(`Server started on ${hostname} on port ${port}...`);
    });
  })
  .catch((err) => {
    console.error(`${ErrorMessages.DB_CONN}: ${err}`);
  });
