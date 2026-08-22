import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Pg.css";

function Pg() {

    const navigate = useNavigate();

    const [ratings, setRatings] = useState([]);


    // =====================================================
    // LOAD RATINGS FROM MONGODB
    // =====================================================

    useEffect(() => {

        const loadRatings = async () => {

            try {

                const response = await fetch(
                    "http://localhost:5000/api/ratings"
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch ratings");
                }

                const data = await response.json();

                setRatings(
                    Array.isArray(data) ? data : []
                );

            } catch (error) {

                console.error(
                    "Rating Fetch Error:",
                    error
                );

                setRatings([]);

            }

        };

        loadRatings();

    }, []);


    // =====================================================
    // ROOM LIST
    // =====================================================

    const rooms = [
        {
            image: "/room1.png",
            title: "1 Members Room",
            members: "1 Member",
            price: "₹10,000 / Month",
            type: "Shared Room",
            facilities: "Wi-Fi • Bed • Fan • Cupboard"
        },
        {
            image: "/room2.png",
            title: "2 Members Room",
            members: "2 Members",
            price: "₹13,000 / Month",
            type: "Shared Room",
            facilities: "Wi-Fi • Bed • Fan • Cupboard"
        },
        {
            image: "/room3.jpeg",
            title: "3 Members Room",
            members: "3 Members",
            price: "₹15,000 / Month",
            type: "Shared Room",
            facilities: "Wi-Fi • Bed • Fan • Cupboard"
        },
        {
            image: "/room4.png",
            title: "4 Members Room",
            members: "4 Members",
            price: "₹17,000 / Month",
            type: "Shared Room",
            facilities: "Wi-Fi • Bed • Fan • Cupboard"
        },
        {
            image: "/room5.png",
            title: "5 Members Room",
            members: "5 Members",
            price: "₹20,000 / Month",
            type: "Shared Room",
            facilities: "Wi-Fi • Bed • Fan • Cupboard"
        },
        {
            image: "/room6.png",
            title: "6 Members Room",
            members: "6 Members",
            price: "₹23,000 / Month",
            type: "Shared Room",
            facilities: "Wi-Fi • Bed • Fan • Cupboard"
        }
    ];


    // =====================================================
    // GET ROOM RATING
    // =====================================================

    const getRoomRating = (roomTitle) => {

        const roomRatings = ratings.filter(
            (item) => item.room === roomTitle
        );

        if (roomRatings.length === 0) {

            return {
                average: 0,
                count: 0
            };

        }


        const total = roomRatings.reduce(
            (sum, item) => sum + Number(item.rating),
            0
        );


        const average =
            total / roomRatings.length;


        return {
            average: average.toFixed(1),
            count: roomRatings.length
        };

    };


    // =====================================================
    // BOOK ROOM
    // =====================================================

    function bookRoom(room) {

        navigate(
            "/booking",
            {
                state: {
                    room: room
                }
            }
        );

    }


    // =====================================================
    // DISPLAY STARS
    // =====================================================

    const showStars = (rating) => {

        const roundedRating = Math.round(
            Number(rating)
        );

        return [1, 2, 3, 4, 5].map(
            (star) => (
                <span key={star}>
                    {star <= roundedRating
                        ? "★"
                        : "☆"}
                </span>
            )
        );

    };


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div className="pg-page">


            <div className="pg-heading">

                <h1>
                    PG Rooms
                </h1>

                <p>
                    Choose a comfortable and affordable room
                    that suits your needs.
                </p>

            </div>


            <div className="room-container">

                {rooms.map((room, index) => {

                    const roomRating =
                        getRoomRating(room.title);


                    return (

                        <div
                            className="room-card"
                            key={index}
                        >


                            {/* ROOM IMAGE */}

                            <div className="room-image">

                                <img
                                    src={room.image}
                                    alt={room.title}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src =
                                            "/room.png";
                                    }}
                                />

                            </div>


                            <div className="room-details">


                                <h2>
                                    {room.title}
                                </h2>


                                <p className="room-type">
                                    🏠 {room.type}
                                </p>


                                <p>
                                    👥 {room.members}
                                </p>


                                <p className="facilities">
                                    ✨ {room.facilities}
                                </p>


                                <h3>
                                    {room.price}
                                </h3>


                                {/* =================================
                                    RATING
                                ================================= */}

                                <div className="room-rating">

                                    {roomRating.count > 0 ? (

                                        <>
                                            <div className="rating-stars">

                                                {showStars(
                                                    roomRating.average
                                                )}

                                            </div>

                                            <span className="rating-number">

                                                {roomRating.average}/5

                                            </span>

                                            <span className="rating-count">

                                                ({roomRating.count} review
                                                {roomRating.count > 1
                                                    ? "s"
                                                    : ""})

                                            </span>

                                        </>

                                    ) : (

                                        <span className="no-rating">

                                            ⭐ No ratings yet

                                        </span>

                                    )}

                                </div>


                                {/* BOOK BUTTON */}

                                <button
                                    onClick={() =>
                                        bookRoom(room)
                                    }
                                >
                                    Book Now
                                </button>


                            </div>

                        </div>

                    );

                })}

            </div>

        </div>

    );

}

export default Pg;