import express from "express";
import {
  checkAutorization,
  login,
  logout,
  register,
} from "../controllers/auth-controllers";
import {
  addNewTodo,
  deleteTodo,
  getAllUserTodos,
  updateTodo,
} from "../controllers/crud-controllers";
import { ErrorMessages } from "../controllers/error-messages";

const router = express.Router();

router.all("/router", checkAutorization, (req, res) => {
  const { action } = req.query;

  switch (action) {
    case "login":
      login(req, res);
      break;
    case "logout":
      logout(req, res);
      break;
    case "register":
      register(req, res);
      break;
    case "getItems":
      getAllUserTodos(req, res);
      break;
    case "createItem":
      addNewTodo(req, res);
      break;
    case "editItem":
      updateTodo(req, res);
      break;
    case "deleteItem":
      deleteTodo(req, res);
      break;
    default:
      res.status(404).json({ error: ErrorMessages.NOT_FOUND });
  }
});

export default router;
