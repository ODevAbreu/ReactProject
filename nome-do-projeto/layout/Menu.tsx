import React from "react";
// import logo from './logo.svg'; <img src={logo} className="App-logo" alt="logo" />
const Menu: React.FC<{}> = ({ }) => {
    return (
        <nav className="navbar">
            <div className="container">
                <a className="navbar-brand" href="#">
                    <img src="images/logo.png" alt="Coffee or Nothing" className="logo"/>
                </a>
                <button className="mobile-menu-btn" id="menuBtn">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                <ul className="nav-links" id="navLinks">
                    <li><a href="#home" className="active">Início</a></li>
                    <li><a href="catalogo.html">Catalogo</a></li>
                    <li><a href="./login.html">Entre ou Cadastrar-se</a></li>
                </ul>
            </div>
        </nav>


    );
}
export default Menu;