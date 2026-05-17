import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/index.js";

export const register = async (req, res) => {
    console.log("Registering user with data:", req.body);
  const { username, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use." });
        }
        const password_hash = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username, email, password_hash });
        res.status(201).json(newUser);
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Server error during registration." });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password." });
        }
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password." });
        }
        
        const token = jwt.sign({ user_id: user.user_id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.status(200).json({ token });
    } catch (error) {               
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error during login." });
    }   
};

export const getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.user_id, {
            attributes: { exclude: ['password_hash'] }
        });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Profile error:", error);
        res.status(500).json({ message: "Server error during profile retrieval." });
    }
};

export const updateAvatar = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.user_id);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded." });
        }
        user.avatar_url = `/uploads/${req.file.filename}`;
        await user.save();
        res.status(200).json({ avatar_url: user.avatar_url });
    } catch (error) {
        console.error("Avatar update error:", error);
        res.status(500).json({ message: "Server error while updating avatar." });
    }
};

export const logout = (req, res) => {
    res.status(200).json({ message: "Logged out successfully." });
};