import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    if (!email || !senha) {
      setErro("Por favor, preencha todos os campos.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setErro("Por favor, insira um e-mail válido.");
      return;
    }

    try {
      setCarregando(true);

      const resposta = await fetch("http://localhost:8080/api/usuario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.mensagem || "Erro ao fazer login.");
      }

      console.log("Login bem-sucedido:", dados);

      // Salvar o token ou estado de login no localStorage
      localStorage.setItem("usuarioLogado", JSON.stringify(dados));

      // Redirecionar para a página de índice
      navigate("/");

    } catch (erro: any) {
      setErro(erro.message || "Erro inesperado.");
    } finally {
      setCarregando(false);
    }
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
                    width={350}
                    alt="Xícara de café"
                    className="coffee-img"
                  />
                </div>
                <div className="col-md-6">
                  <div className="card-body text-black form-container">
                    <h1 className="fw-bold text-center mb-4">Login</h1>
                    <form onSubmit={handleSubmit}>
                      {erro && (
                        <div className="alert alert-danger" role="alert">
                          {erro}
                        </div>
                      )}
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
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
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
                        <button
                          className="btn btn-custom btn-custom"
                          type="submit"
                          disabled={carregando}
                        >
                          {carregando ? "Entrando..." : "Entrar"}
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
