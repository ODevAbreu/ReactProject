import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Nav from './Nav';
import usuarioService from "../service/UsuarioService";
import CarrinhoService from "../service/CarrinhoService";
import { UsuarioModel } from "../model/Usuario.model";
import "./ListarUsuario.styles.css";
import Footer from "./Footer";

const ListarUsuario: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [usuario, setUsuario] = useState<UsuarioModel | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [historico, setHistorico] = useState<any[]>([]);
  const [loadingHistorico, setLoadingHistorico] = useState<boolean>(true);

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

    // Carrega histórico de compras
    const carregarHistorico = async () => {
      if (id) {
        setLoadingHistorico(true);
        try {
          const dados = await CarrinhoService.historicoCompras(Number(id));
          setHistorico(dados);
        } catch (err) {
          setHistorico([]);
        } finally {
          setLoadingHistorico(false);
        }
      }
    };
    carregarHistorico();
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
                <td>
                  {usuario.Dt_Nasc
                    ? new Date(usuario.Dt_Nasc).toLocaleDateString("pt-BR")
                    : ""}
                </td>
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
      <div className="historico-container">
        <h1 className="titulo-secundario">
          Histórico de Compras
        </h1>
        {loadingHistorico ? (
          <div>Carregando histórico...</div>
        ) : historico.length === 0 ? (
          <div>Nenhuma compra encontrada.</div>
        ) : (
          historico.map((compra) => (
            <div
              key={compra.ID_Compra}
              className="card-compra"
            >
              <div className="card-compra-header">
                <div className="card-compra-header-row">
                  <div className="card-compra-info">
                    <strong>Compra #{compra.ID_Compra}</strong>
                    <br />
                    <span>
                      Data:{" "}
                      {compra.Data_Compra
                        ? new Date(compra.Data_Compra).toLocaleDateString("pt-BR")
                        : "Data inválida"}
                    </span>
                    <br />
                    <span>
                      Status:{" "}
                      <strong className="card-compra-status">{compra.Status}</strong>
                    </span>
                    <br />
                    <span>Pagamento: {compra.Forma_Pagamento}</span>
                  </div>
                  <div className="card-compra-endereco">
                    <strong>Endereço de entrega</strong>
                    <br />
                    {compra.Rua_entrega}, {compra.Numero_entrega}
                    <br />
                    {compra.Bairro_entrega} - {compra.Cidade_entrega}
                    <br />
                    CEP: {compra.CEP_entrega}
                  </div>
                </div>
              </div>
              <table className="tabela-historico">
                <thead>
                  <tr>
                    <th>Imagem</th>
                    <th>Produto</th>
                    <th>Quantidade</th>
                    <th>Preço Unitário</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {compra.produtos.map((produto: any) => (
                    <tr key={produto.ID_Produto}>
                      <td>
                        <img
                          src={
                            produto.imagem_prod
                              ? produto.imagem_prod.startsWith("http")
                                ? produto.imagem_prod
                                : `http://localhost:8080${produto.imagem_prod}`
                              : ""
                          }
                          alt={produto.Nome_Produto}
                        />
                      </td>
                      <td style={{ fontWeight: 500 }}>{produto.Nome_Produto}</td>
                      <td>{produto.Qtn_Produto}</td>
                      <td>R$ {Number(produto.Preco_prod).toFixed(2)}</td>
                      <td>R$ {Number(produto.Subtotal).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={4} style={{ textAlign: "right" }}>
                      Total da Compra:
                    </td>
                    <td>
                      R$ {Number(compra.total).toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ))
        )}
      </div>
      <Footer />
    </>
  );
};

export default ListarUsuario;