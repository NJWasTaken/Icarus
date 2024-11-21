import Calendar from "../models/calendar.model.js";
import mongoose from "mongoose";

export const getCalendars = async (req,res)=>{
    try {
        const calendars = await Calendar.find({});
        res.status(200).json({ success: true, data: calendars });
    } catch (error) {
        console.log("Error in fetching calendar items:",error.message);
        res.status(500).json({ success: false, message: "Server Error"});
    }
};

export const createCalendar = async (req, res) => {
    const { name, description, type, date } = req.body;

    if (!name || !type || !date) {
        return res.status(400).json({ 
            success: false, 
            message: "Please provide name, type, and date for the event."
        });
    }

    const newCalendar = new Calendar({
        name,
        description,
        type,
        date
    });

    try {
        await newCalendar.save();
        res.status(201).json({ success: true, data: newCalendar });
    } catch (error) {
        console.error("Error in creating calendar event:", error.message);
        res.status(500).json({ 
            success: false, 
            message: error.message || "Server Error" 
        });        
    }
};

export const updateCalendar = async (req,res)=>{
    const { id } = req.params;

    const item = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({ success: false, message: "Invalid calendar item ID" });
    }

    try {
        const updatedCalendar = await Calendar.findByIdAndUpdate(id, item, {new:true});
        res.status(200).json({ success: true, data: updatedCalendar});
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error"});
    }
};

export const deleteCalendar = async (req,res) => {
    const {id} = req.params;
    // console.log("id:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Calendar item not found" });
    }
    try{
        await Calendar.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Calendar item deleted" });
    } catch (error) {
        console.error("Error in deletion");
        res.status(500).json({ success: false, message: "Error in deletion" });
    }
};