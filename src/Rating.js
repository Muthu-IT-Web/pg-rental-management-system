import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Rating.css";

function Rating() {

    const navigate = useNavigate();
    const location = useLocation();

    // Get customer details from Payment page
    const ratingData = location.state || {};

    const [form, setForm] = useState({
        name: ratingData.name || "",
        email: ratingData.email || "",
        room: ratingData.room || "",
        rating: 0,
        review: ""
    });

    const [hoverRating, setHoverRating] = useState(0);

    // =========================================
    // INPUT CHANGE
    // =========================================

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

    };

    // =========================================
    // SUBMIT RATING
    // =========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (form.rating === 0) {

            alert("Please select a rating!");

            return;
        }

        try {

            const response = await fetch(
                "http://localhost:5000/api/ratings",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        ...form,
                        rating: Number(form.rating)
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Rating submission failed"
                );

            }

            alert(
                "Thank you! Your rating has been submitted ⭐"
            );

            // Clear rating and review only
            // Keep customer details
            setForm({
                name: form.name,
                email: form.email,
                room: form.room,
                rating: 0,
                review: ""
            });

            navigate("/");

        } catch (error) {

            console.error(
                "Rating Error:",
                error
            );

            alert(
                error.message ||
                "Rating submission failed. Please try again."
            );

        }

    };

    // =========================================
    // PAGE
    // =========================================

    return (

        <div className="rating-page">

            <div className="rating-card">

                <h1>
                    Rate Your PG Experience ⭐
                </h1>

                <p className="rating-subtitle">
                    Your feedback helps us improve our service.
                </p>

                <form onSubmit={handleSubmit}>

                    {/* NAME */}

                    <label>
                        Your Name
                    </label>

                    <input
                        type="text"
                        name="name"
                        placeholder="Enter your name"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />


                    {/* EMAIL */}

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


                    {/* ROOM */}

                    <label>
                        Room
                    </label>

                    <input
                        type="text"
                        name="room"
                        placeholder="Enter room name"
                        value={form.room}
                        onChange={handleChange}
                        required
                    />


                    {/* RATING */}

                    <label>
                        Your Rating
                    </label>

                    <div className="stars">

                        {[1, 2, 3, 4, 5].map(
                            (star) => (

                                <button
                                    type="button"
                                    key={star}
                                    className="star-button"

                                    onMouseEnter={() =>
                                        setHoverRating(star)
                                    }

                                    onMouseLeave={() =>
                                        setHoverRating(0)
                                    }

                                    onClick={() =>
                                        setForm({
                                            ...form,
                                            rating: star
                                        })
                                    }
                                >

                                    {star <=
                                    (
                                        hoverRating ||
                                        form.rating
                                    )
                                        ? "★"
                                        : "☆"}

                                </button>

                            )
                        )}

                    </div>


                    {/* REVIEW */}

                    <label>
                        Your Review
                    </label>

                    <textarea
                        name="review"
                        placeholder="Write your review..."
                        value={form.review}
                        onChange={handleChange}
                        rows="5"
                    ></textarea>


                    {/* SUBMIT */}

                    <button
                        type="submit"
                        className="submit-rating"
                    >
                        Submit Rating
                    </button>

                </form>

            </div>

        </div>

    );

}

export default Rating;