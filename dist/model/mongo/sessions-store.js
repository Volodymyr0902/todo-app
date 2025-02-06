"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connect_mongo_1 = __importDefault(require("connect-mongo"));
exports.default = connect_mongo_1.default.create({
    mongoUrl: "mongodb://localhost:27017",
    dbName: "todos_db",
    collectionName: "sessions"
});
