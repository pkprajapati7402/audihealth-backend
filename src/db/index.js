import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js';

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
        });
        console.log(`\nMONGODB connected :: DB_HOST :: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error("MONGODB CONNECTION FAILED ::", error.message);
        process.exit(1);
    }
};

export default connectDB;