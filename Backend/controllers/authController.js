import jwt from "jsonwebtoken";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

const generateToken = (userId, username) => {
    return jwt.sign(
        { id: userId, username },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );
};

export const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne( { email } );
    if(existingUser) return res.status(400).json( { message: "Email already registered" } );

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
        username,
        email,
        password: hashedPassword
    });

    const token = generateToken(user._id, user.username);
    res.status(201).json({
        message: "Registration Successful",
        _id: user._id,
        username: user.username,
        email: user.email,
        token
    });
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne( { email } );
    if(!user) return res.status(400).json( { message: "Email not registered, cannot login" } );

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) return res.status(400).json( { message: "Email-Password Mismatch, invalid credentials" } );

    const token = generateToken(user._id, user.username);
    res.status(200).json({
        message: "Login Successful",
        id: user._id,
        username: user.username,
        email: user.email,
        token
    });
};