import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './style.css';
import usuarioService from "../service/UsuarioService";

const Footer: React.FC = () => {
  return (<footer>
    <div className="container">
      <div className="footer-content">
        <div className="footer-brand">
          <h3>Coffee or Nothing</h3>
          <p>O melhor café para o seu dia</p>
        </div>
        <div className="footer-links">
          <h4>Links Rápidos</h4>
          <ul>
            <li><a href="#home">Início</a></li>
            <li><Link to="/catalogo">Catálogo</Link></li>
            <li><a href="#about">Sobre</a></li>
            <li><a href="#contact">Contato</a></li>
          </ul>
        </div>
        <div className="footer-hours">
          <h4>Horário de Funcionamento</h4>
          <p>Segunda a Sexta: 7h às 20h</p>
          <p>Sábados e Domingos: 8h às 19h</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 Coffee or Nothing. Todos os direitos reservados.</p>
      </div>
    </div>
  </footer>
      )

};

export default Footer;
