import React from 'react';
import { Link } from 'react-router-dom';
import Nav from './Nav';
// import coffeeImage from '../assets/imagens/coffe.jpeg'; // Descomente e ajuste o caminho para sua imagem real

const Catalogo: React.FC = () => {
  // Simulação de produtos para listar no catálogo
  const produtos = [
    {
      id: 1,
      nome: "Cappuccino",
      descricao: "Delicioso cappuccino cremoso",
      preco: 12.5,
      imagem: "/imagens/coffe.jpeg", // caminho relativo público
    },
    {
      id: 2,
      nome: "Expresso",
      descricao: "Café expresso forte",
      preco: 9.0,
      imagem: "/imagens/coffe.jpeg",
    },
  ];

  return (
    <>
      <Nav />

      <main className="catalogo d-flex">
        <aside id="aside" className="p-3" style={{ width: '250px' }}>
          <Link to="/incluirproduto">
            <button style={{ width: "100%" }} className="btn btn-primary mb-3">
              Cadastrar Produto
            </button>
          </Link>

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
          {produtos.map((prod) => (
            <div key={prod.id} className="card" style={{ width: "18rem" }}>
              <img
                className="card-img-top"
                src={prod.imagem}
                alt="imagem do produto"
              />
              <div className="card-body">
                <h5 className="card-title">{prod.nome}</h5>
                <p className="card-text">{prod.descricao}</p>
                <div className="d-flex justify-content-between align-items-center">
                  <span>R${prod.preco.toFixed(2)}</span>
                  <div className="btn-group">
                    <Link to={`/prodatualizar?id=${prod.id}`} className="btn btn-primary btn-sm">
                      Alterar
                    </Link>
                    <Link to={`/prodexcluir?id=${prod.id}`} className="btn btn-danger btn-sm">
                      Excluir
                    </Link>
                    <Link to="/carrinho" className="btn btn-success btn-sm">
                      Comprar
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
};

export default Catalogo;
