import mongoose from 'mongoose';

const eventsSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    tag:{
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

const Event = mongoose.model('Event',eventsSchema);

export default Event;