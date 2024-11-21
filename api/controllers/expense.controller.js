import Expense from "../models/expenses.model.js";
import mongoose from "mongoose";

export const getExpenses = async (req,res)=>{
    try {
        const expenses = await Expense.find({});
        res.status(200).json({ success: true, data: expenses });
    } catch (error) {
        console.log("Error in fetching expenses:",error.message);
        res.status(500).json({ success: false, message: "Server Error"});
    }
};

export const createExpense = async (req,res)=>{
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
};

export const updateExpense = async (req,res)=>{
    const { id } = req.params;

    const expense = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({ success: false, message: "Invalid expense ID" });
    }

    try {
        const updatedExpense = await Expense.findByIdAndUpdate(id, expense, {new:true});
        res.status(200).json({ success: true, data: updatedExpense});
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error"});
    }
};

export const deleteExpense = async (req,res) => {
    const {id} = req.params;
    // console.log("id:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Expense not found" });
    }
    try{
        await Expense.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Expense deleted" });
    } catch (error) {
        console.error("Error in deletion");
        res.status(500).json({ success: false, message: "Error in deletion" });
    }
};