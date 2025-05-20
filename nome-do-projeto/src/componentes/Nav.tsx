import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './Nav.css';

const Nav: React.FC = () => {
  const [usuario, setUsuario] = useState<any>(null);
  const [menuAberto, setMenuAberto] = useState(false);

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

  const toggleMenu = () => {
    setMenuAberto(!menuAberto);
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <img src="/img/logo.png" alt="Coffee or Nothing" className="logo" />
        </Link>

        <button className="mobile-menu-btn" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`nav-links ${menuAberto ? 'active' : ''}`} id="navLinks">
          <li><Link to="/" onClick={() => setMenuAberto(false)}>Início</Link></li>
          <li><Link to="/catalogo" onClick={() => setMenuAberto(false)}>Catálogo</Link></li>

          {usuario ? (
            <>
              <li><span><a>Olá, {usuario.Nome}</a></span></li>
              <li>
                <button className="btn btn-sm btn-danger" onClick={handleLogout}>
                  Sair
                </button>
              </li>
            </>
          ) : (
            <li><Link to="/login" onClick={() => setMenuAberto(false)}>Entre ou Cadastrar-se</Link></li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Nav;
