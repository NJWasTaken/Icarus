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

export const login = async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Find user by email
      const user = await Account.findOne({ email });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }
  
      // Check if password matches
      if (user.password !== password) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }
  
      res.json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          bio: user.bio,
          dob: user.dob
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Login failed',
        error: error.message
      });
    }
};
  
export const register = async (req, res) => {
    try {
      const { email, password, name, phone, dob, bio } = req.body;
  
      // Check if email already exists
      const existingUser = await Account.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already registered'
        });
      }
  
      // Create new account
      const newAccount = new Account({
        email,
        password,
        name,
        phone,
        dob: dob ? new Date(dob) : undefined,
        bio
      });
  
      const savedAccount = await newAccount.save();
  
      res.status(201).json({
        success: true,
        user: {
          id: savedAccount._id,
          name: savedAccount.name,
          email: savedAccount.email,
          phone: savedAccount.phone,
          bio: savedAccount.bio,
          dob: savedAccount.dob
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Registration failed',
        error: error.message
      });
    }
  };