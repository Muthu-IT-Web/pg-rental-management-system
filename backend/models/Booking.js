const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
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

        address: {
            type: String,
            required: true
        },

        room: {
            type: String,
            required: true
        },

        amount: {
            type: String,
            default: ""
        },

        paymentStatus: {
            type: String,
            default: "Pending"

        },

        paymentMethod: {
    type: String,
    default: ""
       },

        paymentDate: {
    type: Date,
    default: null
       }
    },
    {
        timestamps: true
    }

    
);

module.exports = mongoose.model("Booking", bookingSchema);