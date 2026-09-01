const express = require("express");
const router = express.Router();

const Contact = require("../models/Contact");

// ==========================================
// CREATE CONTACT ENQUIRY
// ==========================================

router.post("/", async (req, res) => {

    try {

        const {
            name,
            email,
            phone,
            address,
            message
        } = req.body;

        if (!name || !email || !phone || !address || !message) {

            return res.status(400).json({
                message: "All fields are required"
            });

        }

        const contact = new Contact({
            name,
            email,
            phone,
            address,
            message
        });

        const savedContact = await contact.save();

        res.status(201).json({
            message: "Enquiry submitted successfully",
            contact: savedContact
        });

    } catch (error) {

        console.error(
            "Contact Save Error:",
            error
        );

        res.status(500).json({
            message: "Failed to save enquiry"
        });

    }

});

// ==========================================
// GET ALL CONTACT ENQUIRIES
// ==========================================

router.get("/", async (req, res) => {

    try {

        const contacts = await Contact
            .find()
            .sort({ createdAt: -1 });

        res.json(contacts);

    } catch (error) {

        console.error(
            "Contact Fetch Error:",
            error
        );

        res.status(500).json({
            message: "Failed to fetch enquiries"
        });

    }

});

// ==========================================
// DELETE CONTACT ENQUIRY
// ==========================================

router.delete("/:id", async (req, res) => {

    try {

        const deletedContact =
            await Contact.findByIdAndDelete(
                req.params.id
            );

        if (!deletedContact) {

            return res.status(404).json({
                message: "Enquiry not found"
            });

        }

        res.json({
            message: "Enquiry deleted successfully"
        });

    } catch (error) {

        console.error(
            "Contact Delete Error:",
            error
        );

        res.status(500).json({
            message: "Failed to delete enquiry"
        });

    }

});

module.exports = router;