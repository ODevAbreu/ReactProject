import React, { useState } from "react";
import { Link } from "react-router-dom";
import usuarioService from "../service/UsuarioService";

const Cadastro: React.FC = () => {
  const [nome, setNome] = useState('');

  const salvar = () => {
    console.log(nome);
    usuarioService.salvar({
      nome: nome
    }).then(result => {
      console.log("Salvou com sucesso!");
      console.log(result);
    }).catch(error => {
      console.log(error);
    });
  };

  return (
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
                        onChange={(e) => setNome(e.target.value)}
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
                          placeholder="Digite sua senha"
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
                      />
                    </div>

                    <div className="d-grid mt-4">
                      <button className="btn btn-dark btn-custom" type="button" onClick={salvar}>
                        Cadastrar
                      </button>
                    </div>

                    <p className="mt-3 text-center">
                      Já tem uma conta?{" "}
                      <Link
                        to="/login"
                        className="text-decoration-none"
                        style={{ color: "#393f81" }}
                      >
                        Entre aqui
                      </Link>
                    </p>
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

export default Cadastro;
