"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const port = process.env.port || 8080;
const hostname = process.env.hostname || "localhost";
const jsonDbPath = path_1.default.join(__dirname, "db", "primitive", "db.json");
// DEPRECATE: app DB.
// const db: Document[] = [];
// let idCounter: number = 1;
const app = (0, express_1.default)();
// Set views
app.set("view engine", "ejs");
// Serve statics
app.use(express_1.default.static("public"));
// Apply body parser for POST
app.use(body_parser_1.default.json());
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
        const newItem = {
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
    const updates = req.body;
    readDB(jsonDbPath)
        .then((data) => {
        const db = JSON.parse(data);
        const indexOfId = db.items.findIndex((el) => el.id === updates.id);
        if (indexOfId === -1)
            res.sendStatus(400);
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
        const db = JSON.parse(data);
        const indexOfId = db.items.findIndex((el) => el.id === id);
        if (indexOfId === -1)
            res.sendStatus(400);
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
function readDB(path) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield promises_1.default.readFile(path, { encoding: "utf8" });
    });
}
function writeDB(path, data) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield promises_1.default.writeFile(path, data);
    });
}
// Start server
app.listen(hostname, (err) => {
    if (err) {
        console.error(`Failed to start server: ${err}`);
    }
    console.log(`Server started on ${hostname} on port ${port}...`);
});
