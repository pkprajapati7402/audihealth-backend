// filepath: [TestMongoConnection.js](http://_vscodecontentref_/5)
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const testMongoConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI); // No need for deprecated options
        console.log("MongoDB connection successful!");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
    } finally {
        mongoose.connection.close();
    }
};

testMongoConnection();