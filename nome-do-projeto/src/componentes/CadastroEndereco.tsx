import React from "react";

const CadastroEndereco = () => {
  return (
    <section className="vh-100 d-flex justify-content-center align-items-center">
      <div className="container">
        <div className="row d-flex justify-content-center">
          <div className="col-md-12 col-lg-9">
            <div className="card p-4" style={{ borderRadius: "1rem" }}>
              <div className="card-body text-black">
                <h1 className="fw-bold text-center mb-4">Cadastro de Endereço</h1>
                <form className="w3-container">
                <div className="mb-3">
                    <label className="form-label" htmlFor="cep">CEP</label>
                    <input type="text" id="cep" className="form-control" required pattern="\d{5}-\d{3}" placeholder="00000-000" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="rua">Rua</label>
                    <input type="text" id="rua" className="form-control" required minLength={3} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="numero">Número</label>
                    <input type="text" id="numero" className="form-control" required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="bairro">Bairro</label>
                    <input type="text" id="bairro" className="form-control" required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="cidade">Cidade</label>
                    <input type="text" id="cidade" className="form-control" required />
                  </div>
                  <div className="d-grid mt-4">
                    <button className="btn btn-dark btn-custom" type="button" id="btnCadastrar">Cadastrar</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CadastroEndereco ;
