import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema({
    note: {
        type: String,
        required: true,
        maxlength: 50
    },
    category: {
        type: String,
        enum: ['Upcoming', 'Today', 'Note'],
        required: true
    },
    hexcolor: {
        type: String,
        required: true,
        default: '#D88C9A'
    }
}, {
    timestamps: true
});

const Todo = mongoose.model('Todo', todoSchema);

export default Todo;