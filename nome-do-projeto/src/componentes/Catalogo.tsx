import React from 'react';
import Nav from './Nav';

const Catalogo: React.FC = () => {
  return (
    <>
    <Nav /> 
  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Catalogo</title>
  <link
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css"
    rel="stylesheet"
    integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC"
    crossOrigin="anonymous"
  />
  <link rel="icon" type="image/svg+xml" href="/vite.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
  <link
    href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Poppins:wght@300;400;500;600&display=swap"
    rel="stylesheet"
  />
  <link
    rel="stylesheet"
    href="{{ url_for('static', path='css/catalogo.css') }}"
  />
  <style
    dangerouslySetInnerHTML={{
      __html: "\n  .navbar{\n    position: relative !important;\n  }\n\n"
    }}
  />
  <main className="catalogo">
    <aside id="aside">
      <a href="./incluirproduto">
        <button style={{ width: "100%" }} className="btn btn-primary">
          Cadastrar Produto
        </button>
      </a>
      <div className="form-group">
        <input
          type="text"
          className="form-control"
          id="filtro"
          aria-describedby="filtro"
          placeholder="Procurar Produtos"
        />
      </div>
      <div className="filtrar">
        <h6>Tipo de Café</h6>
        <div className="filtros">
          <input
            className="form-check-input"
            type="checkbox"
            defaultValue=""
            id="flexCheckDefault1"
          />
          <label className="form-check-label" htmlFor="flexCheckDefault1">
            Cappuccino
          </label>
        </div>
        <div className="filtros">
          <input
            className="form-check-input"
            type="checkbox"
            defaultValue=""
            id="flexCheckDefault2"
          />
          <label className="form-check-label" htmlFor="flexCheckDefault2">
            Expresso
          </label>
        </div>
        <div className="filtros">
          <input
            className="form-check-input"
            type="checkbox"
            defaultValue=""
            id="flexCheckDefault3"
          />
          <label className="form-check-label" htmlFor="flexCheckDefault3">
            Latte
          </label>
        </div>
        <div className="filtros">
          <input
            className="form-check-input"
            type="checkbox"
            defaultValue=""
            id="flexCheckDefault4"
          />
          <label className="form-check-label" htmlFor="flexCheckDefault4">
            Mocha
          </label>
        </div>
      </div>
      <button id="filtrar" className="btn btn-primary">
        Filtrar
      </button>
    </aside>
    <div className="card-deck">
      {/* {% for prod in produtos %} */}
      <div className="card" style={{ width: "18rem" }}>
        <img
          className="card-img-top"
          src="{{ url_for('static', path='imagens/coffe.jpeg') }}"
          alt="imagem do produto"
          width={150}
        />
        <div className="card-body">
          <h5 className="card-title">
            {"{"}
            {"{"}prod.Nome_Produto{"}"}
            {"}"}
          </h5>
          <p className="card-text">
            {"{"}
            {"{"}prod.Descr_Produto{"}"}
            {"}"}
          </p>
          <div className="d-flex justify-content-between align-items-center">
            {/* <a>R${{prod.Preco_prod}}</a> */}
            <a
              href="./prodatualizar?id={{prod.ID_Produto}}"
              className="btn btn-primary"
            >
              Alterar
            </a>
            <a
              href="./prodexcluir?id={{prod.ID_Produto}}"
              className="btn btn-primary"
            >
              Excluir
            </a>
            <a href="./carrinho.html" className="btn btn-primary">
              Comprar
            </a>
          </div>
        </div>
      </div>
    </div>
  </main>
</>
  );
};

export default Catalogo;
