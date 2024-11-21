import mongoose from 'mongoose';

const expensesSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    amount:{
        type: Number,
        required: true
    },
    date:{
        type: Date,
        required: true
    },
}, {
    timestamps: true
});

const Expense = mongoose.model('Expense',expensesSchema);

export default Expense;