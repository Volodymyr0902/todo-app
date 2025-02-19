"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCredentials = exports.register = exports.logout = exports.login = exports.checkAutorization = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
const connection_1 = __importDefault(require("../model/mysql/connection"));
const error_messages_1 = require("./error-messages");
dotenv_1.default.config();
const sessionName = process.env.SESSION_NAME || "sid";
const checkAutorization = (req, res, next) => {
    const { action } = req.query;
    if (!req.session.userID && action !== "login" && action !== "register") {
        res.status(302).json({ error: error_messages_1.ErrorMessages.FORBIDDEN });
        return;
    }
    next();
};
exports.checkAutorization = checkAutorization;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { login, pass } = req.body;
    const sql = "SELECT * FROM users WHERE login = ?";
    const [rows] = yield connection_1.default.execute(sql, [login]);
    if (rows.length === 0) {
        res.status(404).json({ error: error_messages_1.ErrorMessages.BAD_CREDENTIALS });
        return;
    }
    const user = rows[0];
    const isMatch = yield bcrypt_1.default.compare(pass, user.password);
    if (!isMatch) {
        res.status(404).json({ error: error_messages_1.ErrorMessages.BAD_CREDENTIALS });
        return;
    }
    // In case app gets ext with public resources in future
    // regenerate to avoid session fixation (saveUninit then must be set to true)
    req.session.regenerate((err) => {
        if (err) {
            console.error(`${error_messages_1.ErrorMessages.SESSION_REGEN}: ${err}`);
            res.status(500).json({ error: error_messages_1.ErrorMessages.SESSION_REGEN });
            return;
        }
    });
    req.session.userID = user._id.toString();
    res.json({ ok: true });
});
exports.login = login;
const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(`${error_messages_1.ErrorMessages.SESION_KILL}: ${err}`);
            res.status(500).json({ error: error_messages_1.ErrorMessages.SESION_KILL });
        }
    });
    res.clearCookie(sessionName).json({ ok: true });
};
exports.logout = logout;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { login, pass } = req.body;
    // const user = await usersCollection.findOne({ login });
    const selSQL = "SELECT * FROM users WHERE login = ?";
    const [rows] = yield connection_1.default.execute(selSQL, [login]);
    if (rows.length !== 0) {
        res.status(404).json({ error: error_messages_1.ErrorMessages.CONFLICT });
        return;
    }
    const newUser = {
        login,
        pass: yield bcrypt_1.default.hash(pass, 10),
    };
    const insSQL = "INSERT INTO users (login, password) VALUES (?, ?)";
    const [result] = yield connection_1.default.execute(insSQL, [
        newUser.login,
        newUser.pass,
    ]);
    if (!result.insertId) {
        res.status(500).json({ error: error_messages_1.ErrorMessages.REGISTER });
        return;
    }
    res.json({ ok: true });
});
exports.register = register;
const validateCredentials = (req, res, next) => {
    const { login, pass } = req.body;
    if (typeof login === "string" && typeof pass === "string") {
        return next();
    }
    res.status(404).json({ error: error_messages_1.ErrorMessages.INVALID_INPUT });
};
exports.validateCredentials = validateCredentials;
