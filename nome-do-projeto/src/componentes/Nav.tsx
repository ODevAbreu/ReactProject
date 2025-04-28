import React from "react";
import { Link } from "react-router-dom";
import './Nav.css';



const Nav: React.FC = () => {
    return (
        <nav className="navbar">
            <div className="container">
                <Link className="navbar-brand" to="/">
                <img src="/imagens/logo.png" alt="Coffee or Nothing" className="logo" />
                </Link>

                <button className="mobile-menu-btn" id="menuBtn">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                <ul className="nav-links" id="navLinks">
                    <li><Link to="/" className="active">Início</Link></li>
                    <li><Link to="/catalogo">Catálogo</Link></li>
                    <li><Link to="/login">Entre ou Cadastrar-se</Link></li>
                </ul>
            </div>
        </nav>
    );
}

export default Nav;
