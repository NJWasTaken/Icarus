import Account from "../models/accounts.model.js";
import mongoose from "mongoose";

export const getAccounts = async (req,res)=>{
    try {
        const accounts = await Account.find({});
        res.status(200).json({ success: true, data: accounts });
    } catch (error) {
        console.log("Error in fetching accounts:",error.message);
        res.status(500).json({ success: false, message: "Server Error"});
    }
};

export const createAccount = async (req,res)=>{
    const account = req.body; // user data

    if (!account.name || !account.phone || !account.dob || !account.email){
        return res.status(400).json({ success:false, message: "Please fill all fields."});
    }

    const newAccount = new Account(account)

    try {
        await newAccount.save();
        res.status(201).json({ success: true, data: newAccount});
    } catch (error){
        console.error("Error in logging account:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });        
    }
};

export const updateAccount = async (req,res)=>{
    const { id } = req.params;

    const account = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({ success: false, message: "Invalid account ID" });
    }

    try {
        const updatedAccount = await Account.findByIdAndUpdate(id, account, {new:true});
        res.status(200).json({ success: true, data: updatedAccount});
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error"});
    }
};

export const deleteAccount = async (req,res) => {
    const {id} = req.params;
    // console.log("id:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Account not found" });
    }
    try{
        await Account.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Account deleted" });
    } catch (error) {
        console.error("Error in deletion");
        res.status(500).json({ success: false, message: "Error in deletion" });
    }
};