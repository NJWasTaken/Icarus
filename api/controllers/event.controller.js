import Event from "../models/events.model.js";
import mongoose from "mongoose";

export const getEvents = async (req,res)=>{
    try {
        const events = await Event.find({});
        res.status(200).json({ success: true, data: events });
    } catch (error) {
        console.log("Error in fetching expenses:",error.message);
        res.status(500).json({ success: false, message: "Server Error"});
    }
};

export const createEvent = async (req,res)=>{
    const event = req.body; // user data

    if (!event.name || !event.tag || !event.date){
        return res.status(400).json({ success:false, message: "Please fill all fields."});
    }

    const newEvent = new Event(event)

    try {
        await newEvent.save();
        res.status(201).json({ success: true, data: newEvent});
    } catch (error){
        console.error("Error in logging event:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });        
    }
};

export const updateEvent = async (req,res)=>{
    const { id } = req.params;

    const event = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({ success: false, message: "Invalid event ID" });
    }

    try {
        const updatedEvent = await Event.findByIdAndUpdate(id, event, {new:true});
        res.status(200).json({ success: true, data: updatedEvent});
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error"});
    }
};

export const deleteEvent = async (req,res) => {
    const {id} = req.params;
    // console.log("id:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Event not found" });
    }
    try{
        await Event.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Event deleted" });
    } catch (error) {
        console.error("Error in deletion");
        res.status(500).json({ success: false, message: "Error in deletion" });
    }
};