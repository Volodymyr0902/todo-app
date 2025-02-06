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
exports.register = exports.logout = exports.login = exports.checkAutorization = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = require("../model/mongo/db");
const sessionName = "sid";
const dbName = "todos_db";
const collectionName = "users";
const usersCollection = db_1.client.db(dbName).collection(collectionName);
const checkAutorization = (req, res, next) => {
    if (!req.session.userID) {
        res.status(302).json({ error: "forbidden" });
        return;
    }
    next();
};
exports.checkAutorization = checkAutorization;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { login, pass } = req.body;
    const user = yield usersCollection.findOne({ login });
    if (!user) {
        res.status(404).json({ error: "not found" });
        return;
    }
    const isMatch = yield bcrypt_1.default.compare(pass, user.pass);
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
});
exports.login = login;
const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(`Failed to destroy session: ${err}`);
            res.status(500).json({ ok: false });
        }
    });
    res.clearCookie(sessionName).json({ ok: true });
};
exports.logout = logout;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { login, pass } = req.body;
    const user = yield usersCollection.findOne({ login });
    if (user) {
        res.status(404).json({ ok: false });
        return;
    }
    const newUser = {
        login,
        pass: yield bcrypt_1.default.hash(pass, 10),
    };
    const registartionResult = yield usersCollection.insertOne(newUser);
    if (!registartionResult.acknowledged) {
        res.status(500).json({ ok: false });
        return;
    }
    res.json({ ok: true });
});
exports.register = register;
