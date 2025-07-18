import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Nav from './Nav';
import { ProdModel } from '../model/Prod.Model';
import ProdService from '../service/ProdService';
import './catalogo.css';
import Footer from './Footer';
import CarrinhoService from '../service/CarrinhoService';
import Swal from 'sweetalert2';

const Catalogo: React.FC = () => {
  let ADM = false
  let ID_User = 0;
  const usuario = localStorage.getItem("usuario");
  if (usuario) {
    const usuariojson = usuario ? JSON.parse(usuario) : null;
    ADM = usuariojson.ADM;
    ID_User = usuariojson.Id;
  }
  const adicionarAoCarrinho = async (idProduto: number) => {
    try {
      if (ID_User > 0) {        
        CarrinhoService.adicionar(ID_User, idProduto, 1,).then((result) => {
          console.log("ID do usuário:", result);
          if (result.success) {
            Swal.fire("Sucesso", "Produto adicionado ao carrinho!", "success");
          } else {
            Swal.fire("Erro", result.message, "error");
          }
        })
          ;
      } else {
        Swal.fire("Atenção", "Faça login para comprar!", "warning");
      }
    } catch (error) {
      console.error("Erro ao adicionar produto ao carrinho:", error);
      Swal.fire("Erro", "Ocorreu um erro ao adicionar o produto ao carrinho.", "error");
    }
  }
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
      <Nav />
      <main className="catalogo d-flex">
        <aside id="aside" className="p-3" style={{ width: '250px' }}>
          {ADM ? (
            <Link to="/prodincluir">
              <button style={{ width: "100%" }} className="btn btn-primary mb-3">
                Cadastrar Produto
              </button>
            </Link>
          ) : null}

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
            <div key={prod.id} className="card">
              <img
                className="card-img-top"
                src={prod.imagem}
                alt="imagem do produto"
              />
              <div className="card-body">
                <h5 className="card-title">{prod.nome}</h5>
                <p className="card-text">{prod.descr}</p>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="valor-produto">R${prod.preco.toFixed(2)}</span>
                  <div className="btn-group">
                    {ADM ? (
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
                      <button className="btn btn-success btn-sm"
                        onClick={() => adicionarAoCarrinho(prod.id)}
                      >
                        Comprar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Catalogo;