import mongoose, { mongo } from 'mongoose';
export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Mongo also finna connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error lmao: ${error.message}`);
        process.exit(1);
    }
}