import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { ISingleTodo } from "../model/mongo/interfaces";
import { client } from "../model/mongo/db";

const dbName = "todos_db";
const collectionName = "todos_items";
const todosCollection = client.db(dbName).collection(collectionName);

export const getAllUserTodos = (req: Request, res: Response) => {
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

export const addNewTodo = (req: Request, res: Response) => {
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
        res.sendStatus(500);
      }
    })
    .catch((err) => {
      console.error(`Failed to insert new item: ${err}`);
      res.sendStatus(500);
    });
};

export const updateTodo = (req: Request, res: Response) => {
  const upd: ISingleTodo = req.body;

  if (!ObjectId.isValid(upd._id)) {
    res.status(400).json({ err: "Id is invalid" });
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
        res.status(404).json({ err: "Item with queried id doesn't exist" });
      }
    })
    .catch((err) => {
      console.error(`Failed to update item: ${err}`);
      res.sendStatus(500);
    });
};

export const deleteTodo = (req: Request, res: Response) => {
  const _id = req.body._id;
  if (!ObjectId.isValid(_id)) {
    res.status(400).json({ err: "Id is invalid" });
    return;
  }

  todosCollection
    .deleteOne({ _id: new ObjectId(_id) })
    .then((result) => {
      if (result.deletedCount === 1) {
        res.json({ ok: true });
      } else {
        res.status(404).json({ err: "Item with queried id doesn't exist" });
      }
    })
    .catch((err) => {
      console.error(`Failed to delete item: ${err}`);
      res.sendStatus(500);
    });
};
