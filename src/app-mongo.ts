import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import sessionsStore from "./model/mongo/sessions-store";
import crudRouter from "./routers/crud-router";
import authRouter from "./routers/auth-router";
import { getDb } from "./model/mongo/db";
import { errorHandler } from "./controllers/error-handler";
import { ErrorMessages } from "./controllers/error-messages";

const port = 8080;
const hostname = "localhost";

const app = express();

// Set the view engine
app.set("view engine", "ejs");

// Serve static files
app.use(express.static("public"));

// Apply parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session settings
app.use(
  session({
    name: "sid",
    secret: "super-secret-key",
    resave: false,
    saveUninitialized: false,
    store: sessionsStore,
    cookie: {
      maxAge: 1000 * 60 * 60, // 1 hour
      sameSite: "lax",
      httpOnly: true,
      secure: false,
    }
  })
);

// Apply routers
app.use("/api/v1", crudRouter, authRouter);

// Render the main page
app.get("/", (req, res) => {
  try {
    res.render("index");
  } catch (err) {
    console.error(`${ErrorMessages.INDEX_RENDER}: ${err}`);
    res.status(500).json({ error: ErrorMessages.INDEX_RENDER });
  }
});

app.use(errorHandler)

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
