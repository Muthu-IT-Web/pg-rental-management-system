import "./Navbar.css";
import { Link } from "react-router-dom";

function Navbar() {
    return (
        <>        
        <div className="nav">
        <section className="nav1">
            <img src="pglogo.png"/>
        </section>
        <section className="navbar">
            <Link to="/home">HOME</Link>
            <Link to="/about">ABOUT US</Link>
            <Link to="/facilities">FACILITIES</Link>
            <Link to="/pg">PG ROOMS</Link>
            <Link to="/mybooking">MY BOOKING</Link>
            <Link to="/contact">CONTACT</Link>
            <Link to="/admindashboard">ADMIN</Link>
             
        </section>
        </div>
    </>    
    );
}

export default Navbar;