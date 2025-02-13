"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controllers_1 = require("../controllers/auth-controllers");
const crud_controllers_1 = require("../controllers/crud-controllers");
const error_messages_1 = require("../controllers/error-messages");
const router = express_1.default.Router();
router.all("/router", auth_controllers_1.checkAutorization, (req, res) => {
    const { action } = req.query;
    switch (action) {
        case "login":
            (0, auth_controllers_1.login)(req, res);
            break;
        case "logout":
            (0, auth_controllers_1.logout)(req, res);
            break;
        case "register":
            (0, auth_controllers_1.register)(req, res);
            break;
        case "getItems":
            (0, crud_controllers_1.getAllUserTodos)(req, res);
            break;
        case "createItem":
            (0, crud_controllers_1.addNewTodo)(req, res);
            break;
        case "editItem":
            (0, crud_controllers_1.updateTodo)(req, res);
            break;
        case "deleteItem":
            (0, crud_controllers_1.deleteTodo)(req, res);
            break;
        default:
            res.status(404).json({ error: error_messages_1.ErrorMessages.NOT_FOUND });
    }
});
exports.default = router;
