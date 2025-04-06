import connectDB from "./db/index.js";
import dotenv from 'dotenv'
import { app } from "./app.js";
import mongoose from 'mongoose';

dotenv.config({
    path: './.env'
})

connectDB()
    .then(() => {
        mongoose.connection.on('connected', () => {
            console.log('Mongoose connected to DB');
        });

        mongoose.connection.on('error', (err) => {
            console.error('Mongoose connection error:', err.message);
        });

        app.listen(process.env.PORT, () => {
            console.log(`Server is running at PORT: ${process.env.PORT}`);
        });
    })
    .catch((error) => {
        console.error("MONGODB CONNECTION FAILED ::", error.message);
    });
