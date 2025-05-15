import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Nav from './Nav';
import usuarioService from "../service/UsuarioService";
import { UsuarioModel } from "../model/Usuario.model";
import "./ListarUsuario.styles.css";

const ListarUsuario: React.FC = () => {
    const [usuarios, setUsuarios] = useState<UsuarioModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const carregarUsuarios = async () => {
      try {
        const dados = await usuarioService.listar();
        console.log("Dados recebidos:", dados); 
        setUsuarios(dados);
      } catch (err) {
        setError("Erro ao carregar usuários");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    carregarUsuarios();
  }, []);
  
  const excluir = async (id: any) => {
    if (window.confirm("Tem certeza que deseja deletar este usuário?")) {
      try {
        // Chama o método de exclusão do serviço, passando o ID do usuário
        const dados = await usuarioService.excluir(id); // Passando o id como argumento
        setUsuarios(usuarios.filter(usuario => usuario.id !== id)); // Atualiza o estado para remover o usuário excluído
      } catch (err) {
        setError("Erro ao deletar usuário");
        console.error(err);
      }
    }
  };
  



  if (loading) return <div className="text-center mt-5">Carregando...</div>;
  if (error) return <div className="text-center mt-5 text-danger">{error}</div>;


  return (
    <div className="container-listagem">
      <h1 className="titulo-principal">
        Usuários Cadastrados
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
            {usuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td>{usuario.id}</td>
                <td className="celula-nome">{usuario.nome}</td>
                <td className="celula-email">{usuario.email}</td>
                <td>{usuario.cpf}</td>
                <td>{usuario.telefone}</td>
                <td>{usuario.Dt_Nasc}</td>
                <td className="celula-acoes">
                <Link 
                    to={`/editar_usuario/${usuario.id}`} 
                    className="botao-editar"
                    title="Editar usuário"
                    >
                    <span role="img" aria-label="editar">✏️</span> Editar
                    </Link>
                    <button
                    className="botao-deletar"
                    onClick={() => excluir(usuario.id)}
                    title="Deletar usuário"
                    >
                    <span role="img" aria-label="deletar">🗑️</span> Deletar
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListarUsuario;