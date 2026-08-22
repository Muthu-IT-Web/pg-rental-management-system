const express = require("express");
const router = express.Router();

const Booking = require("../models/Booking");

// ===============================
// CREATE BOOKING
// ===============================

router.post("/", async (req, res) => {
    try {
        const {
            name,
            phone,
            email,
            address,
            room,
            amount
        } = req.body;

        // Required field validation
        if (
            !name ||
            !phone ||
            !email ||
            !address ||
            !room
        ) {
            return res.status(400).json({
                message: "Please fill all required fields"
            });
        }

        // Create booking
        const booking = new Booking({
            name,
            phone,
            email,
            address,
            room,
            amount,
            paymentStatus: "Pending"
        });

        // Save to MongoDB
        const savedBooking = await booking.save();

        res.status(201).json({
            message: "Booking successful",
            booking: savedBooking
        });

    } catch (error) {
        console.error("Booking Save Error:", error);

        res.status(500).json({
            message: "Booking failed",
            error: error.message
        });
    }
});


// ===============================
// GET ALL BOOKINGS
// ===============================

router.get("/", async (req, res) => {
    try {
        const bookings = await Booking
            .find()
            .sort({ createdAt: -1 });

        res.status(200).json(bookings);

    } catch (error) {
        console.error("Fetch Booking Error:", error);

        res.status(500).json({
            message: "Failed to fetch bookings",
            error: error.message
        });
    }
});


// ===============================
// DELETE BOOKING
// ===============================

router.delete("/:id", async (req, res) => {
    try {
        const deletedBooking = await Booking.findByIdAndDelete(
            req.params.id
        );

        if (!deletedBooking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        res.status(200).json({
            message: "Booking deleted successfully"
        });

    } catch (error) {
        console.error("Delete Booking Error:", error);

        res.status(500).json({
            message: "Failed to delete booking",
            error: error.message
        });
    }
});

module.exports = router;