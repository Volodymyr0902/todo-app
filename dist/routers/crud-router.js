"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const crud_controllers_1 = require("../controllers/crud-controllers");
const auth_controllers_1 = require("../controllers/auth-controllers");
const router = express_1.default.Router();
router
    .route("/items")
    .all(auth_controllers_1.checkAutorization)
    .get(crud_controllers_1.getAllUserTodos)
    .post(crud_controllers_1.addNewTodo)
    .put(crud_controllers_1.updateTodo)
    .delete(crud_controllers_1.deleteTodo);
exports.default = router;
