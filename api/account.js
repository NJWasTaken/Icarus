import express from 'express';
import { deleteAccount, createAccount, getAccounts, updateAccount, login, register } from '../controllers/account.controller.js';
import { connectDB } from './utils/db.js';
import ServerlessHttp from 'serverless-http';
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors({ origin: true }));
connectDB();

app.get("/", getAccounts);
app.post("/", createAccount);
app.put("/:id", updateAccount);
app.delete("/:id", deleteAccount);
app.post("/login", login);
app.post("/register", register);

export default ServerlessHttp(app);