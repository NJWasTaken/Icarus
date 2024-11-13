import express from "express";
import dotenv from "dotenv";
import { connectDB } from './config/db.js';
import Expense from "./models/expenses.model.js";

dotenv.config();

const app = express();

app.use(express.json()); // middleware

app.get("/",(req,res)=>{
    res.send("We ready!");
})

app.post("/api/expenses", async (req,res)=>{
    const expense = req.body; // user data

    if (!expense.name || !expense.amount || !expense.date){
        return res.status(400).json({ success:false, message: "Please fill all fields."});
    }

    const newExpense = new Expense(expense)

    try {
        await newExpense.save();
        res.status(201).json({ success: true, data: newExpense});
    } catch (error){
        console.error("Error in logging expense:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });        
    }
});

app.delete("/api/expenses/:id", async (req,res) => {
    const {id} = req.params;
    // console.log("id:", id);

    try{
        await Expense.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Expense deleted" });
    } catch (error) {
        // console.error("Expense not found");
        res.status(404).json({ success: false, message: "Expense not found" });
    }
});

app.listen(5000, ()=>{
    connectDB();
    console.log("We running at http://localhost:5000");
}); 

