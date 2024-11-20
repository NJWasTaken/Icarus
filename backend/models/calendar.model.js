import mongoose from 'mongoose';

const calendarSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    type:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        required: true
    },
}, {
    timestamps: true
});

const Event = mongoose.model('Calendar',calendarSchema);

export default Event;