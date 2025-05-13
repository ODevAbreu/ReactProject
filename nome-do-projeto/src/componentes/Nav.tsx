import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './Nav.css';

const Nav: React.FC = () => {
  const [usuario, setUsuario] = useState<any>(null);

  useEffect(() => {
    const dados = localStorage.getItem("usuario");
    if (dados) {
      setUsuario(JSON.parse(dados));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    window.location.href = "/";
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <img src="/img/logo.png" alt="Coffee or Nothing" className="logo" />
        </Link>

        <button className="mobile-menu-btn" id="menuBtn">
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className="nav-links" id="navLinks">
          <li><Link to="/">Início</Link></li>
          <li><Link to="/catalogo">Catálogo</Link></li>

          {usuario ? (
            <>
              <li><span>Olá, {usuario.nome}</span></li>
              <li>
                <button className="btn btn-sm btn-danger" onClick={handleLogout}>
                  Sair
                </button>
              </li>
            </>
          ) : (
            <li><Link to="/login">Entre ou Cadastrar-se</Link></li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Nav;
