import React from "react";
import { Link } from "react-router-dom";

const Login: React.FC = () => {
  return (
    <section className="vh-100 d-flex justify-content-center align-items-center">
      <div className="container">
        <div className="row d-flex justify-content-center">
          <div className="col-md-10 col-lg-8">
            <div className="card shadow-lg overflow-hidden">
              <div className="row g-0">
                {/* Imagem do café */}
                <div className="col-md-6 d-none d-md-block">
                  <img
                    src="/img/loginimg1.jpg"  // se estiver em public/img
                    alt="Xícara de café"
                    className="coffee-img"
                  />
                </div>
                {/* Formulário de login */}
                <div className="col-md-6">
                  <div className="card-body text-black form-container">
                    <h1 className="fw-bold text-center mb-4">Login</h1>
                    <form>
                      <div className="mb-3">
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
                      <div className="mb-3">
                        <label className="form-label" htmlFor="senha">
                          Senha
                        </label>
                        <div className="input-group">
                          <input
                            type="password"
                            id="senha"
                            className="form-control"
                            placeholder="Digite sua senha"
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
                      <div className="d-grid mt-4">
                        <button className="btn btn-custom btn-custom" type="submit">
                          Entrar
                        </button>
                      </div>
                      <p className="mt-3 text-center">
                        Ainda não tem uma conta?{" "}
                        <Link
                          to="/cadastro"
                          className="text-decoration-none"
                          style={{ color: "#393f81" }}
                        >
                          Cadastre-se
                        </Link>
                      </p>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
