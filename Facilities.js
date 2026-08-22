import React, { useState } from "react";
import "./Facilities.css";

function Facilities() {

    const [selectedFacility, setSelectedFacility] = useState(null);

    const facilities = [

        {
            icon: "📶",
            title: "Free Wi-Fi",
            description: "High-speed Wi-Fi facility available throughout the PG.",
            details: "Enjoy unlimited high-speed Wi-Fi in your room and common areas. Perfect for students and working professionals."
        },

        {
            icon: "🍽️",
            title: "Food Facility",
            description: "Healthy and hygienic breakfast, lunch and dinner provided.",
            details: "Fresh and hygienic food is provided every day with breakfast, lunch and dinner. Vegetarian and non-vegetarian options are available."
        },

        {
            icon: "❄️",
            title: "AC Rooms",
            description: "Comfortable and well-maintained air-conditioned rooms.",
            details: "Our AC rooms provide a comfortable environment with well-maintained air conditioning and spacious sleeping areas."
        },

        {
            icon: "🧺",
            title: "Laundry",
            description: "Easy and convenient laundry facility for residents.",
            details: "Residents can use our convenient laundry facility to wash and maintain their clothes easily."
        },

        {
            icon: "🚗",
            title: "Parking",
            description: "Safe and spacious parking facility for bikes and cars.",
            details: "Separate and secure parking space is available for residents' bikes and cars."
        },

        {
            icon: "📹",
            title: "24/7 CCTV",
            description: "Complete security with CCTV surveillance in common areas.",
            details: "24/7 CCTV surveillance is available in entrances, corridors and common areas for better resident safety."
        },

        {
            icon: "⚡",
            title: "Power Backup",
            description: "24/7 power backup to ensure uninterrupted services.",
            details: "Our backup power system helps residents continue their daily activities even during power cuts."
        },

        {
            icon: "🛏️",
            title: "Furnished Rooms",
            description: "Rooms equipped with beds, cupboards, tables and chairs.",
            details: "Rooms come with essential furniture including beds, cupboards, study tables and chairs."
        },

        {
            icon: "🧹",
            title: "Housekeeping",
            description: "Regular cleaning and housekeeping services available.",
            details: "Regular cleaning services are provided to maintain a clean, hygienic and comfortable living environment."
        },

        {
            icon: "💧",
            title: "24/7 Water Facility",
            description: "Clean and continuous water supply available for residents.",
            details: "24/7 water supply is available for drinking, bathing, washing and other daily needs. Clean and hygienic water facilities are maintained for all residents."
        },

        {
            icon: "🛋️",
            title: "Common Room",
            description: "Spacious common area for relaxation and social activities.",
            details: "Residents can relax, watch TV, spend time with friends and enjoy various activities in the comfortable common room."
        },

        {
            icon: "🏋️",
            title: "Gym & Fitness",
            description: "Basic fitness equipment available for residents.",
            details: "Residents can use the fitness area to maintain their health and stay active. Basic workout equipment is available for daily exercise."
        }

    ];


    // =========================
    // SHOW DETAILS
    // =========================

    function showDetails(facility) {
        setSelectedFacility(facility);
    }


    // =========================
    // CLOSE DETAILS
    // =========================

    function closeDetails() {
        setSelectedFacility(null);
    }


    return (

        <div className="facilities-page">


            {/* =========================
                HEADER
            ========================= */}

            <section className="facilities-header">

                <h1>
                    PG Facilities
                </h1>

                <p>
                    Enjoy a comfortable, safe and convenient stay
                    with our modern PG facilities.
                </p>

            </section>


            {/* =========================
                FACILITIES
            ========================= */}

            <section className="facilities-container">

                {facilities.map((facility, index) => (

                    <div
                        className="facility-card"
                        key={index}
                    >

                        <div className="facility-icon">
                            {facility.icon}
                        </div>


                        <h2>
                            {facility.title}
                        </h2>


                        <p>
                            {facility.description}
                        </p>


                        <button
                            onClick={() =>
                                showDetails(facility)
                            }
                        >
                            View Details
                        </button>

                    </div>

                ))}

            </section>


            {/* =========================
                DETAILS POPUP
            ========================= */}

            {selectedFacility && (

                <div
                    className="facility-overlay"
                    onClick={closeDetails}
                >

                    <div
                        className="facility-details"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <button
                            className="close-btn"
                            onClick={closeDetails}
                        >
                            ✕
                        </button>


                        <div className="details-icon">
                            {selectedFacility.icon}
                        </div>


                        <h2>
                            {selectedFacility.title}
                        </h2>


                        <p>
                            {selectedFacility.details}
                        </p>


                        <button
                            className="back-btn"
                            onClick={closeDetails}
                        >
                            Close
                        </button>

                    </div>

                </div>

            )}

        </div>

    );
}

export default Facilities;