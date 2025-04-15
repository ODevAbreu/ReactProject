import React from "react";  
import Nav from "./Nav";

const Cadastro : React.FC<{}> = ({ }) => {
    return (
        <>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Cadastro</title>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
          rel="stylesheet"
        />
        <link href="style.css" rel="stylesheet" />
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
                    <h1 className="fw-bold text-center mb-4">Cadastro</h1>
                    <form>
                      <div className="row">
                        <div className="col-12 col-md-6 mb-3">
                          <label className="form-label" htmlFor="nome">
                            Nome
                          </label>
                          <input
                            type="text"
                            id="nome"
                            className="form-control"
                            placeholder="Rogerio de Abreu"
                           
                          />
                        </div>
                        <div className="col-12 col-md-6 mb-3">
                          <label className="form-label" htmlFor="email">
                            E-mail
                          </label>
                          <input
                            type="email"
                            id="email"
                            className="form-control"
                      
                            placeholder="seuemail@gmail.com"
                          />
                        </div>
                        <div className="col-12 col-md-6 mb-3">
                          <label className="form-label" htmlFor="senha">
                            Senha
                          </label>
                          <div className="input-group">
                            <input
                              type="password"
                             
                              id="senha"
                              className="form-control"
                              pattern="^(?=.*[A-Z])(?=.*\d).{8,}$"
                              title="Deve conter pelo menos uma letra maiúscula, um número e no mínimo 8 caracteres"
                            />
                            <button
                              className="btn btn-outline-secondary"
                              type="button"
                              id="toggleSenha"
                            >
                              <i className="bi bi-eye" />
                            </button>
                          </div>
                        </div>
                        <div className="col-12 col-md-6 mb-3">
                          <label className="form-label" htmlFor="cpf">
                            CPF
                          </label>
                          <input
                            type="text"
                            id="cpf"
                            className="form-control"
                       
                            placeholder="000.000.000-00"
                            maxLength={14}
                          />
                        </div>
                        <div className="col-12 col-md-6 mb-3">
                          <label className="form-label" htmlFor="telefone">
                            Número de telefone
                          </label>
                          <input
                           
                            type="tel"
                            id="telefone"
                            className="form-control"
                            placeholder="(xx) xxxx-xxxx"
                         
                          />
                        </div>
                        <div className="col-12 col-md-6 mb-3">
                          <label className="form-label" htmlFor="data">
                            Data de Nascimento
                          </label>
                          <input
                            type="date"
                            id="data"
                            className="form-control"
                            max=""
                         
                          />
                        </div>
                        <div className="d-grid mt-4">
                          <button className="btn btn-dark btn-custom" type="submit">
                            Cadastrar{" "}
                          </button>
                        </div>
                        <p className="mt-3 text-center">
                          Já tem uma conta?{" "}
                          <a
                            href="login.html"
                            className="text-decoration-none"
                            style={{ color: "#393f81" }}
                          >
                            Entre aqui
                          </a>
                        </p>
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
}
export default Cadastro;