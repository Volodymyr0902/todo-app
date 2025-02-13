"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_session_1 = __importDefault(require("express-session"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const sessions_store_1 = __importDefault(require("./model/mongo/sessions-store"));
const crud_router_1 = __importDefault(require("./routers/crud-router"));
const auth_router_1 = __importDefault(require("./routers/auth-router"));
const uni_router_1 = __importDefault(require("./routers/uni-router"));
const db_1 = require("./model/mongo/db");
const error_handler_1 = require("./controllers/error-handler");
const error_messages_1 = require("./controllers/error-messages");
dotenv_1.default.config();
const port = process.env.PORT ? parseInt(process.env.PORT) : 8080;
const hostname = process.env.HOST || "localhost";
const app = (0, express_1.default)();
app.set("view engine", "ejs");
app.use((0, cors_1.default)({
    origin: process.env.CLIENT || 'http://localhost:5500',
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));
app.use(express_1.default.static("public"));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use((0, express_session_1.default)({
    name: process.env.SESSION_NAME || "sid",
    secret: process.env.SESSION_SECRET || "super-secret-key",
    resave: false,
    saveUninitialized: false,
    store: sessions_store_1.default,
    cookie: {
        maxAge: 1000 * 60 * 60, // 1 hour
        sameSite: "lax",
        httpOnly: true,
        secure: false,
    },
}));
app.use("/api/v1", crud_router_1.default, auth_router_1.default); // divided
app.use("/api/v2", uni_router_1.default); // using query string
// Render the main page
app.get("/", (req, res) => {
    try {
        res.render("index");
    }
    catch (err) {
        console.error(`${error_messages_1.ErrorMessages.INDEX_RENDER}: ${err}`);
        res.status(500).json({ error: error_messages_1.ErrorMessages.INDEX_RENDER });
    }
});
app.use(error_handler_1.errorHandler);
// Connect to the DB and start the server
(0, db_1.getDb)()
    .then(() => {
    app.listen(port, hostname, (err) => {
        if (err) {
            console.error(`${error_messages_1.ErrorMessages.SERVER_START}: ${err}`);
        }
        console.log(`Server started on ${hostname} on port ${port}...`);
    });
})
    .catch((err) => {
    console.error(`${error_messages_1.ErrorMessages.DB_CONN}: ${err}`);
});
