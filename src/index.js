import connectDB from "./db/index.js";
import dotenv from 'dotenv';
import { app } from "./app.js";
import mongoose from 'mongoose';

dotenv.config({
    path: './.env'
});

const startServer = async () => {
    try {
        await connectDB(); // Ensure MongoDB is connected
        mongoose.connection.on('connected', () => {
            console.log('Mongoose connected to DB');
        });

        mongoose.connection.on('error', (err) => {
            console.error('Mongoose connection error:', err.message);
        });

        const PORT = process.env.PORT || 8000;
        app.listen(PORT, () => {
            console.log(`Server is running at PORT: ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
};

startServer();
