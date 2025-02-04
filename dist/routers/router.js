"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("../db/mongo/db");
const mongodb_1 = require("mongodb");
const router = express_1.default.Router();
const dbName = "todos_db";
const collectionName = "todos_items";
const todosCollection = db_1.client.db(dbName).collection(collectionName);
router
    .route("/items")
    .get((req, res) => {
    todosCollection
        .find()
        .toArray()
        .then((items) => {
        res.json({ items: items });
    })
        .catch((err) => {
        console.error(`Failed to get items: ${err}`);
        res.sendStatus(500);
    });
})
    .post((req, res) => {
    const newItem = {
        text: req.body.text,
        checked: false,
    };
    todosCollection
        .insertOne(newItem)
        .then((result) => {
        if (result.acknowledged) {
            res.json({ _id: result.insertedId });
        }
        else {
            res.sendStatus(500);
        }
    })
        .catch((err) => {
        console.error(`Failed to insert new item: ${err}`);
        res.sendStatus(500);
    });
})
    .put((req, res) => {
    const upd = req.body;
    if (!mongodb_1.ObjectId.isValid(upd._id)) {
        res.status(400).json({ err: "Id is invalid" });
        return;
    }
    todosCollection
        .updateOne({ _id: new mongodb_1.ObjectId(upd._id) }, { $set: { text: upd.text, checked: upd.checked } })
        .then((result) => {
        if (result.modifiedCount === 1) {
            res.json({ ok: true });
        }
        else {
            res.status(404).json({ err: "Item with queried id doesn't exist" });
        }
    })
        .catch((err) => {
        console.error(`Failed to update item: ${err}`);
        res.sendStatus(500);
    });
})
    .delete((req, res) => {
    const _id = req.body._id;
    if (!mongodb_1.ObjectId.isValid(_id)) {
        res.status(400).json({ err: "Id is invalid" });
        return;
    }
    todosCollection
        .deleteOne({ _id: new mongodb_1.ObjectId(_id) })
        .then((result) => {
        if (result.deletedCount === 1) {
            res.json({ ok: true });
        }
        else {
            res.status(404).json({ err: "Item with queried id doesn't exist" });
        }
    })
        .catch((err) => {
        console.error(`Failed to delete item: ${err}`);
        res.sendStatus(500);
    });
});
exports.default = router;
