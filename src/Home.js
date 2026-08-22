
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {

    const navigate = useNavigate();

    return (
        <div className="home">

            <section className="hero">

                <div className="hero-content">

                    <h1>Welcome to PG Rental Management</h1>

                    <p>
                        Find your perfect PG accommodation with comfortable
                        rooms, modern facilities and affordable pricing.
                    </p>

                    <button
                        className="hero-btn"
                        onClick={() => navigate("/pg")}
                    >
                        Explore PG Rooms
                    </button>

                </div>

                <div className="hero-image">
                    <img src="/pglogo.png" alt="PG Room" />
                </div>

            </section>


            <section className="about-home">

                <h2>Find Your Perfect PG</h2>

                <p>
                    Our PG Rental Management System makes it easy to find
                    comfortable and affordable accommodation. Explore
                    available rooms, check facilities, compare pricing and
                    choose the PG that suits your needs.
                </p>

            </section>


            <section className="features">

                <h2>Why Choose Us?</h2>

                <div className="feature-container">

                    <div className="feature-card">
                        <div className="feature-icon">🏠</div>
                        <h3>Comfortable Rooms</h3>
                        <p>
                            Clean, spacious and comfortable rooms
                            for a pleasant stay.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">🛏️</div>
                        <h3>Quality Facilities</h3>
                        <p>
                            Enjoy essential facilities and
                            a convenient living environment.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">💰</div>
                        <h3>Affordable Pricing</h3>
                        <p>
                            Choose suitable rooms at affordable
                            and reasonable prices.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">🔒</div>
                        <h3>Safe & Secure</h3>
                        <p>
                            We provide a safe and secure environment
                            for all our residents.
                        </p>
                    </div>

                </div>

            </section>


            <section className="how-section">

                <h2>How It Works</h2>

                <div className="steps">

                    <div className="step">
                        <span>1</span>
                        <h3>Choose a PG</h3>
                        <p>Browse available PG rooms.</p>
                    </div>

                    <div className="step">
                        <span>2</span>
                        <h3>Check Details</h3>
                        <p>View room facilities and pricing.</p>
                    </div>

                    <div className="step">
                        <span>3</span>
                        <h3>Book Your Room</h3>
                        <p>Select the room that suits you.</p>
                    </div>

                </div>

            </section>


            <section className="home-cta">

                <h2>Looking for a Comfortable PG?</h2>

                <p>
                    Explore our available rooms and find your
                    ideal place to stay.
                </p>

                <button onClick={() => navigate("/pg")}>
                    View PG Rooms
                </button>

            </section>

        </div>
    );
}

export default Home;

