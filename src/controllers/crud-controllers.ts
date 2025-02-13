import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { ITodoUpd } from "../model/mongo/interfaces";
import { client } from "../model/mongo/db";
import { ErrorMessages } from "./error-messages";

const dbName = process.env.DB_NAME || "todos_db";
const collectionName = process.env.TODOS_COLLECTION || "todos_items";
const todosCollection = client.db(dbName).collection(collectionName);

export const getAllUserTodos = (req: Request, res: Response) => {
  todosCollection
    .find({ userID: req.session.userID })
    .toArray()
    .then((items) => {
      res.json({ items: items });
    })
    .catch((err) => {
      console.error(`${ErrorMessages.DB_INTERNAL}: ${err}`);
      res.status(500).json({ error: ErrorMessages.DB_INTERNAL });
    });
};

export const addNewTodo = (req: Request, res: Response) => {
  if (!req.body.text) {
    res.status(400).json({ error: ErrorMessages.INVALID_INPUT });
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
      } else {
        throw new Error();
      }
    })
    .catch((err) => {
      console.error(`${ErrorMessages.INSERTION_FAILED}: ${err}`);
      res.status(500).json({ error: ErrorMessages.INSERTION_FAILED });
    });
};

export const updateTodo = (req: Request, res: Response) => {
  const upd: ITodoUpd = req.body;

  if (!isUpdValid(upd)) {
    res.status(400).json({ error: ErrorMessages.INVALID_INPUT });
    return;
  }

  todosCollection
    .updateOne(
      { _id: new ObjectId(upd._id) },
      { $set: { text: upd.text, checked: upd.checked } }
    )
    .then((result) => {
      if (result.modifiedCount === 1) {
        res.json({ ok: true });
      } else {
        res.status(404).json({ err: ErrorMessages.NO_MATCH });
      }
    })
    .catch((err) => {
      console.error(`${ErrorMessages.UPDATING_FAILED}: ${err}`);
      res.status(500).json({ error: ErrorMessages.UPDATING_FAILED });
    });
};

export const deleteTodo = (req: Request, res: Response) => {
  const _id = req.body._id;

  if (!ObjectId.isValid(_id)) {
    res.status(400).json({ err: ErrorMessages.INVALID_ID });
    return;
  }

  todosCollection
    .deleteOne({ _id: new ObjectId(_id) })
    .then((result) => {
      if (result.deletedCount === 1) {
        res.json({ ok: true });
      } else {
        res.status(404).json({ err: ErrorMessages.NO_MATCH });
      }
    })
    .catch((err) => {
      console.error(`${ErrorMessages.DELETION_FAILED} ${err}`);
      res.status(500).json({ error: ErrorMessages.DELETION_FAILED });
    });
};

const isUpdValid = (upd: any): upd is ITodoUpd => {
  return (
    upd._id &&
    ObjectId.isValid(upd._id) &&
    upd.text &&
    typeof upd.checked === "boolean"
  );
};
