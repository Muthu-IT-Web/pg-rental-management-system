const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const router = express.Router();


// =========================================
// REGISTER
// =========================================

router.post("/register", async (req, res) => {

    try {

        const { name, email, phone, password } = req.body;

        // Check required fields
        if (!name || !email || !phone || !password) {
            return res.status(400).json({
                message: "Please fill all fields"
            });
        }


        // Check existing user
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "Email already registered"
            });
        }


        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);


        // Create user
        const user = new User({
            name,
            email,
            phone,
            password: hashedPassword
        });


        await user.save();


        res.status(201).json({
            message: "Registration successful"
        });

    } catch (error) {

        console.log("Register Error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


// =========================================
// LOGIN
// =========================================

router.post("/login", async (req, res) => {

    try {

        const { email, password } = req.body;


        // Check fields
        if (!email || !password) {
            return res.status(400).json({
                message: "Please enter email and password"
            });
        }


        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }


        // Compare password
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }


        // Create JWT token
        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );


        res.json({
            message: "Login successful",

            token,

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone
            }
        });

    } catch (error) {

        console.log("Login Error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


module.exports = router;