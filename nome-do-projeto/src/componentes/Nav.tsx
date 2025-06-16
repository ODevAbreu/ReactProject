import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './Nav.css';
import usuarioService from "../service/UsuarioService";

const Nav: React.FC = () => {
  const [usuario, setUsuario] = useState<any>(null);
  const [menuAberto, setMenuAberto] = useState(false);


  // const buscarUsuario = () =>{
  //   usuarioService.buscarPorId().then(usuario => {
  //     setUsuario(usuario);
  //   });
  // }

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("usuario");
    if (token && user) {
      const usuarioObj = JSON.parse(user);
      setUsuario(usuarioObj);
    }

  }, []);
  const Deslogar = () => {
    localStorage.removeItem("token");
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
              <li>
                <Link to={`/listarUsuario/${usuario.Id}`} className="text-decoration-none">
                  Olá, {usuario.Nome}
                </Link>
              </li>
              <li>
                <Link to="/Carrinho" className="text-decoration-none">
                  Carrinho
                </Link>
              </li>
              <li>
                <button className="btn btn-sm btn-danger" onClick={Deslogar}>
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
