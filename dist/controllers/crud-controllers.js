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
exports.deleteTodo = exports.updateTodo = exports.addNewTodo = exports.getAllUserTodos = void 0;
const connection_1 = __importDefault(require("../model/mysql/connection"));
const error_messages_1 = require("./error-messages");
const getAllUserTodos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const selSQL = "SELECT * FROM todos WHERE userID = ?";
        let [rows] = yield connection_1.default.execute(selSQL, [
            req.session.userID,
        ]);
        rows = rows.map((el) => {
            el.checked = Boolean(el.checked);
            return el;
        });
        res.json({ items: rows });
    }
    catch (err) {
        console.error(`${error_messages_1.ErrorMessages.DB_INTERNAL}: ${err}`);
        res.status(500).json({ error: error_messages_1.ErrorMessages.DB_INTERNAL });
    }
});
exports.getAllUserTodos = getAllUserTodos;
const addNewTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body.text) {
            res.status(400).json({ error: error_messages_1.ErrorMessages.INVALID_INPUT });
            return;
        }
        const newItem = {
            text: req.body.text,
            userID: req.session.userID,
        };
        const insSQL = "INSERT INTO todos (text, userID) VALUES (?, ?)";
        const [result] = yield connection_1.default.execute(insSQL, [
            newItem.text,
            newItem.userID,
        ]);
        if (result.insertId) {
            res.json({ _id: result.insertId });
        }
        else {
            throw new Error();
        }
    }
    catch (err) {
        console.error(`${error_messages_1.ErrorMessages.INSERTION_FAILED}: ${err}`);
        res.status(500).json({ error: error_messages_1.ErrorMessages.INSERTION_FAILED });
    }
});
exports.addNewTodo = addNewTodo;
const updateTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const upd = req.body;
        upd.checked = Boolean(upd.checked);
        if (!isUpdValid(upd)) {
            res.status(400).json({ error: error_messages_1.ErrorMessages.INVALID_INPUT });
            return;
        }
        const updSQL = "UPDATE todos SET text = ?, checked = ? WHERE _id = ?";
        const [result] = yield connection_1.default.execute(updSQL, [
            upd.text,
            upd.checked,
            upd._id,
        ]);
        if (result.affectedRows === 1) {
            res.json({ ok: true });
        }
        else {
            res.status(404).json({ err: error_messages_1.ErrorMessages.NO_MATCH });
        }
    }
    catch (err) {
        console.error(`${error_messages_1.ErrorMessages.UPDATING_FAILED}: ${err}`);
        res.status(500).json({ error: error_messages_1.ErrorMessages.UPDATING_FAILED });
    }
});
exports.updateTodo = updateTodo;
const deleteTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _id = req.body._id;
        const delSQL = "DELETE FROM todos WHERE _id = ?";
        const [result] = yield connection_1.default.execute(delSQL, [_id]);
        if (result.affectedRows === 1) {
            res.json({ ok: true });
        }
        else {
            res.status(404).json({ err: error_messages_1.ErrorMessages.NO_MATCH });
        }
    }
    catch (err) {
        console.error(`${error_messages_1.ErrorMessages.DELETION_FAILED} ${err}`);
        res.status(500).json({ error: error_messages_1.ErrorMessages.DELETION_FAILED });
    }
});
exports.deleteTodo = deleteTodo;
const isUpdValid = (upd) => {
    return upd._id && upd.text && typeof upd.checked === "boolean";
};
