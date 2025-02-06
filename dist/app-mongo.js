"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_session_1 = __importDefault(require("express-session"));
const crud_router_1 = __importDefault(require("./routers/crud-router"));
const auth_router_1 = __importDefault(require("./routers/auth-router"));
const db_1 = require("./model/mongo/db");
const sessions_store_1 = __importDefault(require("./model/mongo/sessions-store"));
const port = 8080;
const hostname = "localhost";
const app = (0, express_1.default)();
// Set the view engine
app.set("view engine", "ejs");
// Serve static files
app.use(express_1.default.static("public"));
// Apply parsers
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
// Session settings
app.use((0, express_session_1.default)({
    name: "sid",
    secret: "super-secret-key",
    resave: false,
    saveUninitialized: false,
    store: sessions_store_1.default,
    cookie: {
        maxAge: 1000 * 60 * 60, // 1 hour
        sameSite: true,
        httpOnly: true,
        secure: false,
    }
}));
// Apply routers
app.use("/api/v1", crud_router_1.default, auth_router_1.default);
// Render the main page
app.get("/", (req, res) => {
    try {
        res.render("index");
    }
    catch (error) {
        console.error(`Failed to render index: ${error}`);
        res.status(500).json({ error: "Internal server error" });
    }
});
// Connect to the DB and start the server
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
