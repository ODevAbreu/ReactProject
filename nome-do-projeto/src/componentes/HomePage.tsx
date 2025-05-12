import React from 'react';
import { Link } from 'react-router-dom';
import Nav from './Nav';

// Se as imagens estiverem no /public/img, não precisa importar.
// Se estiverem em /src/assets, você importa assim:
// import coffeeProduct from '../assets/Coffee product.png';
// import coffeeCup from '../assets/copo cafee.png';
// import cafeteria from '../assets/cafeteriaw.png';

const Home: React.FC = () => {
  return (
    <>
      <Nav />

      <div id="app">
        <section className="hero" id="home">
          <div className="container">
            <div className="hero-content">
              <h1>Bem-vindo ao Coffee or Nothing</h1>
              <p>Descubra o prazer de um café verdadeiramente especial</p>
              <div className="hero-buttons">
                <a href="#menu" className="cta-button primary">Conheça nosso Menu</a>
                <Link to="/cadastro" className="cta-button secondary">Cadastre-se</Link>
              </div>
            </div>
          </div>
          <div className="hero-overlay"></div>
        </section>

        <section className="features" id="menu">
          <div className="container">
            <h2 className="section-title">Nossa Experiência</h2>
            <div className="feature-grid">
              <div className="feature-card">
                <div className="feature-image">
                  <img src="/img/Coffee product.png" alt="O melhor Café" />
                </div>
                <h3>O melhor Café</h3>
                <p>Grãos selecionados com cuidado para o melhor sabor, torrados artesanalmente para uma experiência única.</p>
              </div>
              <div className="feature-card">
                <div className="feature-image">
                  <img src="/img/copo cafee.png" alt="Café fresquinho" />
                </div>
                <h3>Feito com Amor</h3>
                <p>Café fresquinho, preparado com dedicação por baristas apaixonados pela arte do café.</p>
              </div>
              <div className="feature-card">
                <div className="feature-image">
                  <img src="/img/cafeteriaw.png" alt="Sabores exclusivos" />
                </div>
                <h3>Sabores Exclusivos</h3>
                <p>Experimente nossas criações especiais, desenvolvidas para surpreender seu paladar.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="about" id="about">
          <div className="container">
            <div className="about-content">
              <h2 className="section-title">Nossa História</h2>
              <p>Desde 2020, o Coffee or Nothing tem sido mais que uma cafeteria - é um lugar onde paixão pelo café encontra excelência em cada xícara.</p>
            </div>
          </div>
        </section>

        <section className="contact" id="contact">
          <div className="container">
            <h2 className="section-title">Entre em Contato</h2>
            <div className="contact-content">
              <div className="contact-info">
                <p>📍 Rua do Café, 123 - São Paulo</p>
                <p>📞 (11) 1234-5678</p>
                <p>✉️ contato@coffeeornothing.com</p>
              </div>
            </div>
          </div>
        </section>

        <footer>
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
      </div>
    </>
  );
};

export default Home;
