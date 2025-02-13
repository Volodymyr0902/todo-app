"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTodo = exports.updateTodo = exports.addNewTodo = exports.getAllUserTodos = void 0;
const mongodb_1 = require("mongodb");
const db_1 = require("../model/mongo/db");
const error_messages_1 = require("./error-messages");
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
        console.error(`${error_messages_1.ErrorMessages.DB_INTERNAL}: ${err}`);
        res.status(500).json({ error: error_messages_1.ErrorMessages.DB_INTERNAL });
    });
};
exports.getAllUserTodos = getAllUserTodos;
const addNewTodo = (req, res) => {
    if (!req.body.text) {
        res.status(400).json({ error: error_messages_1.ErrorMessages.INVALID_INPUT });
        return;
    }
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
            throw new Error();
        }
    })
        .catch((err) => {
        console.error(`${error_messages_1.ErrorMessages.INSERTION_FAILED}: ${err}`);
        res.status(500).json({ error: error_messages_1.ErrorMessages.INSERTION_FAILED });
    });
};
exports.addNewTodo = addNewTodo;
const updateTodo = (req, res) => {
    const upd = req.body;
    if (!isUpdValid(upd)) {
        res.status(400).json({ error: error_messages_1.ErrorMessages.INVALID_INPUT });
        return;
    }
    todosCollection
        .updateOne({ _id: new mongodb_1.ObjectId(upd._id) }, { $set: { text: upd.text, checked: upd.checked } })
        .then((result) => {
        if (result.modifiedCount === 1) {
            res.json({ ok: true });
        }
        else {
            res.status(404).json({ err: error_messages_1.ErrorMessages.NO_MATCH });
        }
    })
        .catch((err) => {
        console.error(`${error_messages_1.ErrorMessages.UPDATING_FAILED}: ${err}`);
        res.status(500).json({ error: error_messages_1.ErrorMessages.UPDATING_FAILED });
    });
};
exports.updateTodo = updateTodo;
const deleteTodo = (req, res) => {
    const _id = req.body._id;
    if (!mongodb_1.ObjectId.isValid(_id)) {
        res.status(400).json({ err: error_messages_1.ErrorMessages.INVALID_ID });
        return;
    }
    todosCollection
        .deleteOne({ _id: new mongodb_1.ObjectId(_id) })
        .then((result) => {
        if (result.deletedCount === 1) {
            res.json({ ok: true });
        }
        else {
            res.status(404).json({ err: error_messages_1.ErrorMessages.NO_MATCH });
        }
    })
        .catch((err) => {
        console.error(`${error_messages_1.ErrorMessages.DELETION_FAILED} ${err}`);
        res.status(500).json({ error: error_messages_1.ErrorMessages.DELETION_FAILED });
    });
};
exports.deleteTodo = deleteTodo;
const isUpdValid = (upd) => {
    return (upd._id &&
        mongodb_1.ObjectId.isValid(upd._id) &&
        upd.text &&
        typeof upd.checked === "boolean");
};
