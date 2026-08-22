import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Payment.css";

function Payment() {

    const navigate = useNavigate();
    const location = useLocation();

    const roomData = location.state?.room;
    const bookingData = location.state?.booking;

    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [completedPayment, setCompletedPayment] = useState(null);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        name: "",
        phone: "",
        email: "",
        room: "",
        amount: "",
        paymentMethod: "",
        upi: "",
        cardName: "",
        cardNumber: "",
        expiry: "",
        cvv: "",
        bank: ""
    });


    // =========================================
    // GET ROOM TITLE
    // =========================================

    const getRoomTitle = () => {

        return (
            roomData?.title ||
            bookingData?.room?.title ||
            bookingData?.room ||
            bookingData?.roomTitle ||
            ""
        );

    };


    // =========================================
    // GET ROOM AMOUNT
    // =========================================

    const getRoomAmount = (roomTitle) => {

        if (
            roomTitle === "1 Members Room"
        ) {
            return "10000";
        }

        if (
            roomTitle === "2 Members Room"
        ) {
            return "13000";
        }

        if (
            roomTitle === "3 Members Room"
        ) {
            return "15000";
        }

        if (
            roomTitle === "4 Members Room"
        ) {
            return "17000";
        }

        if (
            roomTitle === "5 Members Room"
        ) {
            return "20000";
        }

        if (
            roomTitle === "6 Members Room"
        ) {
            return "23000";
        }

        // Old room names also supported

        if (
            roomTitle === "Single Bed Room" ||
            roomTitle === "1 Bed Room" ||
            roomTitle === "1 Bed"
        ) {
            return "6000";
        }

        if (
            roomTitle === "2 Bed Room" ||
            roomTitle === "2 Bed"
        ) {
            return "5500";
        }

        if (
            roomTitle === "3 Bed Room" ||
            roomTitle === "3 Bed"
        ) {
            return "5000";
        }

        return "";
    };


    // =========================================
    // CLEAN PRICE
    // =========================================

    const cleanAmount = (price) => {

        if (!price) {
            return "";
        }

        return String(price)
            .replace(/₹/g, "")
            .replace(/,/g, "")
            .replace(/\/ Month/gi, "")
            .replace(/\/Month/gi, "")
            .trim();

    };


    // =========================================
    // AUTO FILL BOOKING DETAILS
    // =========================================

    useEffect(() => {

        const selectedRoom = getRoomTitle();

        let selectedAmount =
            roomData?.price ||
            bookingData?.room?.price ||
            bookingData?.amount ||
            "";

        selectedAmount = cleanAmount(selectedAmount);

        if (!selectedAmount) {
            selectedAmount = getRoomAmount(selectedRoom);
        }

        setForm(prev => ({
            ...prev,

            name:
                bookingData?.customer?.name ||
                bookingData?.name ||
                "",

            phone:
                bookingData?.customer?.phone ||
                bookingData?.phone ||
                "",

            email:
                bookingData?.customer?.email ||
                bookingData?.email ||
                "",

            room: selectedRoom,

            amount: selectedAmount
        }));

    }, [roomData, bookingData]);


    // =========================================
    // INPUT CHANGE
    // =========================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setForm(prev => ({
            ...prev,
            [name]: value
        }));

    };


    // =========================================
    // PAYMENT
    // =========================================

    const handlePayment = async (e) => {

        e.preventDefault();

        // -----------------------------------------
        // GET BOOKING ID
        // -----------------------------------------

        const bookingId =
            bookingData?._id ||
            bookingData?.id ||
            "";


        if (!bookingId) {

            alert(
                "Booking ID not found. Please go back to My Booking and try again."
            );

            return;
        }


        // =========================================
        // BASIC VALIDATION
        // =========================================

        if (
            !form.name ||
            !form.phone ||
            !form.email ||
            !form.room ||
            !form.amount ||
            !form.paymentMethod
        ) {

            alert(
                "Please fill all required details."
            );

            return;
        }


        // =========================================
        // UPI VALIDATION
        // =========================================

        if (
            form.paymentMethod === "UPI" &&
            !form.upi
        ) {

            alert(
                "Please enter your UPI ID."
            );

            return;
        }


        // =========================================
        // CARD VALIDATION
        // =========================================

        if (
            form.paymentMethod === "Card" &&
            (
                !form.cardName ||
                !form.cardNumber ||
                !form.expiry ||
                !form.cvv
            )
        ) {

            alert(
                "Please fill all card details."
            );

            return;
        }


        if (
            form.paymentMethod === "Card" &&
            !/^\d{16}$/.test(form.cardNumber)
        ) {

            alert(
                "Card number must contain 16 digits."
            );

            return;
        }


        if (
            form.paymentMethod === "Card" &&
            !/^\d{3}$/.test(form.cvv)
        ) {

            alert(
                "CVV must contain 3 digits."
            );

            return;
        }


        // =========================================
        // NET BANKING VALIDATION
        // =========================================

        if (
            form.paymentMethod === "Net Banking" &&
            !form.bank
        ) {

            alert(
                "Please select your bank."
            );

            return;
        }


        // =========================================
        // PAYMENT STATUS
        // =========================================

        const paymentStatus =
            form.paymentMethod === "Cash on Delivery"
                ? "Cash on Delivery"
                : "Paid";


        const paymentDate =
            new Date().toLocaleString();


        // =========================================
        // PAYMENT DATA FOR FRONTEND
        // =========================================

        const paymentData = {

            name: form.name,

            phone: form.phone,

            email: form.email,

            room: form.room,

            amount: form.amount,

            method: form.paymentMethod,

            paymentMethod: form.paymentMethod,

            status: paymentStatus,

            date: paymentDate,

            upi: form.upi,

            cardName: form.cardName,

            cardNumber: form.cardNumber,

            expiry: form.expiry,

            cvv: form.cvv,

            bank: form.bank,

            bookingId: bookingId

        };


        // =========================================
        // START PAYMENT
        // =========================================

        try {

            setLoading(true);


            // =====================================
            // SAVE PAYMENT TO MONGODB
            // =====================================

            const paymentResponse = await fetch(
                "http://localhost:5000/api/payments",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        name: form.name,

                        phone: form.phone,

                        email: form.email,

                        room: form.room,

                        amount: Number(form.amount),

                        paymentMethod:
                            form.paymentMethod,

                        upi: form.upi,

                        cardName:
                            form.cardName,

                        cardNumber:
                            form.cardNumber,

                        expiry:
                            form.expiry,

                        cvv:
                            form.cvv,

                        bank:
                            form.bank,

                        bookingId:
                            bookingId

                    })
                }
            );

