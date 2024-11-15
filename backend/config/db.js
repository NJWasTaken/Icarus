import mongoose, { mongo } from 'mongoose';
export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Mongo is cooking something up at: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error lmao: ${error.message}`);
        process.exit(1);
    }
}