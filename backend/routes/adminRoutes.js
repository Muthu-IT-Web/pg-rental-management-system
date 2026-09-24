const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Admin = require("../models/Admin");

const router = express.Router();


// =========================================
// ADMIN LOGIN
// =========================================

router.post("/login", async (req, res) => {

    try {

        const { username, password } = req.body;
        // Check fields
        if (!username || !password) {
            return res.status(400).json({
                message: "Please enter username and password"
            });
        }

        // Find admin
        const admin = await Admin.findOne({
            username: username.trim()
        });

        if (!admin) {
            return res.status(401).json({
                message: "Invalid username or password"
            });
        }

        // Compare password
        const isPasswordCorrect = await bcrypt.compare(
            password,
            admin.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid username or password"
            });
        }

        // Create JWT token
        const token = jwt.sign(
            {
                adminId: admin._id,
                username: admin.username,
                role: "admin"
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        // Login successful
        res.json({
            message: "Admin login successful",
            token,
            admin: {
                id: admin._id,
                username: admin.username,
                role: "admin"
            }
        });

    } catch (error) {

        console.log("Admin Login Error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


module.exports = router;