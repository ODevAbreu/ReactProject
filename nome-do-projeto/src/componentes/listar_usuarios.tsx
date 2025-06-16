import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Nav from './Nav';
import usuarioService from "../service/UsuarioService";
import { UsuarioModel } from "../model/Usuario.model";
import "./ListarUsuario.styles.css";
import Footer from "./Footer";

const ListarUsuario: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [usuario, setUsuario] = useState<UsuarioModel | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const carregarUsuario = async () => {
      try {
        if (id) {
          const dados = await usuarioService.buscarPorId(id);
          setUsuario(dados);
          console.log(dados);
        } else {
          setError("ID do usuário não informado.");
        }
      } catch (err) {
        setError("Erro ao carregar usuário");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    carregarUsuario();
  }, [id]);

  const excluir = async (id: any) => {
    if (window.confirm("Tem certeza que deseja deletar este usuário?")) {
      try {
        await usuarioService.excluir(id);
        setUsuario(null); // Remove o usuário da tela
      } catch (err) {
        setError("Erro ao deletar usuário");
        console.error(err);
      }
    }
  };

  if (loading) return <div className="text-center mt-5">Carregando...</div>;
  if (error) return <div className="text-center mt-5 text-danger">{error}</div>;
  if (!usuario) return <div className="text-center mt-5">Usuário não encontrado.</div>;

  return (
    <>
      <Nav />
      <div className="container-listagem">
        <h1 className="titulo-principal">
         Listar Usuário
        </h1>
        <div className="tabela-wrapper">
          <table className="tabela-usuarios">
            <colgroup>
              <col className="col-id" />
              <col className="col-nome" />
              <col className="col-email" />
              <col className="col-cpf" />
              <col className="col-telefone" />
              <col className="col-data" />
              <col className="col-acoes" />
            </colgroup>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Email</th>
                <th>CPF</th>
                <th>Telefone</th>
                <th>Data Nasc.</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{usuario.id}</td>
                <td className="celula-nome">{usuario.nome}</td>
                <td className="celula-email">{usuario.email}</td>
                <td>{usuario.cpf}</td>
                <td>{usuario.telefone}</td>
                <td>{usuario.Dt_Nasc}</td>
                <td className="celula-acoes">
                  <Link
                    to={`/cadastro/${id}`}
                    className="botao-editar"
                    title="Editar usuário"
                  >
                    <span role="img" aria-label="editar">✏️</span> Editar
                  </Link>
                  <button
                    className="botao-deletar"
                    onClick={() => excluir(id)}
                    title="Deletar usuário"
                  >
                    <span role="img" aria-label="deletar">🗑️</span> Deletar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ListarUsuario;