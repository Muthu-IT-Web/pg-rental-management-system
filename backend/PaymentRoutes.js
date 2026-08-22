const express = require("express");
const router = express.Router();

const Payment = require("./models/Payment");
const Booking = require("./models/Booking");


// ======================================================
// POST - SAVE PAYMENT
// ======================================================

router.post("/", async (req, res) => {

    try {

        const {
            name,
            phone,
            email,
            room,
            amount,
            paymentMethod,
            upi,
            cardName,
            cardNumber,
            expiry,
            cvv,
            bank,
            bookingId
        } = req.body;

        if (!name || !phone || !email || !room || !amount || !paymentMethod) {
            return res.status(400).json({
                message: "Required payment details are missing"
            });
        }


        // ==================================================
        // PAYMENT STATUS
        // ==================================================

        const paymentStatus =
            paymentMethod === "Cash on Delivery"
                ? "Cash on Delivery"
                : "Paid";


        // ==================================================
        // SAVE PAYMENT
        // ==================================================

        const payment = new Payment({

            name,
            phone,
            email,

            room,

            amount: Number(amount),

            paymentMethod,

            upi,
            cardName,
            cardNumber,
            expiry,
            cvv,
            bank,

            bookingId,

            status:paymentStatus,

            paymentDate: new Date()

        });


        const savedPayment =
            await payment.save();


        // ==================================================
        // UPDATE BOOKING IN MONGODB
        // ==================================================

        let updatedBooking = null;


        if (bookingId) {

            updatedBooking =
                await Booking.findByIdAndUpdate(

                    bookingId,

                    {

                        paymentStatus:
                            paymentStatus,

                        paymentMethod:
                            paymentMethod,

                        paymentDate:
                            new Date()

                    },

                    {
                        new: true
                    }

                );

        }


        // ==================================================
        // FALLBACK MATCH
        // ==================================================

        if (!updatedBooking) {

            updatedBooking =
                await Booking.findOneAndUpdate(

                    {

                        name: name,

                        phone: phone,

                        room: room

                    },

                    {

                        paymentStatus:
                            paymentStatus,

                        paymentMethod:
                            paymentMethod,

                        paymentDate:
                            new Date()

                    },

                    {
                        new: true
                    }

                );

        }


        // ==================================================
        // RESPONSE
        // ==================================================

        res.status(201).json({

            message:
                "Payment saved successfully",

            payment:
                savedPayment,

            booking:
                updatedBooking

        });

    }

    catch (error) {

        console.error(
            "Payment Save Error:",
            error
        );

        res.status(500).json({

            message:
                "Failed to save payment",

            error:
                error.message

        });

    }

});


// ======================================================
// GET - ALL PAYMENTS
// ======================================================

router.get("/", async (req, res) => {

    try {

        const payments =
            await Payment
                .find()
                .sort({
                    paymentDate: -1
                });


        res.status(200).json(payments);

    }

    catch (error) {

        console.error(
            "Payment Fetch Error:",
            error
        );

        res.status(500).json({

            message:
                "Failed to fetch payments",

            error:
                error.message

        });

    }

});


// ======================================================
// GET - PAYMENT BY ID
// ======================================================

router.get("/:id", async (req, res) => {

    try {

        const payment =
            await Payment.findById(
                req.params.id
            );


        if (!payment) {

            return res.status(404).json({

                message:
                    "Payment not found"

            });

        }


        res.status(200).json(payment);

    }

    catch (error) {

        console.error(
            "Payment Fetch Error:",
            error
        );

        res.status(500).json({

            message:
                "Failed to fetch payment",

            error:
                error.message

        });

    }

});


// ======================================================
// DELETE - PAYMENT
// ======================================================

router.delete("/:id", async (req, res) => {

    try {

        const deletedPayment =
            await Payment.findByIdAndDelete(
                req.params.id
            );


        if (!deletedPayment) {

            return res.status(404).json({

                message:
                    "Payment not found"

            });

        }


        res.status(200).json({

            message:
                "Payment deleted successfully"

        });

    }

    catch (error) {

        console.error(
            "Payment Delete Error:",
            error
        );

        res.status(500).json({

            message:
                "Failed to delete payment",

            error:
                error.message

        });

    }

});


module.exports = router;