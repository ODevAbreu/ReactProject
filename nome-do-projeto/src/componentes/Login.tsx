import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (data.success) {
        console.log('Login bem-sucedido:', data);
        localStorage.setItem("usuario", JSON.stringify(data.usuario));
        localStorage.setItem("userRole", data.usuario.Tipo);
      window.location.href = "/";
}
      else {
        setErro("E-mail ou senha inválidos.");
      }
    } catch (error) {
      setErro("Erro ao conectar com o servidor.");
    }
  };

  const alternarVisibilidadeSenha = () => {
    setMostrarSenha((prev) => !prev);
  };

  return (
    <section className="vh-100 d-flex justify-content-center align-items-center">
      <div className="container">
        <div className="row d-flex justify-content-center">
          <div className="col-md-10 col-lg-8">
            <div className="card shadow-lg overflow-hidden">
              <div className="row g-0">
                <div className="col-md-6 d-none d-md-block">
                  <img
                    src="/img/loginimg1.jpg"
                    alt="Xícara de café"
                    className="img-fluid w-100 h-100 object-fit-cover"
                  />
                </div>
                <div className="col-md-6">
                  <div className="card-body text-black form-container">
                    <h1 className="fw-bold text-center mb-4">Login</h1>
                    <form onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label className="form-label" htmlFor="email">
                          E-mail
                        </label>
                        <input
                          type="email"
                          id="email"
                          className="form-control"
                          placeholder="seuemail@gmail.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label" htmlFor="senha">
                          Senha
                        </label>
                        <div className="input-group">
                          <input
                            type={mostrarSenha ? "text" : "password"}
                            id="senha"
                            className="form-control"
                            placeholder="Digite sua senha"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            required
                          />
                          <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={alternarVisibilidadeSenha}
                          >
                            <i className={`bi ${mostrarSenha ? "bi-eye-slash" : "bi-eye"}`} />
                          </button>
                        </div>
                      </div>
                      {erro && (
                        <p className="text-danger text-center">{erro}</p>
                      )}
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
