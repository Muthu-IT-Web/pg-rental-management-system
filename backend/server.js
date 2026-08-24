const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Routes
const bookingRoutes = require("./routes/bookingRoutes");
const ratingRoutes = require("./routes/ratingRoutes");
const paymentRoutes = require("./PaymentRoutes");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Booking Routes
app.use("/api/bookings", bookingRoutes);

// Rating Routes
app.use("/api/ratings", ratingRoutes);
app.use("/api/payments", paymentRoutes);
// Test Route
app.get("/", (req, res) => {
    res.send("PG Rental Backend is Running!");
});

// MongoDB Connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected Successfully!");
    })
    .catch((error) => {
        console.log(
            "MongoDB Connection Error:",
            error.message
        );
    });

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(
        `Server running on http://localhost:${PORT}`
    );
});
