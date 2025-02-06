import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { client } from "../model/mongo/db";
import { IUser } from "../model/mongo/interfaces";

const sessionName = "sid";
const dbName = "todos_db";
const collectionName = "users";
const usersCollection = client.db(dbName).collection(collectionName);

export const checkAutorization = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session.userID) {
    res.status(302).json({ error: "forbidden" });
    return;
  }
  next();
};

export const login = async (req: Request, res: Response) => {
  const { login, pass } = req.body;

  const user = await usersCollection.findOne({ login });

  if (!user) {
    res.status(404).json({ error: "not found" });
    return;
  }

  const isMatch = await bcrypt.compare(pass, user.pass);

  if (!isMatch) {
    res.status(404).json({ error: "not found" });
    return;
  }

  // In case app gets ext with public resources in future
  // regenerate to avoid session fixation (saveUninit then must be set to true)
  req.session.regenerate((err) => {
    if (err) {
      console.error(`Failed to regenerate session: ${err}`);
      res.status(500).json({ ok: false });
      return;
    }
  });
  req.session.userID = user._id.toString();

  res.json({ ok: true });
}

export const logout = (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(`Failed to destroy session: ${err}`);
      res.status(500).json({ ok: false });
    }
  });

  res.clearCookie(sessionName).json({ ok: true });
}

export const register = async (req: Request, res: Response) => {
  const { login, pass } = req.body;

  const user = await usersCollection.findOne({ login });

  if (user) {
    res.status(404).json({ ok: false });
    return;
  }

  const newUser: IUser = {
    login,
    pass: await bcrypt.hash(pass, 10),
  };

  const registartionResult = await usersCollection.insertOne(newUser)

  if (!registartionResult.acknowledged) {
    res.status(500).json({ ok: false });
    return;
  }

  res.json({ ok: true });
}