import express from "express";
import {login, logout, register, validateCredentials} from "../controllers/auth-controllers";

const router = express.Router();

router.post("/login", validateCredentials, login);

router.post("/logout", logout);

router.post("/register", validateCredentials, register);

export default router;
