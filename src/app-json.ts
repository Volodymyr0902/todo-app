import express from "express";
import bodyParser from "body-parser";
import fs from "fs/promises";
import path from "path";
import { Document, LocalDB } from "./model/primitive/db-interfaces";

const port = process.env.port || 8080;
const hostname = process.env.hostname || "localhost";
const jsonDbPath = path.join(__dirname, "db", "primitive", "db.json");

// DEPRECATE: app DB.
// const db: Document[] = [];
// let idCounter: number = 1;

const app = express();

// Set views
app.set("view engine", "ejs");

// Serve statics
app.use(express.static("public"));

// Apply body parser for POST
app.use(bodyParser.json());

// Routes
app.get("/", (req, res) => {
  res.render("index");
});

// DEPRECATE: uses app memory as DB.
// app
//   .route("/api/v1/items")
//   .get((req, res) => {
//     const items = { items: db };
//     console.log(items);
//     res.json(items);
//   })
//   .post((req, res) => {
//     const newItem: Document = {
//       id: idCounter,
//       text: req.body.text,
//       checked: false,
//     };
//     const response = { id: idCounter++ };

//     db.push(newItem);
//     res.json(response);
//   })
//   .put((req, res) => {
//     const updates: Document = req.body;

//     const indexOfId = db.findIndex((el) => el.id === updates.id);
//     db.splice(indexOfId, 1, updates);

//     res.json({ ok: true });
//   })
//   .delete((req, res) => {
//     const id: number = req.body.id;
//     const indexOfId = db.findIndex((el) => el.id === id);

//     if (indexOfId > -1) {
//       db.splice(indexOfId, 1);
//       res.json({ ok: true });
//     } else {
//       res.status(400).json({ ok: false });
//     }
//   });

// DEPRECATE: uses JSON file as DB.
app
  .route("/api/v1/items")
  .get((req, res) => {
    readDB(jsonDbPath).then((data) => {
      const items = JSON.parse(data).items;
      res.json({ items: items });
    });
  })
  .post((req, res) => {
    readDB(jsonDbPath)
      .then((data) => {
        const db = JSON.parse(data);
        const newItem: Document = {
          id: db.idCounter++,
          text: req.body.text,
          checked: false,
        };
        db.items.push(newItem);

        writeDB(jsonDbPath, JSON.stringify(db, null, 2))
          .then(() => {
            res.json({ id: db.idCounter });
          })
          .catch((err) => {
            console.error(`Failed to write DB: ${err}`);
            res.sendStatus(500);
          });
      })
      .catch((err) => {
        console.error(`Failed to read DB: ${err}`);
        res.sendStatus(500);
      });
  })
  .put((req, res) => {
    const updates: Document = req.body;

    readDB(jsonDbPath)
      .then((data) => {
        const db: LocalDB = JSON.parse(data);

        const indexOfId = db.items.findIndex((el) => el.id === updates.id);
        if (indexOfId === -1) res.sendStatus(400);
        db.items[indexOfId] = updates;

        writeDB(jsonDbPath, JSON.stringify(db, null, 2))
          .then(() => {
            res.json({ ok: true });
          })
          .catch((err) => {
            console.error(`Failed to update item: ${err}`);
            res.sendStatus(500);
          });
      })
      .catch((err) => {
        console.error(`Failed to read DB: ${err}`);
        res.sendStatus(500);
      });
  })
  .delete((req, res) => {
    const id = req.body.id;

    readDB(jsonDbPath)
      .then((data) => {
        const db: LocalDB = JSON.parse(data);

        const indexOfId = db.items.findIndex((el) => el.id === id);
        if (indexOfId === -1) res.sendStatus(400);
        db.items.splice(indexOfId, 1);

        writeDB(jsonDbPath, JSON.stringify(db, null, 2))
          .then(() => {
            res.json({ ok: true });
          })
          .catch((err) => {
            console.error(`Failed to delete item: ${err}`);
            res.sendStatus(500);
          });
      })
      .catch((err) => {
        console.error(`Failed to read DB: ${err}`);
        res.sendStatus(500);
      });
  });

async function readDB(path: string) {
  return await fs.readFile(path, { encoding: "utf8" });
}

async function writeDB(path: string, data: string) {
  return await fs.writeFile(path, data);
}

// Start server
app.listen(+port, hostname, (err) => {
  if (err) {
    console.error(`Failed to start server: ${err}`);
  }

  console.log(`Server started on ${hostname} on port ${port}...`);
});
