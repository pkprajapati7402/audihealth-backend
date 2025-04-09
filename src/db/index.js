import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        console.log("Connecting to MongoDB with URI:", process.env.MONGODB_URI); // Debugging log
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`\nMONGODB connected :: DB_HOST :: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB CONNECTION FAILED ::", error);
        process.exit(1);
    }
};

export default connectDB;