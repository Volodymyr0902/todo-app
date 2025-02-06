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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDb = exports.client = void 0;
const mongodb_1 = require("mongodb");
const dbURI = process.env.dbURI || "mongodb://localhost:27017";
const client = new mongodb_1.MongoClient(dbURI);
exports.client = client;
const getDb = () => __awaiter(void 0, void 0, void 0, function* () {
    yield client.connect();
    return client.db();
});
exports.getDb = getDb;
