import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import connection from "../model/mysql/connection";
import { IUser } from "../model/mysql/interfaces";
import { ErrorMessages } from "./error-messages";
import { ResultSetHeader, RowDataPacket } from "mysql2";

dotenv.config();
const sessionName = process.env.SESSION_NAME || "sid";

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

  const sql = "SELECT * FROM users WHERE login = ?";
  const [rows] = await connection.execute<RowDataPacket[]>(sql, [login]);

  if (rows.length === 0) {
    res.status(404).json({ error: ErrorMessages.BAD_CREDENTIALS });
    return;
  }

  const user = rows[0];
  const isMatch = await bcrypt.compare(pass, user.password);

  if (!isMatch) {
    res.status(404).json({ error: ErrorMessages.BAD_CREDENTIALS });
    return;
  }

  // In case app gets ext with public resources in future
  // regenerate to avoid session fixation (saveUninit then must be set to true)
  req.session.regenerate((err) => {
    if (err) {
      console.error(`${ErrorMessages.SESSION_REGEN}: ${err}`);
      res.status(500).json({ error: ErrorMessages.SESSION_REGEN });
      return;
    }
  });
  req.session.userID = user._id.toString();

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

  // const user = await usersCollection.findOne({ login });
  const selSQL = "SELECT * FROM users WHERE login = ?";
  const [rows] = await connection.execute<RowDataPacket[]>(selSQL, [login]);

  if (rows.length !== 0) {
    res.status(404).json({ error: ErrorMessages.CONFLICT });
    return;
  }

  const newUser: IUser = {
    login,
    pass: await bcrypt.hash(pass, 10),
  };

  const insSQL = "INSERT INTO users (login, password) VALUES (?, ?)";
  const [result] = await connection.execute<ResultSetHeader>(insSQL, [
    newUser.login,
    newUser.pass,
  ]);

  if (!result.insertId) {
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
