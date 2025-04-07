import { asyncHandler } from "../utils/asyncHandler.js";
import { auth } from "../firebase.js";
import { createUser, findUserByEmail, findUserByUsername } from "../models/user.model.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new Error("Error while generating tokens");
    }
};

export const registerUser = async (req, res) => {
    const { email, username, fullName, password } = req.body;

    if (!email || !username || !fullName || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const existingUserByEmail = await findUserByEmail(email);
        if (existingUserByEmail) {
            return res.status(409).json({ message: "User with this email already exists" });
        }

        const existingUserByUsername = await findUserByUsername(username);
        if (existingUserByUsername) {
            return res.status(409).json({ message: "Username is already taken" });
        }

        // Create user in Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Save user data in Firestore
        const newUser = {
            uid: userCredential.user.uid,
            email,
            username,
            fullName,
        };
        await createUser(newUser);

        res.status(201).json({
            message: "User registered successfully",
            user: newUser,
        });
    } catch (error) {
        console.error("Error during registration:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        res.status(200).json({
            message: "Login successful",
            user: {
                uid: user.uid,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("Error during login:", error.message);
        res.status(401).json({ message: "Invalid email or password" });
    }
};

export const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        { $unset: { refreshToken: 1 } },
        { new: true }
    );

    return res
        .status(200)
        .clearCookie("accessToken", {
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        })
        .clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        })
        .json({
            success: true,
            message: "User logged out successfully"
        });
});


export const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken;

    if (!incomingRefreshToken) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized request - No refresh token"
        });
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id);

        if (!user || incomingRefreshToken !== user?.refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Invalid refresh token"
            });
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

        return res
            .status(200)
            .cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'None'
            })
            .cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'None'
            })
            .json({
                success: true,
                accessToken,
                user,
                message: "Access token refreshed"
            });
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid refresh token"
        });
    }
};