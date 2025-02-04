"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const router_1 = __importDefault(require("./routers/router"));
const db_1 = require("./db/mongo/db");
const port = 8080;
const hostname = "localhost";
const app = (0, express_1.default)();
app.set("view engine", "ejs");
app.use(express_1.default.static("public"));
app.use(body_parser_1.default.json());
app.use("/api/v1", router_1.default);
app.get("/", (req, res) => {
    res.render("index");
});
(0, db_1.getDb)()
    .then(() => {
    app.listen(port, hostname, (err) => {
        if (err) {
            console.error(`Failed to start server: ${err}`);
        }
        console.log(`Server started on ${hostname} on port ${port}...`);
    });
})
    .catch((err) => {
    console.error(`Failed to connect to DB: ${err}`);
});
