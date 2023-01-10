import React from 'react';
import {Link} from "react-router-dom";


function Navbar() {
    return (
        <div className = "nav">
            <h1><Link className = "logo" to="/">algoVis</Link></h1>
            <ul className="pages">
                <li><Link className="Li" to="/searching">PATHFINDING</Link></li>
                <li><Link className="Li" to="/sorting">SORTING</Link></li>
                <li><Link className="Li" to="/solver">SODUKU SOLVER</Link></li>
            </ul>
        </div>
    );
}

export default Navbar;