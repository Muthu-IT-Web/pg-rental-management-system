import { Routes, Route } from "react-router-dom";

import Home from "./Home.js";
import Pg from "./Pg.js";
import Booking from "./Booking.js";
import Mybooking from "./Mybooking.js";
import Rating from "./Rating";
import Payment from "./Payment.js";
import Facilities from "./Facilities.js";
import About from "./About.js";
import Contact from "./Contact.js";
import Admindashboard from "./Admindashboard.js";
import Navbar from "./Navbar.js";

function App() {
    return (
        <>
            <Navbar />

            <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/pg" element={<Pg />} />
                <Route path="/booking" element={<Booking/>} />
                <Route path="/mybooking" element={<Mybooking />} />
                <Route path="/rating" element={<Rating />} />
                 <Route path="/payment" element={<Payment />} />
                <Route path="/facilities" element={<Facilities />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/admindashboard" element={<Admindashboard />} />
                </Routes>
        </>
    );
}

export default App;