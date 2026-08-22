import React from "react";
import "./About.css";

function About() {
    return (
        <div className="about-page">

            {/* Hero Section */}
            <section className="about-hero">
                <div className="about-hero-content">
                    <h1>About PG Rental Management</h1>
                    <p>
                        Find comfortable, affordable and secure PG
                        accommodation that feels like home.
                    </p>
                </div>
            </section>


            {/* About Content */}
            <section className="about-content">

                <div className="about-image">
                    <img src="/room1.png" alt="PG Room" />
                </div>

                <div className="about-text">
                    <h2>Who We Are</h2>

                    <p>
                        PG Rental Management is a user-friendly platform
                        designed to make finding and booking a comfortable
                        PG accommodation simple and convenient.
                    </p>

                    <p>
                        We provide a variety of room options suitable for
                        students and working professionals. Users can easily
                        explore rooms, check facilities, compare prices and
                        choose the accommodation that best suits their needs.
                    </p>

                    <p>
                        Our goal is to provide a comfortable, safe and
                        affordable living experience for every resident.
                    </p>
                </div>

            </section>


            {/* Mission & Vision */}
            <section className="mission-section">

                <h2>Our Mission & Vision</h2>

                <div className="mission-container">

                    <div className="mission-card">
                        <div className="mission-icon">🎯</div>
                        <h3>Our Mission</h3>
                        <p>
                            To make PG accommodation searching and booking
                            simple, transparent and convenient for everyone.
                        </p>
                    </div>

                    <div className="mission-card">
                        <div className="mission-icon">👁️</div>
                        <h3>Our Vision</h3>
                        <p>
                            To become a trusted platform for finding safe,
                            comfortable and affordable PG accommodation.
                        </p>
                    </div>

                </div>

            </section>


            {/* Why Choose Us */}
            <section className="about-features">

                <h2>Why Choose Our PG?</h2>

                <div className="about-feature-container">

                    <div className="about-feature-card">
                        <span>🏠</span>
                        <h3>Comfortable Stay</h3>
                        <p>
                            Clean and spacious rooms designed for a
                            comfortable living experience.
                        </p>
                    </div>

                    <div className="about-feature-card">
                        <span>💰</span>
                        <h3>Affordable Prices</h3>
                        <p>
                            Reasonable room prices suitable for different
                            budgets and requirements.
                        </p>
                    </div>

                    <div className="about-feature-card">
                        <span>🛡️</span>
                        <h3>Safe Environment</h3>
                        <p>
                            A secure and peaceful environment for students
                            and working professionals.
                        </p>
                    </div>

                    <div className="about-feature-card">
                        <span>📋</span>
                        <h3>Easy Booking</h3>
                        <p>
                            Easily explore available rooms and book your
                            preferred PG accommodation.
                        </p>
                    </div>

                </div>

            </section>


            {/* Final Section */}
            <section className="about-bottom">

                <h2>Your Comfortable Stay Starts Here</h2>

                <p>
                    Explore our PG rooms, check facilities and choose
                    the right accommodation for your needs.
                </p>

            </section>

        </div>
    );
}

export default About;