const express = require("express");
const Rating = require("../models/Rating");

const router = express.Router();

// Add Rating
router.post("/", async (req, res) => {
    try {

        const rating = new Rating(req.body);

        const savedRating = await rating.save();

        res.status(201).json({
            message: "Rating submitted successfully",
            rating: savedRating
        });

    } catch (error) {

        res.status(500).json({
            message: "Rating submission failed",
            error: error.message
        });

    }
});

// Get all Ratings
router.get("/", async (req, res) => {
    try {

        const ratings = await Rating
            .find()
            .sort({ createdAt: -1 });

        res.json(ratings);

    } catch (error) {

        res.status(500).json({
            message: "Failed to get ratings",
            error: error.message
        });

    }
});

module.exports = router;