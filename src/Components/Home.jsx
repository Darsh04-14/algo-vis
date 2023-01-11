import React from "react";
import './style.css';
import Navbar from "./Navbar.jsx";

function Home() {
    return (
        <div>
            <Navbar/>
            <div className="home-body">
                <h1>//Home Page</h1>
                <p>/*Click one of the buttons in the navbar to get started!*/</p>
            </div>
        </div>
    )
}

export default Home;