import express from 'express';
import { createExpense, deleteExpense, getExpenses, updateExpense } from '../controllers/expense.controller.js';
import { connectDB } from './utils/db.js';
import ServerlessHttp from 'serverless-http';
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors({ origin: true }));
connectDB();

app.get("/", getExpenses);
app.post("/", createExpense);
app.put("/:id", updateExpense);
app.delete("/:id", deleteExpense);

export default ServerlessHttp(app);
