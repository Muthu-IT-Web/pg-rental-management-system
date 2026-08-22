import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Mybooking.css";

function MyBooking() {

    const location = useLocation();
    const navigate = useNavigate();

    // Selected room from PG page
    const room = location.state?.room;

    const [form, setForm] = useState({
        name: "",
        phone: "",
        email: "",
        address: "",
        checkIn: ""
    });

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);


    // =====================================================
    // GET BOOKINGS FROM MONGODB
    // =====================================================

    const loadBookings = async () => {

        try {

            const response = await fetch(
                "http://localhost:5000/api/bookings"
            );

            if (!response.ok) {
                throw new Error("Failed to fetch bookings");
            }

            const data = await response.json();

            setBookings(
                Array.isArray(data) ? data : []
            );

        } catch (error) {

            console.error(
                "Booking Fetch Error:",
                error
            );

            setBookings([]);
        }
    };


    // =====================================================
    // LOAD BOOKINGS
    // =====================================================

    useEffect(() => {

        loadBookings();

    }, []);


    // =====================================================
    // FORM CHANGE
    // =====================================================

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

    };


    // =====================================================
    // GET ROOM IMAGE
    // =====================================================

    const getRoomImage = (image) => {

        if (!image) {
            return "/room.png";
        }

        if (
            image.startsWith("http://") ||
            image.startsWith("https://")
        ) {
            return image;
        }

        if (image.startsWith("/")) {
            return image;
        }

        return `/${image}`;
    };


    // =====================================================
    // GET BOOKING IMAGE BY ROOM NAME
    // =====================================================

    const getBookingImage = (roomTitle) => {

        switch (roomTitle) {

            case "1 Members Room":
                return "/room1.png";

            case "2 Members Room":
                return "/room2.png";

            case "3 Members Room":
                return "/room3.jpeg";

            case "4 Members Room":
                return "/room4.png";

            case "5 Members Room":
                return "/room5.png";

            case "6 Members Room":
                return "/room6.png";

            default:
                return "/room.png";
        }
    };


    // =====================================================
    // CONFIRM BOOKING
    // =====================================================

    const handleBooking = async (e) => {

        e.preventDefault();

        if (!room) {

            alert("Please select a room first!");

            navigate("/pg");

            return;
        }

        setLoading(true);

        try {

            // =================================================
            // GET ROOM PRICE
            // =================================================

            let amount = 0;

            if (room.price) {

                amount = Number(
                    String(room.price)
                        .replace(/[₹,]/g, "")
                        .replace("/ Month", "")
                        .trim()
                );
            }


            // =================================================
            // FALLBACK PRICE
            // =================================================

            if (!amount) {

                if (room.title === "1 Members Room") {
                    amount = 10000;
                }

                else if (room.title === "2 Members Room") {
                    amount = 13000;
                }

                else if (room.title === "3 Members Room") {
                    amount = 15000;
                }

                else if (room.title === "4 Members Room") {
                    amount = 17000;
                }

                else if (room.title === "5 Members Room") {
                    amount = 20000;
                }

                else if (room.title === "6 Members Room") {
                    amount = 23000;
                }
            }


            // =================================================
            // BOOKING DATA
            // =================================================

            const bookingData = {

                name: form.name,

                phone: form.phone,

                email: form.email,

                address: form.address,

                checkIn: form.checkIn,

                room: room.title,

                amount: amount,

                paymentStatus: "Pending",

                // Save selected room image
                image: room.image || getBookingImage(room.title)

            };


            console.log(
                "Sending Booking:",
                bookingData
            );


            // =================================================
            // SAVE TO MONGODB
            // =================================================

            const response = await fetch(
                "http://localhost:5000/api/bookings",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(bookingData)
                }
            );


            const data = await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Booking failed"
                );
            }


            console.log(
                "Booking Saved:",
                data
            );


            // =================================================
            // SAVED BOOKING
            // =================================================

            const savedBooking = data.booking;


            // =================================================
            // UPDATE BOOKING SCREEN
            // =================================================

            setBookings(
                previousBookings => [

                    {
                        ...savedBooking,

                        image:
                            savedBooking?.image ||
                            room.image ||
                            getBookingImage(room.title)

                    },

                    ...previousBookings
                ]
            );


            // =================================================
            // GO TO PAYMENT
            // =================================================

            navigate(
                "/payment",
                {
                    state: {

                        room: room,

                        booking: {

                            ...savedBooking,

                            room: room.title,

                            image:
                                savedBooking?.image ||
                                room.image ||
                                getBookingImage(room.title)

                        }

                    }
                }
            );


        } catch (error) {

            console.error(
                "Booking Error:",
                error
            );

            alert(
                "Booking failed. Please check your backend and MongoDB connection."
            );

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // PROCEED TO PAYMENT
    // =====================================================

    const proceedToPayment = (booking) => {

        navigate(
            "/payment",
            {
                state: {

                    room: {

                        title: booking.room,

                        price:
                            `₹${booking.amount} / Month`,

                        image:
                            booking.image ||
                            getBookingImage(booking.room)

                    },

                    booking: booking

                }
            }
        );

    };


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div className="my-booking">


            {/* =================================================
                SELECTED ROOM
            ================================================= */}

            {room && (

                <>

                    <div className="selected-room">

                        {/* ONLY SELECTED ROOM IMAGE */}

                        <img
                            src={
                                room.image
                                    ? getRoomImage(room.image)
                                    : getBookingImage(room.title)
                            }
                            alt={room.title}
                        />


                        <div>

                            <h2>
                                {room.title}
                            </h2>

                            <p>
                                👥 {room.members}
                            </p>

                            <p>
                                🏠 {room.type}
                            </p>

                            <p>
                                ✨ {room.facilities}
                            </p>

                            <h3>
                                {room.price}
                            </h3>

                        </div>

                    </div>


                    {/* =================================================
                        BOOKING FORM
                    ================================================= */}

                    <form
                        className="booking-form"
                        onSubmit={handleBooking}
                    >

                        <h2>
                            Booking Form
                        </h2>


                        <label>
                            Full Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your name"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />


                        <label>
                            Phone Number
                        </label>

                        <input
                            type="tel"
                            name="phone"
                            placeholder="Enter phone number"
                            value={form.phone}
                            onChange={handleChange}
                            required
                        />


                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />


                        <label>
                            Address
                        </label>

                        <textarea
                            name="address"
                            placeholder="Enter your address"
                            value={form.address}
                            onChange={handleChange}
                            required
                        />


                        <label>
                            Check-In Date & Time
                        </label>

                        <input
                            type="datetime-local"
                            name="checkIn"
                            value={form.checkIn}
                            onChange={handleChange}
                            required
                        />


                        <button
                            type="submit"
                            disabled={loading}
                        >

                            {loading
                                ? "Booking..."
                                : "Confirm Booking"
                            }

                        </button>

                    </form>

                </>

            )}


            {/* =================================================
                MY BOOKINGS
            ================================================= */}

            <div className="booking-list">

                <h2>
                    My Bookings
                </h2>


                {bookings.length === 0 ? (

                    <p className="no-booking-text">
                        No bookings available.
                    </p>

                ) : (

                    bookings.map((booking) => (

                        <div
                            className="booking-card"
                            key={booking._id}
                        >


                            {/* =================================================
                                ONLY BOOKED ROOM IMAGE
                            ================================================= */}

                           
                            <img
                                src={getBookingImage(booking.room)}
                                alt={booking.room}/>

                            {/* =================================================
                                BOOKING INFORMATION
                            ================================================= */}

                            <div className="booking-info">

                                <h2>
                                    {booking.room}
                                </h2>


                                <p>
                                    👤 Name:{" "}
                                    {booking.name || "N/A"}
                                </p>


                                <p>
                                    📞 Phone:{" "}
                                    {booking.phone || "N/A"}
                                </p>


                                <p>
                                    📧 Email:{" "}
                                    {booking.email || "N/A"}
                                </p>


                                <p>
                                    🏠 Address:{" "}
                                    {booking.address || "N/A"}
                                </p>


                                <p>
                                    📅 Check-in:{" "}
                                    {booking.checkIn || "N/A"}
                                </p>


                                <h3>
                                    ₹{booking.amount} / Month
                                </h3>


                                {/* =================================================
                                    PAYMENT STATUS
                                ================================================= */}

                                <div className="payment-status">

                                    <strong>
                                        Payment Status:
                                    </strong>


                                    {booking.paymentStatus === "Paid" ? (

                                        <span className="paid-status">
                                            ✅ Paid
                                        </span>

                                    ) : booking.paymentStatus === "Cash on Delivery" ? (

                                        <span className="cod-status">
                                            💵 Cash on Delivery
                                        </span>

                                    ) : (

                                        <span className="pending-status">
                                            ⏳ Pending
                                        </span>

                                    )}

                                </div>


                                {/* =================================================
                                    PAYMENT METHOD
                                ================================================= */}

                                {booking.paymentMethod && (

                                    <p className="payment-method-text">

                                        💳 Payment Method:{" "}
                                        {booking.paymentMethod}

                                    </p>

                                )}


                                {/* =================================================
                                    PAYMENT DATE
                                ================================================= */}

                                {booking.paymentDate && (

                                    <p>

                                        🕒 Payment Date:{" "}
                                        {booking.paymentDate}

                                    </p>

                                )}


                                {/* =================================================
                                    PAYMENT BUTTON
                                ================================================= */}

                                {booking.paymentStatus !== "Paid" &&
                                 booking.paymentStatus !== "Cash on Delivery" && (

                                    <button
                                        onClick={() =>
                                            proceedToPayment(booking)
                                        }
                                    >

                                        Proceed to Payment

                                    </button>

                                )}


                                {/* =================================================
                                    PAID MESSAGE
                                ================================================= */}

                                {booking.paymentStatus === "Paid" && (

                                    <div className="paid-message">

                                        ✅ Payment Completed

                                    </div>

                                )}


                                {/* =================================================
                                    COD MESSAGE
                                ================================================= */}

                                {booking.paymentStatus === "Cash on Delivery" && (

                                    <div className="cod-message">

                                        💵 Payment will be collected in cash at PG

                                    </div>

                                )}

                            </div>

                        </div>

                    ))

                )}

            </div>

        </div>

    );

}

export default MyBooking;