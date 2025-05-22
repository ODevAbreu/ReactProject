import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Nav from './Nav';
import { ProdModel } from '../model/Prod.Model';
import ProdService from '../service/ProdService';
import './catalogo.css';

const Catalogo: React.FC = () => {
  const role = localStorage.getItem("userRole");
  const isAdm = role === "adm";

  const excluir = async (id: number) => {
    const confirmar = window.confirm("Tem certeza que deseja excluir este produto?");
    if (!confirmar) return;

    try {
      await ProdService.excluir(id.toString());
      setProdutos(produtos?.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Erro ao excluir o produto:", error);
      alert("Ocorreu um erro ao excluir o produto.");
    }
  };

  const [produtos, setProdutos] = useState<ProdModel[]>();
  useEffect(() => {
    ProdService.listar().then((produtos) => {
      const produtosMapeados = produtos.map((prod: { ID_Produto: any; Nome_Produto: any; Descr_Produto: any; Preco_prod: any; Tipo_prod: any; Qtn_Produto: any; imagem_prod: string; }) => ({
        id: prod.ID_Produto,
        nome: prod.Nome_Produto,
        descr: prod.Descr_Produto,
        preco: prod.Preco_prod,
        tipo: prod.Tipo_prod,
        quantidade: prod.Qtn_Produto,
        imagem: prod.imagem_prod && prod.imagem_prod !== "null"
          ? `http://localhost:8080${prod.imagem_prod}`
          : "/img/coffe.jpeg",
      }));
      setProdutos(produtosMapeados);
    });
  }, []);

  return (
    <>
      <main className="catalogo d-flex">
        <aside id="aside" className="p-3" style={{ width: '250px' }}>
          {isAdm && (
            <Link to="/prodincluir">
              <button style={{ width: "100%" }} className="btn btn-primary mb-3">
                Cadastrar Produto
              </button>
            </Link>
          )}

          <div className="form-group mb-3">
            <input
              type="text"
              className="form-control"
              id="filtro"
              placeholder="Procurar Produtos"
            />
          </div>

          <div className="filtrar">
            <h6>Tipo de Café</h6>
            {["Cappuccino", "Expresso", "Latte", "Mocha"].map((tipo, idx) => (
              <div className="form-check" key={idx}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`tipo-${idx}`}
                />
                <label className="form-check-label" htmlFor={`tipo-${idx}`}>
                  {tipo}
                </label>
              </div>
            ))}
          </div>

          <button id="filtrar" className="btn btn-primary mt-3">
            Filtrar
          </button>
        </aside>

                <div className="card-deck d-flex flex-wrap justify-content-center gap-4 p-4">
          {produtos?.map((prod) => (
            <div key={prod.id} className="card" style={{ width: "18rem" }}>
              <img
                className="card-img-top"
                src={prod.imagem}
                alt="imagem do produto"
                style={{ maxHeight: '200px', objectFit: 'cover' }}
              />
              <div className="card-body">
                <h5 className="card-title">{prod.nome}</h5>
                <p className="card-text">{prod.descr}</p>
                <div className="d-flex justify-content-between align-items-center">
                  <span>R${prod.preco.toFixed(2)}</span>
                  <div className="btn-group">
                    {isAdm ? (
                      <>
                        <Link to={`/prodincluir/${prod.id}`} className="btn btn-primary btn-sm">
                          Alterar
                        </Link>
                        <button
                          onClick={() => excluir(prod.id)}
                          className="btn btn-danger btn-sm"
                        >
                          Excluir
                        </button>
                      </>
                    ) : (
                      <Link to="/carrinho" className="btn btn-success btn-sm">
                        Comprar
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

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
    </>
  );
};

export default Catalogo;