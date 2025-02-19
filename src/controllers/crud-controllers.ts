import { Request, Response } from "express";
import { ITodoUpd } from "../model/mysql/interfaces";
import connection from "../model/mysql/connection";
import { ErrorMessages } from "./error-messages";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export const getAllUserTodos = async (req: Request, res: Response) => {
  try {
    const selSQL = "SELECT * FROM todos WHERE userID = ?";
    let [rows] = await connection.execute<RowDataPacket[]>(selSQL, [
      req.session.userID,
    ]);
    rows = rows.map((el) => {
      el.checked = Boolean(el.checked);
      return el;
    });

    res.json({ items: rows });
  } catch (err) {
    console.error(`${ErrorMessages.DB_INTERNAL}: ${err}`);
    res.status(500).json({ error: ErrorMessages.DB_INTERNAL });
  }
};

export const addNewTodo = async (req: Request, res: Response) => {
  try {
    if (!req.body.text) {
      res.status(400).json({ error: ErrorMessages.INVALID_INPUT });
      return;
    }

    const newItem = {
      text: req.body.text,
      userID: req.session.userID,
    };

    const insSQL = "INSERT INTO todos (text, userID) VALUES (?, ?)";
    const [result] = await connection.execute<ResultSetHeader>(insSQL, [
      newItem.text,
      newItem.userID,
    ]);

    if (result.insertId) {
      res.json({ _id: result.insertId });
    } else {
      throw new Error();
    }
  } catch (err) {
    console.error(`${ErrorMessages.INSERTION_FAILED}: ${err}`);
    res.status(500).json({ error: ErrorMessages.INSERTION_FAILED });
  }
};

export const updateTodo = async (req: Request, res: Response) => {
  try {
    const upd: ITodoUpd = req.body;
    upd.checked = Boolean(upd.checked);

    if (!isUpdValid(upd)) {
      res.status(400).json({ error: ErrorMessages.INVALID_INPUT });
      return;
    }

    const updSQL = "UPDATE todos SET text = ?, checked = ? WHERE _id = ?";
    const [result] = await connection.execute<ResultSetHeader>(updSQL, [
      upd.text,
      upd.checked,
      upd._id,
    ]);

    if (result.affectedRows === 1) {
      res.json({ ok: true });
    } else {
      res.status(404).json({ err: ErrorMessages.NO_MATCH });
    }
  } catch (err) {
    console.error(`${ErrorMessages.UPDATING_FAILED}: ${err}`);
    res.status(500).json({ error: ErrorMessages.UPDATING_FAILED });
  }
};

export const deleteTodo = async (req: Request, res: Response) => {
  try {
    const _id = req.body._id;
    const delSQL = "DELETE FROM todos WHERE _id = ?";
    const [result] = await connection.execute<ResultSetHeader>(delSQL, [_id]);

    if (result.affectedRows === 1) {
      res.json({ ok: true });
    } else {
      res.status(404).json({ err: ErrorMessages.NO_MATCH });
    }
  } catch (err) {
    console.error(`${ErrorMessages.DELETION_FAILED} ${err}`);
    res.status(500).json({ error: ErrorMessages.DELETION_FAILED });
  }
};

const isUpdValid = (upd: any): upd is ITodoUpd => {
  return upd._id && upd.text && typeof upd.checked === "boolean";
};
