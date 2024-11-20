import express from "express";
import dotenv from "dotenv";
import { connectDB } from './config/db.js';
import cors from "cors";

const app = express();
app.use(cors()); 
app.use(express.json());

import expenseRoutes from "./routes/expense.route.js";
import accountRoutes from "./routes/account.route.js";
import eventRoutes from "./routes/event.route.js";
import calendarRoutes from "./routes/calendar.route.js";

dotenv.config();

const PORT = process.env.PORT;

app.use(express.json()); // middleware

app.use("/api/expenses",expenseRoutes);
app.use("/api/accounts",accountRoutes);
app.use("/api/events",eventRoutes);
app.use("/api/calendar",calendarRoutes);

app.listen(5000, ()=>{
    connectDB();
    console.log("You're not gonna believe it but we live at http://localhost:5000");
}); 

