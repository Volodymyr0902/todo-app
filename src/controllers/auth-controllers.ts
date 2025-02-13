import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { client } from "../model/mongo/db";
import { IUser } from "../model/mongo/interfaces";
import { ErrorMessages } from "./error-messages";

dotenv.config();

const sessionName = process.env.SESSION_NAME || "sid";
const dbName = process.env.DB_NAME || "todos_db";
const collectionName = process.env.USERS_COLLECTION || "users";
const usersCollection = client.db(dbName).collection(collectionName);

export const checkAutorization = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { action } = req.query;

  if (!req.session.userID && action !== "login" && action !== "register") {
    res.status(302).json({ error: ErrorMessages.FORBIDDEN });
    return;
  }
  next();
};

export const login = async (req: Request, res: Response) => {
  const { login, pass } = req.body;

  const user = await usersCollection.findOne({ login });

  if (!user) {
    res.status(404).json({ error: ErrorMessages.BAD_CREDENTIALS });
    return;
  }

  const isMatch = await bcrypt.compare(pass, user.pass);

  if (!isMatch) {
    res.status(404).json({ error: ErrorMessages.BAD_CREDENTIALS });
    return;
  }

  // In case app gets ext with public resources in future
  // regenerate to avoid session fixation (saveUninit then must be set to true)
  // req.session.regenerate((err) => {
  //   if (err) {
  //     console.error(`${ErrorMessages.SESSION_REGEN}: ${err}`);
  //     res.status(500).json({ error: ErrorMessages.SESSION_REGEN });
  //     return;
  //   }
  // });
  req.session.userID = user._id.toString();

  console.log(res.getHeaders())

  res.json({ ok: true });
};

export const logout = (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(`${ErrorMessages.SESION_KILL}: ${err}`);
      res.status(500).json({ error: ErrorMessages.SESION_KILL });
    }
  });

  res.clearCookie(sessionName).json({ ok: true });
};

export const register = async (req: Request, res: Response) => {
  const { login, pass } = req.body;

  const user = await usersCollection.findOne({ login });

  if (user) {
    res.status(404).json({ error: ErrorMessages.CONFLICT });
    return;
  }

  const newUser: IUser = {
    login,
    pass: await bcrypt.hash(pass, 10),
  };

  const registartionResult = await usersCollection.insertOne(newUser);

  if (!registartionResult.acknowledged) {
    res.status(500).json({ error: ErrorMessages.REGISTER });
    return;
  }

  res.json({ ok: true });
};

export const validateCredentials = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { login, pass } = req.body;

  if (typeof login === "string" && typeof pass === "string") {
    return next();
  }
  res.status(404).json({ error: ErrorMessages.INVALID_INPUT });
};
