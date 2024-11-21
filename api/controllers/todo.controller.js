import Todo from "../models/todo.model.js";
import mongoose from "mongoose";

export const getTodos = async (req, res) => {
    try {
        const todos = await Todo.find({});
        res.status(200).json({ success: true, data: todos });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Error fetching todos",
            error: error.message 
        });
    }
};

export const createTodo = async (req, res) => {
    try {
        const { note, category, hexcolor } = req.body;

        // Validate input
        if (!note || !category || !hexcolor) {
            return res.status(400).json({ 
                success: false, 
                message: "Please provide note, category, and color" 
            });
        }

        // Check note length
        if (note.length > 50) {
            return res.status(400).json({ 
                success: false, 
                message: "Note cannot exceed 50 characters" 
            });
        }

        const newTodo = new Todo({ note, category, hexcolor });
        await newTodo.save();
        res.status(201).json({ success: true, data: newTodo });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Error creating todo",
            error: error.message 
        });
    }
};

export const updateTodo = async (req, res) => {
    const { id } = req.params;

    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ 
            success: false, 
            message: "Invalid todo ID" 
        });
    }

    try {
        const updatedTodo = await Todo.findByIdAndUpdate(
            id, 
            req.body, 
            { new: true, runValidators: true }
        );

        if (!updatedTodo) {
            return res.status(404).json({ 
                success: false, 
                message: "Todo not found" 
            });
        }

        res.status(200).json({ success: true, data: updatedTodo });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Error updating todo",
            error: error.message 
        });
    }
};

export const deleteTodo = async (req, res) => {
    const { id } = req.params;

    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ 
            success: false, 
            message: "Invalid todo ID" 
        });
    }

    try {
        const deletedTodo = await Todo.findByIdAndDelete(id);

        if (!deletedTodo) {
            return res.status(404).json({ 
                success: false, 
                message: "Todo not found" 
            });
        }

        res.status(200).json({ 
            success: true, 
            message: "Todo deleted successfully" 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Error deleting todo",
            error: error.message 
        });
    }
};