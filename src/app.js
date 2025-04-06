import express from 'express';
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const app = express();

// CORS Configuration
app.use(cors({
    origin: "*", // Allow all origins
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// Import Routes
import userRouter from "./routes/user.routes.js";
import aiModelRouter from "./routes/aimodel.routes.js";
import reportRouter from "./routes/report.routes.js";
import exerciseRoutes from "./routes/exercise.routes.js";
import doctorRoutes from "./routes/doctor.routes.js";

// Routes
app.use("/api/users", userRouter);
app.use("/api/chat", aiModelRouter);
app.use("/api/reports", reportRouter);
app.use("/api/exercises", exerciseRoutes);
app.use("/api/doctors", doctorRoutes);

// Start the Server
const PORT = process.env.PORT || 8000; // Use Render's assigned port or default to 8000
app.listen(PORT, () => {
    console.log(`Server is running at PORT: ${PORT}`);
});
