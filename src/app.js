import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const app = express();

// CORS Configuration
const allowedOrigins = ['https://audihealth-frontend.vercel.app']; // Add your frontend URL here
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, origin);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // Allow cookies and credentials
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middleware
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(cookieParser());

// Import Routes
import userRouter from './routes/user.routes.js';
import aiModelRouter from './routes/aimodel.routes.js';
import reportRouter from './routes/report.routes.js';
import exerciseRoutes from './routes/exercise.routes.js';
import doctorRoutes from './routes/doctor.routes.js';

// Routes
app.use('/api/users', userRouter);
app.use('/api/chat', aiModelRouter);
app.use('/api/reports', reportRouter);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/doctors', doctorRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err.message);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});

// Start the Server
const PORT = process.env.PORT || 8000; // Use Render's assigned port or default to 8000
app.listen(PORT, () => {
    console.log(`Server is running at PORT: ${PORT}`);
});
