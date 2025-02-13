"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.default = connect_mongo_1.default.create({
    mongoUrl: process.env.DB_URI || "mongodb://localhost:27017",
    dbName: process.env.DB_NAME || "todos_db",
    collectionName: process.env.SESSIONS_COLLECTION || "sessions"
});
