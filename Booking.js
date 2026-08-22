import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Booking.css";

function Booking() {

    const location = useLocation();
    const navigate = useNavigate();

    const room = location.state?.room;

    const [form, setForm] = useState({
        name: "",
        phone: "",
        email: "",
        address: ""
    });

    const [loading, setLoading] = useState(false);

    // ===============================
    // HANDLE INPUT
    // ===============================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setForm({
            ...form,
            [name]: value
        });
    };


    // ===============================
    // HANDLE BOOKING
    // ===============================

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!room) {
            alert("Please select a room first.");
            return;
        }

        setLoading(true);

        const bookingData = {

            name: form.name,

            phone: form.phone,

            email: form.email,

            address: form.address,

            room: room.title,

            amount: room.price,

            paymentStatus: "Pending"
        };


        try {

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

                alert(
                    data.message ||
                    "Booking failed"
                );

                setLoading(false);

                return;
            }


            // ===============================
            // LOCAL STORAGE BACKUP
            // ===============================

            const oldBookings =
                JSON.parse(
                    localStorage.getItem("bookings")
                ) || [];


            oldBookings.push(data.booking);


            localStorage.setItem(
                "bookings",
                JSON.stringify(oldBookings)
            );


            alert(
                "Room booked successfully!"
            );


            // Go to My Booking page

            navigate("/mybooking", {
                state: {
                    booking: data.booking
                }
            });


        } catch (error) {

            console.error(
                "Booking Error:",
                error
            );

            alert(
                "Server error. Please make sure backend is running."
            );

        } finally {

            setLoading(false);
        }
    };


    return (

        <div className="booking-page">

            <div className="booking-container">

                <h1>
                    Book Your Room
                </h1>


                {/* ROOM DETAILS */}

                {room && (

                    <div className="selected-room">

                        <h2>
                            Room Details
                        </h2>

                        <p>
                            <strong>
                                Room:
                            </strong>{" "}
                            {room.title}
                        </p>

                        <p>
                            <strong>
                                Members:
                            </strong>{" "}
                            {room.members}
                        </p>

                        <p>
                            <strong>
                                Price:
                            </strong>{" "}
                            {room.price}
                        </p>

                        <p>
                            <strong>
                                Type:
                            </strong>{" "}
                            {room.type}
                        </p>

                    </div>

                )}


                {/* BOOKING FORM */}

                <form
                    onSubmit={handleSubmit}
                    className="booking-form"
                >


                    {/* NAME */}

                    <div className="form-group">

                        <label>
                            Full Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Enter your name"
                            required
                        />

                    </div>


                    {/* PHONE */}

                    <div className="form-group">

                        <label>
                            Phone Number
                        </label>

                        <input
                            type="tel"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="Enter phone number"
                            required
                        />

                    </div>


                    {/* EMAIL */}

                    <div className="form-group">

                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Enter email"
                            required
                        />

                    </div>


                    {/* ADDRESS */}

                    <div className="form-group">

                        <label>
                            Address
                        </label>

                        <textarea
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            placeholder="Enter your address"
                            rows="4"
                            required
                        />

                    </div>


                    {/* AUTOMATIC DATE/TIME MESSAGE */}

                    <div className="booking-info">

                        <p>
                            📅 Booking date and time will be
                            recorded automatically.
                        </p>

                    </div>


                    {/* BUTTON */}

                    <button
                        type="submit"
                        disabled={loading}
                    >

                        {loading
                            ? "Booking..."
                            : "Book Now"
                        }

                    </button>

                </form>

            </div>

        </div>
    );
}

export default Booking;