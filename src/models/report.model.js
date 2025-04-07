import mongoose from "mongoose";
import moment from "moment-timezone";
import { db } from "../firebase.js";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

const reportSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    acousticFeatures: {
        Jitter_Percent: Number,
        MFCC_Mean: [Number],
        MFCC_Std: [Number],
        Shimmer_Percent: Number
    },
    analysisDate: {
        type: String, // ✅ Store as String to maintain timezone formatting
        default: () => moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss"), // ✅ Store in IST (Indian Standard Time)
    },
    confidenceScores: {
        Healthy: String,
        Laryngitis: String,
        Vocal_Polyp: String
    },
    findings: String,
    pdfUrl: String,
    prediction: String
}, { timestamps: true });

export const Report = mongoose.model("Report", reportSchema);

const reportsCollection = collection(db, "reports");

export const createReport = async (reportData) => {
    const reportDoc = await addDoc(reportsCollection, reportData);
    return { id: reportDoc.id, ...reportData };
};

export const getReportsByUserId = async (userId) => {
    const q = query(reportsCollection, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};