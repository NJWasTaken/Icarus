import mongoose from 'mongoose';

const accountsSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    phone:{
        type: Number,
        required: true
    },
    dob:{
        type: Date,
        required: false
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    bio:{
        type: String,
        required: false
    },
}, {
    timestamps: true
});

const Account = mongoose.model('Account',accountsSchema);

export default Account;