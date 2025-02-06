"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    console.error(`Error: ${err}`);
    res.status(500).json({ error: "Internal server error" });
};
exports.errorHandler = errorHandler;
