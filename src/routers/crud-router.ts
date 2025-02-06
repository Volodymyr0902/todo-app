import express from "express";
import { getAllUserTodos, addNewTodo, updateTodo, deleteTodo } from "../controllers/crud-controllers";
import { checkAutorization } from "../controllers/auth-controllers";

const router = express.Router();

router
  .route("/items")
  .all(checkAutorization) 
  .get(getAllUserTodos)
  .post(addNewTodo)
  .put(updateTodo)
  .delete(deleteTodo);

export default router;
