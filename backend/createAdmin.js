const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const Admin = require("./models/Admin");

async function createAdmin() {

    try {

        // Connect MongoDB
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB Connected Successfully!");

        const username = "admin";
        const password = "admin123";

        // Check existing admin
        const existingAdmin = await Admin.findOne({ username });

        if (existingAdmin) {

            console.log("Admin already exists.");

            process.exit(0);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        // Create admin
        const admin = new Admin({
            username,
            password: hashedPassword
        });

        await admin.save();

        console.log("=================================");
        console.log("Admin created successfully!");
        console.log("Username:", username);
        console.log("Password:", password);
        console.log("=================================");

        process.exit(0);

    } catch (error) {

        console.log(
            "Create Admin Error:",
            error
        );

        process.exit(1);
    }
}

createAdmin();