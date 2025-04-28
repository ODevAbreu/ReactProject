import React from 'react';
import './style.css';
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import prodService from "../service/ProdService";

const ProdIncluir: React.FC = () => {

  const { register, handleSubmit, formState: { errors } } = useForm();
  const [nome, setNome] = React.useState('');
  const [descr, setDescr] = React.useState('');
  const [tipo, setTipo] = React.useState('');
  const [preco, setPreco] = React.useState(0);
  const [qtd, setQtd] = React.useState(0);

  const {id} = useParams();

  const salvar = () => {  
    console.log(id)
    console.log(nome)
    console.log(descr)
    console.log(tipo)
    console.log(preco)
    console.log(qtd)
    
    prodService.salvar({
      id:id,  
      nome: nome
      , descr: descr
      , tipo: tipo
      , preco: preco
      , qtd: qtd


    }).then(result => {
      console.log("Salvou com sucesso!");
      console.log(result);
    }, error => {
      console.log(error);
    });
  }



  return (
    <>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Cadastro</title>
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
        rel="stylesheet"
      />
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css"
      />
      <style
        dangerouslySetInnerHTML={{
          __html:
            "\n        .btn-custom {\n          background-color: #744321; /* Marrom café */\n          border-color: #744321;\n          color: #f5f5dc;\n        }\n    "
        }}
      />
      <section className="vh-100 d-flex justify-content-center align-items-center">
        <div className="container">
          <div className="row d-flex justify-content-center">
            <div className="col-md-12 col-lg-9">
              <div className="card p-4" style={{ borderRadius: "1rem" }}>
                <div className="card-body text-black">
                  <h1 className="fw-bold text-center mb-4">Cadastro de Produto</h1>
                  <form
                    className="w3-container"
                    action="/prodincluir_exe"
                    method="post"
                    encType="multipart/form-data"
                  >
                    <div className="row">
                      <div className="mb-3">
                        <label className="form-label" htmlFor="nome_prod">
                          Nome do Produto
                        </label>
                        <input
                          type="text"
                          id="nome_prod"
                          name="nome"
                          className="form-control"
                          placeholder="Digite o Nome do Produto"
                          minLength={5}
                          required={true}
                          onChange={(e) => { setNome(e.target.value) }}
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="descr_prod" className="form-label">
                          Descrição do Produto
                        </label>
                        <textarea
                          className="form-control"
                          id="descr_prod"
                          name="descr"
                          rows={2}
                          defaultValue={""}
                          placeholder="Digite a descrição do produto"
                          onChange={(e) => { setDescr(e.target.value) }}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="mb-3">
                        <label className="form-label" htmlFor="tipo_prod">
                          Tipo Produto
                        </label>
                        <select name="tipo" id="tipo_prod" className="form-select"
                          required={true}
                          onChange={(e) => { setTipo(e.target.value) }}>
                          <option value="">Selecione o tipo do produto</option>
                          <option>Bebida</option>
                          <option>Pó</option>
                        </select>
                      </div>
                    </div>
                    <div className="row">
                      <div className="mb-3">
                        <label className="form-label" htmlFor="preco_prod">
                          Preço do Produto
                        </label>
                        <input
                          type="number"
                          id="preco_prod"
                          name="preco"
                          className="form-control"
                          step="0.01"
                          placeholder="Digite o preço do produto"
                          required={true}
                          onChange={(e) => { setPreco(parseFloat(e.target.value)) }}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="mb-3">
                        <label className="form-label" htmlFor="qtd_prod">
                          Quantidade em estoque
                        </label>
                        <input
                          type="number"
                          id="qtd_prod"
                          name="qtd"
                          className="form-control"
                          placeholder="Digite a quantidade do produto em estoque"
                          required={true}
                          onChange={(e) => { setQtd(parseInt(e.target.value)) }}
                        />
                      </div>
                    </div>
                    <div className="d-grid mt-4">
                      <button
                        className="btn btn-dark btn-custom"
                        type="button"
                        onClick={salvar}
                        id="btnCadastrar"
                      >
                        Cadastrar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProdIncluir;