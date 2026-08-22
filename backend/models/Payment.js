const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        phone: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true
        },

        room: {
            type: String,
            required: true
        },

        amount: {
            type: Number,
            required: true
        },

        paymentMethod: {
            type: String,
            required: true
        },

        status: {
            type: String,
            default: "Paid"
        },

        bookingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking",
            default: null
        },

        paymentDate: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Payment", paymentSchema);