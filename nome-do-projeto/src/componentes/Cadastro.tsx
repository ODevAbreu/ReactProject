import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import usuarioService from "../service/UsuarioService";
import { useForm } from "react-hook-form";

const Cadastro: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');

  const {id} = useParams();

  useEffect(() => {        
    if (id) {
        usuarioService.buscarPorId(id).then(usuario => {
            console.log(usuario)
            setNome(usuario.nome);
            setEmail(usuario.email);
            setSenha(usuario.senha);
            setCpf(usuario.cpf);
            setTelefone(usuario.telefone);
            setDataNascimento(usuario.dataNascimento);
        });
    } else {
        console.log('id não encontrado');
    }        
  }, [id]);

  const salvar = () => {
    console.log(id)
    console.log(nome)
    console.log(email)
    console.log(senha)
    console.log(cpf)
    console.log(telefone)
    console.log(dataNascimento)
    
    usuarioService.salvar({
      id: id,  
      nome: nome,
      email: email,
      senha: senha,
      cpf: cpf,
      telefone: telefone,
      dataNascimento: dataNascimento
    }).then(result => {
      console.log("Salvou com sucesso!");
      navigate('/login'); 
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
                <form onSubmit={handleSubmit(salvar)}>
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
                        value={nome}
                        {...register("nome", { required: true })}
                        onChange={(e) => setNome(e.target.value)}
                      />
                      {errors.nome && <span className="text-danger">Este campo é obrigatório</span>}
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
                        value={email}
                        {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      {errors.email && <span className="text-danger">Email inválido</span>}
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
                          value={senha}
                          {...register("senha", { 
                            required: true, 
                            minLength: 8,
                            pattern: /^(?=.*[A-Z])(?=.*\d).+$/
                          })}
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
                      {errors.senha && <span className="text-danger">A senha deve ter pelo menos 8 caracteres, uma letra maiúscula e um número</span>}
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
                        value={cpf}
                        {...register("cpf", { required: true })}
                        onChange={(e) => setCpf(e.target.value)}
                      />
                      {errors.cpf && <span className="text-danger">Este campo é obrigatório</span>}
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
                        value={telefone}
                        {...register("telefone", { required: true })}
                        onChange={(e) => setTelefone(e.target.value)}
                      />
                      {errors.telefone && <span className="text-danger">Este campo é obrigatório</span>}
                    </div>

                    <div className="col-12 col-md-6 mb-3">
                      <label className="form-label" htmlFor="data">
                        Data de Nascimento
                      </label>
                      <input
                        type="date"
                        id="data"
                        className="form-control"
                        value={dataNascimento}
                        {...register("dataNascimento", { required: true })}
                        onChange={(e) => setDataNascimento(e.target.value)}
                      />
                      {errors.dataNascimento && <span className="text-danger">Este campo é obrigatório</span>}
                    </div>

                    <div className="d-grid mt-4">
                      <button className="btn btn-dark btn-custom" type="submit">
                        {id ? "Atualizar" : "Cadastrar"}
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