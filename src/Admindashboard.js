import React, { useEffect, useState } from "react";
import "./Admindashboard.css";

function Admindashboard() {

    // ==================================================
    // LOGIN STATE
    // ==================================================

    const [isLoggedIn, setIsLoggedIn] = useState(
        localStorage.getItem("adminLoggedIn") === "true"
    );

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    // ==================================================
    // DATA
    // ==================================================

    const [bookings, setBookings] = useState([]);
    const [enquiries, setEnquiries] = useState([]);
    const [ratings, setRatings] = useState([]);

    const [loadingBookings, setLoadingBookings] = useState(false);
    const [loadingRatings, setLoadingRatings] = useState(false);

    // ==================================================
    // LOGIN
    // ==================================================

    const handleLogin = (e) => {

        e.preventDefault();

        if (
            username.trim() !== "" &&
            password.trim() !== ""
        ) {

            localStorage.setItem(
                "adminLoggedIn",
                "true"
            );

            setIsLoggedIn(true);

            setUsername("");
            setPassword("");

        } else {

            alert("Please enter username and password");

        }
    };

    // ==================================================
    // LOAD BOOKINGS FROM MONGODB
    // ==================================================

    const loadBookings = async () => {

        try {

            setLoadingBookings(true);

            const response = await fetch(
                "https://pg-rental-management-system.onrender.com/api/bookings"
            );

            if (!response.ok) {

                throw new Error(
                    "Failed to load bookings"
                );

            }

            const data = await response.json();

            setBookings(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (error) {

            console.error(
                "Booking Load Error:",
                error
            );

            setBookings([]);

        } finally {

            setLoadingBookings(false);

        }
    };

    // ==================================================
    // LOAD RATINGS FROM MONGODB
    // ==================================================

    const loadRatings = async () => {

        try {

            setLoadingRatings(true);

            const response = await fetch(
                "https://pg-rental-management-system.onrender.com/api/ratings"
            );

            if (!response.ok) {

                throw new Error(
                    "Failed to load ratings"
                );

            }

            const data = await response.json();

            setRatings(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (error) {

            console.error(
                "Rating Load Error:",
                error
            );

            setRatings([]);

        } finally {

            setLoadingRatings(false);

        }
    };

    // ==================================================
    // LOAD DATA AFTER LOGIN
    // ==================================================
       const loadEnquiries = async () => {

    try {

        const response = await fetch(
            "https://pg-rental-management-system.onrender.com/api/contacts"
        );

        if (!response.ok) {

            throw new Error(
                "Failed to load enquiries"
            );

        }

        const data = await response.json();

        setEnquiries(
            Array.isArray(data)
                ? data
                : []
        );

    } catch (error) {

        console.error(
            "Enquiry Load Error:",
            error
        );

        setEnquiries([]);

    }
};

    useEffect(() => {

        if (!isLoggedIn) {
            return;
        }

        // Load MongoDB bookings
        loadBookings();

        // Load MongoDB ratings
        loadRatings();

          loadEnquiries();

       
    }, [isLoggedIn]);

    // ==================================================
    // FIND RATING FOR PARTICULAR BOOKING
    // ==================================================

    const getBookingRating = (booking) => {

        if (!booking || ratings.length === 0) {
            return null;
        }

        const roomTitle =
            typeof booking.room === "string"
                ? booking.room
                : booking.room?.title;

        // ----------------------------------------------
        // FIRST: MATCH USING BOOKING ID
        // ----------------------------------------------

        let matchedRating = ratings.find(
            (rating) =>
                rating.bookingId &&
                booking._id &&
                String(rating.bookingId) ===
                String(booking._id)
        );

        if (matchedRating) {
            return matchedRating;
        }

        // ----------------------------------------------
        // SECOND: MATCH USING EMAIL + ROOM
        // ----------------------------------------------

        matchedRating = ratings.find(
            (rating) => {

                const sameEmail =
                    rating.email &&
                    booking.email &&
                    rating.email.toLowerCase() ===
                    booking.email.toLowerCase();

                const sameRoom =
                    rating.room &&
                    roomTitle &&
                    rating.room.toLowerCase() ===
                    roomTitle.toLowerCase();

                return sameEmail && sameRoom;
            }
        );

        return matchedRating || null;
    };

    // ==================================================
    // DELETE BOOKING FROM MONGODB
    // ==================================================

    const deleteBooking = async (bookingId) => {

        if (!bookingId) {

            alert("Booking ID not found.");

            return;

        }

        const confirmDelete =
            window.confirm(
                "Are you sure you want to permanently delete this booking?"
            );

        if (!confirmDelete) {
            return;
        }

        try {

            const response = await fetch(
                `https://pg-rental-management-system.onrender.com/api/bookings/${bookingId}`,
                {
                    method: "DELETE"
                }
            );

            const data = await response.json();

            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to delete booking"
                );

            }

            // Remove booking from current screen
            setBookings(
                (previousBookings) =>
                    previousBookings.filter(
                        (booking) =>
                            String(booking._id) !==
                            String(bookingId)
                    )
            );

            alert("Booking deleted successfully.");

        } catch (error) {

            console.error(
                "Delete Booking Error:",
                error
            );

            alert(
                "Booking delete failed."
            );

        }
    };

    // ==================================================
    // DELETE ENQUIRY
    // ==================================================
          const deleteEnquiry = async (enquiryId) => {

    if (!enquiryId) {
        alert("Enquiry ID not found.");
        return;
    }

    const confirmDelete = window.confirm(
        "Are you sure you want to permanently delete this enquiry?"
    );

    if (!confirmDelete) {
        return;
    }

    try {

        const response = await fetch(
            `https://pg-rental-management-system.onrender.com/api/contacts/${enquiryId}`,
            {
                method: "DELETE"
            }
        );

        const data = await response.json();

        if (!response.ok) {

            throw new Error(
                data.message || "Failed to delete enquiry"
            );

        }

        setEnquiries((previousEnquiries) =>
            previousEnquiries.filter(
                (enquiry) =>
                    String(enquiry._id) !==
                    String(enquiryId)
            )
        );

        alert("Enquiry deleted successfully.");

    } catch (error) {

        console.error(
            "Delete Enquiry Error:",
            error
        );

        alert("Enquiry delete failed.");

    }
};
   

    // ==================================================
    // LOGOUT
    // ==================================================

    const logout = () => {

        localStorage.removeItem(
            "adminLoggedIn"
        );

        setIsLoggedIn(false);

        setBookings([]);
        setEnquiries([]);
        setRatings([]);

        setUsername("");
        setPassword("");

    };

    // ==================================================
    // LOGIN PAGE
    // ==================================================

    if (!isLoggedIn) {

        return (

            <div className="admin-login-page">

                <div className="admin-login-box">

                    <div className="admin-icon">
                        🔐
                    </div>

                    <h1>
                        Admin Login
                    </h1>

                    <p>
                        PG Rental Management
                    </p>

                    <form
                        onSubmit={handleLogin}
                    >

                        <label>
                            Username
                        </label>

                        <input
                            type="text"
                            placeholder="Enter username"
                            value={username}
                            onChange={(e) =>
                                setUsername(
                                    e.target.value
                                )
                            }
                            autoComplete="off"
                            required
                        />

                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) =>
                                setPassword(
                                    e.target.value
                                )
                            }
                            autoComplete="new-password"
                            required
                        />

                        <button type="submit">
                            Login
                        </button>

                    </form>

                </div>

            </div>

        );

    }

    // ==================================================
    // ADMIN DASHBOARD
    // ==================================================

    return (

        <div className="admin-dashboard">

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="admin-header">

                <div>

                    <h1>
                        Admin Dashboard
                    </h1>

                    <p>
                        PG Rental Management
                    </p>

                </div>

                <button
                    className="logout-btn"
                    onClick={logout}
                >
                    Logout
                </button>

            </div>


            {/* ==================================================
                STATISTICS
            ================================================== */}

            <div className="admin-stats">

                {/* TOTAL BOOKINGS */}

                <div className="stat-card">

                    <div className="stat-icon">
                        🏠
                    </div>

                    <div>

                        <h2>
                            {bookings.length}
                        </h2>

                        <p>
                            Total Bookings
                        </p>

                    </div>

                </div>


                {/* TOTAL ENQUIRIES */}

                <div className="stat-card">

                    <div className="stat-icon">
                        ✉️
                    </div>

                    <div>

                        <h2>
                            {enquiries.length}
                        </h2>

                        <p>
                            Total Enquiries
                        </p>

                    </div>

                </div>


                {/* COMPLETED PAYMENTS */}

                <div className="stat-card">

                    <div className="stat-icon">
                        💳
                    </div>

                    <div>

                        <h2>

                            {
                                bookings.filter(
                                    (booking) =>
                                        booking.paymentStatus ===
                                        "Paid"
                                ).length
                            }

                        </h2>

                        <p>
                            Completed Payments
                        </p>

                    </div>

                </div>


                {/* TOTAL RATINGS */}

                <div className="stat-card">

                    <div className="stat-icon">
                        ⭐
                    </div>

                    <div>

                        <h2>

                            {
                                bookings.filter(
                                    (booking) =>
                                        getBookingRating(
                                            booking
                                        ) !== null
                                ).length
                            }

                        </h2>

                        <p>
                            Total Ratings
                        </p>

                    </div>

                </div>

            </div>


            {/* ==================================================
                BOOKINGS
            ================================================== */}

            <section className="admin-section">

                <div className="section-title">

                    <h2>
                        Room Bookings
                    </h2>

                    <span>
                        {bookings.length} Bookings
                    </span>

                </div>


                {loadingBookings ? (

                    <div className="empty-box">

                        <h3>
                            Loading Bookings...
                        </h3>

                        <p>
                            Please wait.
                        </p>

                    </div>

                ) : bookings.length === 0 ? (

                    <div className="empty-box">

                        <h3>
                            No Bookings Yet
                        </h3>

                        <p>
                            Customer bookings will appear here.
                        </p>

                    </div>

                ) : (

                    <div className="booking-table-wrapper">

                        <table className="admin-table">

                            <thead>

                                <tr>

                                    <th>
                                        S.No
                                    </th>

                                    <th>
                                        Customer
                                    </th>

                                    <th>
                                        Phone
                                    </th>

                                    <th>
                                        Email
                                    </th>

                                    <th>
                                        Address
                                    </th>

                                    <th>
                                        Room
                                    </th>

                                    <th>
                                        Price
                                    </th>

                                    <th>
                                        Booking Date & Time
                                    </th>

                                    <th>
                                        Payment
                                    </th>

                                    <th>
                                        Rating & Review
                                    </th>

                                    <th>
                                        Action
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {bookings.map(
                                    (booking, index) => {

                                        const roomTitle =
                                            typeof booking.room === "string"
                                                ? booking.room
                                                : booking.room?.title ||
                                                  "PG Room";

                                        const price =
                                            booking.amount
                                                ? `₹${booking.amount} / Month`
                                                : "N/A";

                                        const bookingRating =
                                            getBookingRating(
                                                booking
                                            );

                                        return (

                                            <tr
                                                key={
                                                    booking._id ||
                                                    index
                                                }
                                            >

                                                {/* S.NO */}

                                                <td>
                                                    {index + 1}
                                                </td>


                                                {/* CUSTOMER */}

                                                <td>
                                                    {booking.name ||
                                                        "N/A"}
                                                </td>


                                                {/* PHONE */}

                                                <td>
                                                    {booking.phone ||
                                                        "N/A"}
                                                </td>


                                                {/* EMAIL */}

                                                <td>
                                                    {booking.email ||
                                                        "N/A"}
                                                </td>

                                               {/* ADDRESS */}

                                                <td>
                                                    {booking.address || "N/A"}
                                                </td>


                                                {/* ROOM */}

                                                <td>
                                                    {roomTitle}
                                                </td>


                                                {/* PRICE */}

                                                <td>
                                                    {price}
                                                </td>


                                                {/* BOOKING DATE */}

                                                <td>

                                                    {booking.createdAt
                                                        ? new Date(
                                                              booking.createdAt
                                                          ).toLocaleString()
                                                        : "N/A"}

                                                </td>


                                                {/* PAYMENT */}

                                                <td>

                                                    {booking.paymentStatus ===
                                                    "Paid" ? (

                                                        <span className="paid-status">

                                                            ✅ Paid

                                                            {booking.paymentMethod &&
                                                                ` - ${booking.paymentMethod}`}

                                                        </span>

                                                    ) : booking.paymentStatus ===
                                                      "Cash on Delivery" ? (

                                                        <span className="cod-status">

                                                            💵 Cash on Delivery

                                                        </span>

                                                    ) : (

                                                        <span className="pending-status">

                                                            ⏳ Pending

                                                        </span>

                                                    )}

                                                </td>


                                                {/* RATING & REVIEW */}

                                                <td>

                                                    {bookingRating ? (

                                                        <div className="booking-rating-box">

                                                            {/* STARS */}

                                                            <div className="booking-rating-stars">

                                                                {
                                                                    "★".repeat(
                                                                        Math.min(
                                                                            5,
                                                                            Math.max(
                                                                                0,
                                                                                Number(
                                                                                    bookingRating.rating
                                                                                ) || 0
                                                                            )
                                                                        )
                                                                    )
                                                                }

                                                                {
                                                                    "☆".repeat(
                                                                        5 -
                                                                        Math.min(
                                                                            5,
                                                                            Math.max(
                                                                                0,
                                                                                Number(
                                                                                    bookingRating.rating
                                                                                ) || 0
                                                                            )
                                                                        )
                                                                    )
                                                                }

                                                            </div>


                                                            {/* NUMBER */}

                                                            <div className="booking-rating-number">

                                                                {
                                                                    bookingRating.rating
                                                                }/5

                                                            </div>


                                                            {/* REVIEW */}

                                                            <div className="booking-rating-review">

                                                                <strong>
                                                                    Review:
                                                                </strong>

                                                                <p>

                                                                    {
                                                                        bookingRating.review
                                                                            ? bookingRating.review
                                                                            : "No review provided."
                                                                    }

                                                                </p>

                                                            </div>


                                                            {/* RATING DATE */}

                                                            {bookingRating.createdAt && (

                                                                <small>

                                                                    {new Date(
                                                                        bookingRating.createdAt
                                                                    ).toLocaleString()}

                                                                </small>

                                                            )}

                                                        </div>

                                                    ) : (

                                                        <span className="no-rating">

                                                            ⭐ No Rating Yet

                                                        </span>

                                                    )}

                                                </td>


                                                {/* DELETE */}

                                                <td>

                                                    <button
                                                        className="delete-btn"
                                                        onClick={() =>
                                                            deleteBooking(
                                                                booking._id
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </button>

                                                </td>

                                            </tr>

                                        );

                                    }
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </section>


            {/* ==================================================
                ENQUIRIES
            ================================================== */}

            <section className="admin-section">

                <div className="section-title">

                    <h2>
                        Customer Contact Enquiries
                    </h2>

                    <span>
                        {enquiries.length} Messages
                    </span>

                </div>


                {enquiries.length === 0 ? (

                    <div className="empty-box">

                        <h3>
                            No Enquiries Yet
                        </h3>

                        <p>
                            Contact form messages will appear here.
                        </p>

                    </div>

                ) : (

                    <div className="enquiry-admin-list">

                        {enquiries.map(
                            (enquiry, index) => (

                                <div
                                    className="admin-enquiry-card"
                                    key={enquiry._id || index}
                                >

                                    <div className="enquiry-content">

                                        <div className="customer-name">

                                            <h3>
                                                {enquiry.name}
                                            </h3>

                                            <span>
                                                {enquiry.createdAt
                                                 ? new Date(enquiry.createdAt).toLocaleString()
                                                 : "N/A"}
                                             </span>

                                        </div>


                                        <p>

                                            <strong>
                                                Email:
                                            </strong>{" "}

                                            {enquiry.email}

                                        </p>


                                        <p>

                                            <strong>
                                                Phone:
                                            </strong>{" "}

                                            {enquiry.phone}

                                        </p>

                                        
                                        <p>

                                            <strong>
                                                Address:
                                            </strong>{" "}

                                            {enquiry.address}

                                        </p>


                                        <div className="customer-message">

                                            <strong>
                                                Message:
                                            </strong>

                                            <p>
                                                {enquiry.message}
                                            </p>

                                        </div>

                                    </div>


                                    <button
                                        className="delete-btn"
                                        onClick={() =>
                                            deleteEnquiry(enquiry._id)}>Delete</button>

                                </div>

                            )
                        )}

                    </div>

                )}

            </section>


            {/* ==================================================
                RATING LOADING
            ================================================== */}

            {loadingRatings && (

                <div className="empty-box">

                    <h3>
                        Loading Ratings...
                    </h3>

                    <p>
                        Please wait.
                    </p>

                </div>

            )}

        </div>

    );
}

export default Admindashboard;