const paymentText = await paymentResponse.text();

let paymentResult = {};

try {
    paymentResult = paymentText
        ? JSON.parse(paymentText)
        : {};
} catch (error) {

    console.error(
        "Payment API returned non-JSON:",
        paymentText
    );

    throw new Error(
        "Payment server error. Please check backend server and /api/payments route."
    );
}

if (!paymentResponse.ok) {

    throw new Error(
        paymentResult.message ||
        "Payment could not be saved."
    );

}

            // =====================================
            // UPDATE BOOKING IN MONGODB
            // =====================================

            const bookingResponse = await fetch(

                `http://localhost:5000/api/bookings/${bookingId}`,

                {

                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        paymentStatus:
                            paymentStatus,

                        paymentMethod:
                            form.paymentMethod,

                        paymentDate:
                            new Date()

                    })

                }

            );


            const bookingText = await bookingResponse.text();

let bookingResult = {};

try {
    bookingResult = bookingText
        ? JSON.parse(bookingText)
        : {};
} catch (error) {
    console.error(
        "Booking API returned non-JSON:",
        bookingText
    );

    bookingResult = {
        message: bookingText
    };
}

if (!bookingResponse.ok) {

    console.error(
        "Booking payment update failed:",
        bookingResult
    );

} else {

    console.log(
        "Booking updated:",
        bookingResult
    );

}


            // =====================================
            // LOCAL STORAGE - PAYMENT
            // =====================================

            const oldPayments =
                JSON.parse(
                    localStorage.getItem("payments")
                ) || [];


            const finalPaymentData = {

                ...paymentData,

                _id:
                    paymentResult.payment?._id ||
                    paymentResult._id ||
                    ""

            };


            localStorage.setItem(

                "payments",

                JSON.stringify([
                    ...oldPayments,
                    finalPaymentData
                ])

            );


            localStorage.setItem(

                "payment",

                JSON.stringify(
                    finalPaymentData
                )

            );


            // =====================================
            // UPDATE OLD LOCAL BOOKINGS
            // =====================================

            const oldBookings =
                JSON.parse(
                    localStorage.getItem("bookings")
                ) || [];


            const updatedBookings =
                oldBookings.map(
                    (booking) => {

                        const currentId =
                            booking._id ||
                            booking.id ||
                            "";

                        if (
                            currentId === bookingId
                        ) {

                            return {

                                ...booking,

                                paymentStatus:
                                    paymentStatus,

                                paymentMethod:
                                    form.paymentMethod,

                                paymentDate:
                                    paymentDate

                            };

                        }

                        return booking;

                    }
                );


            localStorage.setItem(

                "bookings",

                JSON.stringify(
                    updatedBookings
                )

            );


            // =====================================
            // SUCCESS ALERT
            // =====================================

            if (
                form.paymentMethod ===
                "Cash on Delivery"
            ) {

                alert(
                    "Booking Confirmed! Payment will be collected in cash."
                );

            }
            else {

                alert(
                    `${form.paymentMethod} Payment Successful!`
                );

            }


            // =====================================
            // SHOW SUCCESS SCREEN
            // =====================================

            setCompletedPayment(
                finalPaymentData
            );

            setPaymentSuccess(true);

        }

        catch (error) {

            console.error(
                "Payment Error:",
                error
            );

            alert(
                error.message ||
                "Payment save failed. Please make sure backend and MongoDB are running."
            );

        }

        finally {

            setLoading(false);

        }

    };


    // =========================================
    // SUCCESS SCREEN
    // =========================================

    if (paymentSuccess) {

        return (

            <div className="payment-page">

                <div className="payment-container success-container">

                    <div className="success-icon">

                        {
                            completedPayment?.status ===
                            "Cash on Delivery"
                                ? "💵"
                                : "✅"
                        }

                    </div>


                    <h1>
                        Booking Confirmed!
                    </h1>


                    <h2>

                        {
                            completedPayment?.status ===
                            "Cash on Delivery"

                                ? "Booking Successfully Confirmed"

                                : "Payment Successful"

                        }

                    </h2>


                    <p className="payment-subtitle">

                        Thank you for choosing
                        PG Rental.

                    </p>


                    {completedPayment && (

                        <div className="success-details">

                            <p>

                                <strong>
                                    Name:
                                </strong>{" "}

                                {completedPayment.name}

                            </p>


                            <p>

                                <strong>
                                    Room:
                                </strong>{" "}

                                {completedPayment.room}

                            </p>


                            <p>

                                <strong>
                                    Amount:
                                </strong>{" "}

                                ₹
                                {completedPayment.amount}

                            </p>


                            <p>

                                <strong>
                                    Payment Method:
                                </strong>{" "}

                                {completedPayment.paymentMethod}

                            </p>


                            <p>

                                <strong>
                                    Status:
                                </strong>{" "}

                                {completedPayment.status}

                            </p>


                            <p>

                                <strong>
                                    Date:
                                </strong>{" "}

                                {completedPayment.date}

                            </p>

                        </div>

                    )}


                    {/* RATING */}

                    <button
                        className="rating-button"
                        onClick={() => {

                            navigate(
                                "/rating",
                                {
                                    state: {

                                        name:
                                            completedPayment?.name,

                                        email:
                                            completedPayment?.email,

                                        room:
                                            completedPayment?.room

                                    }
                                }
                            );

                        }}
                    >

                        ⭐ Give Rating & Review

                    </button>


                    {/* MY BOOKINGS */}

                    <button
                        className="booking-button"
                        onClick={() =>
                            navigate(
                                "/mybooking"
                            )
                        }
                    >

                        📋 View My Bookings

                    </button>


                    {/* HOME */}

                    <button
                        className="home-button"
                        onClick={() =>
                            navigate("/home")
                        }
                    >

                        🏠 Back to Home

                    </button>

                </div>

            </div>

        );

    }


    // =========================================
    // PAYMENT FORM
    // =========================================

    return (

        <div className="payment-page">

            <div className="payment-container">

                <h1>
                    PG Rental Payment
                </h1>

                <p className="payment-subtitle">

                    Complete your payment to confirm
                    your PG booking

                </p>


                <form onSubmit={handlePayment}>


                    {/* CUSTOMER */}

                    <h2>
                        Customer Details
                    </h2>


                    <div className="form-group">

                        <label>
                            Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your name"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    <div className="form-group">

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

                    </div>


                    <div className="form-group">

                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            placeholder="Enter email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    {/* ROOM */}

                    <h2>
                        Room Details
                    </h2>


                    <div className="form-group">

                        <label>
                            Selected Room
                        </label>

                        <input
                            type="text"
                            name="room"
                            value={form.room}
                            readOnly
                            placeholder="Selected room will appear here"
                        />

                    </div>


                    {/* AMOUNT */}

                    {form.amount && (

                        <div className="amount-box">

                            <span>
                                Total Amount
                            </span>

                            <strong>
                                ₹{form.amount} / Month
                            </strong>

                        </div>

                    )}


                    {/* PAYMENT METHOD */}

                    <h2>
                        Payment Method
                    </h2>


                    <div className="payment-methods">

                        <label>

                            <input
                                type="radio"
                                name="paymentMethod"
                                value="UPI"
                                checked={
                                    form.paymentMethod ===
                                    "UPI"
                                }
                                onChange={handleChange}
                            />

                            UPI

                        </label>


                        <label>

                            <input
                                type="radio"
                                name="paymentMethod"
                                value="Card"
                                checked={
                                    form.paymentMethod ===
                                    "Card"
                                }
                                onChange={handleChange}
                            />

                            Credit / Debit Card

                        </label>


                        <label>

                            <input
                                type="radio"
                                name="paymentMethod"
                                value="Net Banking"
                                checked={
                                    form.paymentMethod ===
                                    "Net Banking"
                                }
                                onChange={handleChange}
                            />

                            Net Banking

                        </label>


                        <label className="cash-option">

                            <input
                                type="radio"
                                name="paymentMethod"
                                value="Cash on Delivery"
                                checked={
                                    form.paymentMethod ===
                                    "Cash on Delivery"
                                }
                                onChange={handleChange}
                            />

                            💵 Cash on Delivery

                        </label>

                    </div>


                    {/* COD */}

                    {
                        form.paymentMethod ===
                        "Cash on Delivery" && (

                            <div className="cod-box">

                                <h3>
                                    💵 Cash on Delivery
                                </h3>

                                <p>

                                    You can pay the PG amount
                                    directly in cash when you
                                    arrive at the PG.

                                </p>

                                <strong>

                                    Amount to Pay:
                                    ₹{form.amount}

                                </strong>

                            </div>

                        )
                    }


                    {/* UPI */}

                    {
                        form.paymentMethod ===
                        "UPI" && (

                            <div className="extra-payment">

                                <label>
                                    UPI ID
                                </label>

                                <input
                                    type="text"
                                    name="upi"
                                    placeholder="example@upi"
                                    value={form.upi}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                        )
                    }


                    {/* CARD */}

                    {
                        form.paymentMethod ===
                        "Card" && (

                            <div className="extra-payment">

                                <label>
                                    Card Holder Name
                                </label>

                                <input
                                    type="text"
                                    name="cardName"
                                    placeholder="Enter card holder name"
                                    value={form.cardName}
                                    onChange={handleChange}
                                    required
                                />


                                <label>
                                    Card Number
                                </label>

                                <input
                                    type="text"
                                    name="cardNumber"
                                    placeholder="1234567890123456"
                                    maxLength="16"
                                    value={form.cardNumber}
                                    onChange={handleChange}
                                    required
                                />


                                <div className="card-row">

                                    <div>

                                        <label>
                                            Expiry Date
                                        </label>

                                        <input
                                            type="text"
                                            name="expiry"
                                            placeholder="MM/YY"
                                            value={form.expiry}
                                            onChange={handleChange}
                                            required
                                        />

                                    </div>


                                    <div>

                                        <label>
                                            CVV
                                        </label>

                                        <input
                                            type="password"
                                            name="cvv"
                                            placeholder="CVV"
                                            maxLength="3"
                                            value={form.cvv}
                                            onChange={handleChange}
                                            required
                                        />

                                    </div>

                                </div>

                            </div>

                        )
                    }


                    {/* NET BANKING */}

                    {
                        form.paymentMethod ===
                        "Net Banking" && (

                            <div className="extra-payment">

                                <label>
                                    Select Bank
                                </label>

                                <select
                                    name="bank"
                                    value={form.bank}
                                    onChange={handleChange}
                                    required
                                >

                                    <option value="">
                                        Select Bank
                                    </option>

                                    <option value="SBI">
                                        State Bank of India
                                    </option>

                                    <option value="HDFC">
                                        HDFC Bank
                                    </option>

                                    <option value="ICICI">
                                        ICICI Bank
                                    </option>

                                    <option value="Axis">
                                        Axis Bank
                                    </option>

                                    <option value="Canara">
                                        Canara Bank
                                    </option>

                                </select>

                            </div>

                        )
                    }


                    {/* PAY BUTTON */}

                    <button
                        type="submit"
                        className="pay-button"
                        disabled={loading}
                    >

                        {
                            loading
                                ? "Processing Payment..."
                                : form.paymentMethod ===
                                  "Cash on Delivery"

                                    ? `Confirm Booking - ₹${form.amount || "0"}`

                                    : `Pay ₹${form.amount || "0"}`
                        }

                    </button>

                </form>

            </div>

        </div>

    );

}

export default Payment;