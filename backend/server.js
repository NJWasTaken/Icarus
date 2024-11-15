import express from "express";
import dotenv from "dotenv";
import { connectDB } from './config/db.js';
import Expense from "./models/expenses.model.js";
import mongoose from "mongoose";

import expenseRoutes from "./routes/expense.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json()); // middleware

app.use("/api/expenses",expenseRoutes);

app.listen(5000, ()=>{
    connectDB();
    console.log("You're not gonna believe it but we live at http://localhost:5000");
}); 

