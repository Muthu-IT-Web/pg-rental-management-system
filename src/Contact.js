import React, { useState } from "react";
import "./Contact.css";

function Contact() {

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        address:"",
        message: ""
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

    e.preventDefault();

    try {

        const response = await fetch(
            "https://pg-rental-management-system.onrender.com/api/contacts",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(form)
            }
        );

        const data = await response.json();

        if (!response.ok) {

            throw new Error(
                data.message || "Failed to submit enquiry"
            );

        }

        alert(
            "Thank you! Your enquiry has been submitted."
        );

        setForm({
            name: "",
            email: "",
            phone: "",
            address:"",
            message: ""
        });

    } catch (error) {

        console.error(
            "Contact Submit Error:",
            error
        );

        alert(
            "Failed to submit enquiry. Please try again."
        );

    }
};


    return (
        <div className="contact-page">

            <div className="contact-header">
                <h1>Contact Us</h1>
                <p>
                    Have questions about our PG rooms? Get in touch with us.
                </p>
            </div>

            <div className="contact-container">

                {/* Contact Details */}
                <div className="contact-info">

                    <h2>Get In Touch</h2>

                    <p>
                        We are here to help you find a comfortable,
                        safe and affordable PG accommodation.
                    </p>

                    <div className="info-box">
                        <span>📍</span>
                        <div>
                            <h3>Address</h3>
                            <p>
                                PG Rental Management,<br />
                                Main Road, Tuticorin,<br />
                                Tamil Nadu - 628001
                            </p>
                        </div>
                    </div>

                    <div className="info-box">
                        <span>📞</span>
                        <div>
                            <h3>Phone</h3>
                            <p>+91 98765 43210</p>
                        </div>
                    </div>

                    <div className="info-box">
                        <span>✉️</span>
                        <div>
                            <h3>Email</h3>
                            <p>pgrental@gmail.com</p>
                        </div>
                    </div>

                    <div className="info-box">
                        <span>🕒</span>
                        <div>
                            <h3>Working Hours</h3>
                            <p>Monday - Saturday</p>
                            <p>9:00 AM - 7:00 PM</p>
                        </div>
                    </div>

                </div>

                {/* Contact Form */}
                <div className="contact-form">

                    <h2>Send Us a Message</h2>

                    <form onSubmit={handleSubmit}>

                        <label>Name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your name"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />

                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />

                        <label>Phone Number</label>
                        <input
                            type="tel"
                            name="phone"
                            placeholder="Enter your phone number"
                            value={form.phone}
                            onChange={handleChange}
                            required
                        />

                         <label>Address</label>
                        <input
                            type="text"
                            name="address"
                            placeholder="Enter your address"
                            value={form.address}
                            onChange={handleChange}
                            required
                        />

                        <label>Message</label>
                        <textarea
                            name="message"
                            placeholder="Write your message..."
                            value={form.message}
                            onChange={handleChange}
                            required
                        ></textarea>

                        <button type="submit">
                            Send Message
                        </button>

                    </form>

                </div>

            </div>

        </div>
    );
}

export default Contact;