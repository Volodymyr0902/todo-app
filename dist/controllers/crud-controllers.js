"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTodo = exports.updateTodo = exports.addNewTodo = exports.getAllUserTodos = void 0;
const mongodb_1 = require("mongodb");
const db_1 = require("../model/mongo/db");
const dbName = "todos_db";
const collectionName = "todos_items";
const todosCollection = db_1.client.db(dbName).collection(collectionName);
const getAllUserTodos = (req, res) => {
    todosCollection
        .find({ userID: req.session.userID })
        .toArray()
        .then((items) => {
        res.json({ items: items });
    })
        .catch((err) => {
        console.error(`Failed to get items: ${err}`);
        res.sendStatus(500);
    });
};
exports.getAllUserTodos = getAllUserTodos;
const addNewTodo = (req, res) => {
    const newItem = {
        text: req.body.text,
        checked: false,
        userID: req.session.userID,
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
};
exports.addNewTodo = addNewTodo;
const updateTodo = (req, res) => {
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
};
exports.updateTodo = updateTodo;
const deleteTodo = (req, res) => {
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
};
exports.deleteTodo = deleteTodo;
