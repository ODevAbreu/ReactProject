import { useEffect, useState } from "react";
import CarrinhoService from "../service/CarrinhoService";
import enderecoService from "../service/EnderecoService"; 
import { CarrinhoModel } from "../model/Carrinho.Model";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Nav from './Nav';
import Footer from './Footer';


const Carrinho: React.FC = () => {
  const [produtos, setProdutos] = useState<CarrinhoModel[]>([]);
  const [enderecos, setEnderecos] = useState<any[]>([]);
  const [idEndereco, setIdEndereco] = useState<number | null>(null);
  const [pagamento, setPagamento] = useState("Cartão de Crédito");
  const [idUsuario, setIdUsuario] = useState<number | null>(null);
  const [total, setTotal] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    const carregarUsuario = () => {
      try {
        const user = localStorage.getItem("usuario");
        if (!user) {
          Swal.fire("Erro", "Usuário não logado", "error");
          navigate("/login");
          return;
        }

        const usuarioObj = JSON.parse(user);
        const usuarioId = usuarioObj.id || usuarioObj.Id;
        
        if (!usuarioId) {
          Swal.fire("Erro", "ID do usuário não encontrado", "error");
          navigate("/login");
          return;
        }

        setIdUsuario(usuarioId);
        carregarCarrinho(usuarioId);
        carregarEnderecos(usuarioId);
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
        Swal.fire("Erro", "Falha ao carregar dados do usuário", "error");
        navigate("/login");
      }
    };

    carregarUsuario();
  }, [navigate]);

  useEffect(() => {
    // Calcular total sempre que produtos mudar
    const novoTotal = produtos.reduce((acc, produto) => {
      return acc + (produto.preco * produto.qtd);
    }, 0);
    setTotal(novoTotal);
  }, [produtos]);

  const carregarCarrinho = async (userId: number) => {
    try {
      const carrinho = await CarrinhoService.listar(userId);
      setProdutos(Array.isArray(carrinho) ? carrinho : []);
    } catch (error) {
      console.error("Erro ao carregar carrinho:", error);
      Swal.fire("Erro", "Falha ao carregar carrinho", "error");
      setProdutos([]);
    }
  };

  const carregarEnderecos = async (userId: number) => {
    try {
      const response = await enderecoService.listar(userId);
      setEnderecos(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Erro ao carregar endereços:", error);
      Swal.fire("Erro", "Falha ao carregar endereços", "error");
      setEnderecos([]);
    }
  };

  const atualizarQuantidade = async (idProduto: number, novaQtd: number) => {
    if (!idUsuario || novaQtd < 1) return;
    
    try {
      await CarrinhoService.atualizarQuantidade(idUsuario, idProduto, novaQtd);
      carregarCarrinho(idUsuario);
    } catch (error) {
      console.error("Erro ao atualizar quantidade:", error);
      Swal.fire("Erro", "Falha ao atualizar quantidade", "error");
    }
  };

  const removerProduto = async (idProduto: number) => {
    if (!idUsuario) return;
    
    try {
      await CarrinhoService.remover(idUsuario, idProduto);
      carregarCarrinho(idUsuario);
      Swal.fire("Sucesso", "Produto removido do carrinho", "success");
    } catch (error) {
      console.error("Erro ao remover produto:", error);
      Swal.fire("Erro", "Falha ao remover produto", "error");
    }
  };
  const ExcluirEndereco = async (id: number) => {
    try {
      await enderecoService.excluir(id)
      .then((result) => {
        console.log("Endereço excluído com sucesso:", result);

        if (result.success) {
          Swal.fire("Sucesso", "Endereço excluído com sucesso!", "success");
          carregarEnderecos(idUsuario!);
        } else {
          Swal.fire("Erro", "Falha ao excluir endereço", "error");
        }
      })
  
      // carregarEnderecos(idUsuario!); 
    } catch (error) {
      console.error("Erro ao excluir endereço:", error);
      Swal.fire("Erro", "Falha ao excluir endereço", "error");
    }
  }	
  const confirmarExclusaoEndereco = (id: number) => {
    Swal.fire({
      title: "Tem certeza?",
      text: "Esta ação não poderá ser desfeita!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, excluir!",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
       ExcluirEndereco(id);
      }
    });
  };

  const finalizarCompra = async () => {
    if (!idUsuario || !idEndereco) {
      Swal.fire("Atenção", "Selecione um endereço de entrega", "warning");
      return;
    }

    try {
      // Implemente seu serviço de finalização de compra
      // await CarrinhoService.finalizarCompra(idUsuario, idEndereco, pagamento);
      
      Swal.fire("Sucesso", "Compra finalizada com sucesso!", "success");
      setProdutos([]);
      navigate("/pedidos");
    } catch (error) {
      console.error("Erro ao finalizar compra:", error);
      Swal.fire("Erro", "Falha ao finalizar compra", "error");
    }
  };

  return (
     <>
    <Nav />
    <section className="cart-section py-5">
      <div className="container mt-5 pt-5">
        <h1 className="text-center mb-4">Seu Carrinho</h1>

        {produtos.length === 0 ? (
          <div className="text-center py-4">
            <p>Seu carrinho está vazio</p>
          </div>
        ) : (
          <div className="cart-items" id="cartItems">
            {produtos.map(produto => (
              <div key={produto.id} className="card mb-3 p-3 shadow-sm">
                <div className="row g-0 align-items-center">
                  <div className="col-md-2 text-center">
                    <img 
                      src={`/imagem_produto/${produto.id}`} 
                      alt={produto.nome} 
                      className="img-fluid rounded"
                      style={{ maxWidth: '80px' }}
                    />
                  </div>
                  <div className="col-md-6">
                    <h5 className="card-title">{produto.nome}</h5>
                    <p className="card-text text-muted">{produto.descr}</p>
                  </div>
                  <div className="col-md-2 text-center">
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => atualizarQuantidade(produto.id, produto.qtd - 1)}
                      disabled={produto.qtd <= 1}
                      title={produto.qtd <= 1 ? "Quantidade mínima é de 1" : ""}
                    >
                      -
                    </button>
                    <span className="mx-2">{produto.qtd}</span>
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => atualizarQuantidade(produto.id, produto.qtd + 1)}
                    >
                      +
                    </button>
                  </div>
                  <div className="col-md-2 text-end">
                    <p className="fw-bold">R$ {produto.preco.toFixed(2)}</p>
                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={() => removerProduto(produto.id)}
                    >
                      Remover
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="cart-summary p-4 border rounded mt-4 bg-white"
          style={{ fontFamily: "'Poppins', sans-serif !important" }}>
          <div>
            <h2 className="mb-3 text-center">Endereço de Entrega</h2>

            {enderecos.length > 0 ? (
              <div className="mb-3">
                <label className="form-label">Selecione um endereço:</label>
                {enderecos.map(endereco => (
                  <div className="form-check" key={endereco.ID_Endereco || endereco.id}>
                    <input 
                      className="form-check-input" 
                      type="radio" 
                      name="id_endereco" 
                      id={`endereco${endereco.ID_Endereco || endereco.id}`}
                      value={endereco.ID_Endereco || endereco.id}
                      onChange={() => setIdEndereco(endereco.ID_Endereco || endereco.id)}
                      required
                    />
                    <label className="form-check-label" htmlFor={`endereco${endereco.ID_Endereco || endereco.id}`}>
                      {endereco.Rua || endereco.rua}, {endereco.Numero || endereco.numero} - {endereco.Bairro || endereco.bairro}, {endereco.Cidade || endereco.cidade} - CEP: {endereco.CEP || endereco.cep}
                    </label>
                    <a 
                      href={`/editar_endereco/${endereco.ID_Endereco || endereco.id}`} 
                      className="btn btn-link text-decoration-none"
                    >
                      Editar
                    </a>
                    <button
                      onClick={() => confirmarExclusaoEndereco(endereco.ID_Endereco || endereco.id)}
                      className="btn btn-link text-decoration-none text-danger"
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="text-end mb-3">
              <a 
                href="/CadastroEndereco" 
                className="btn btn-success w-100 mt-3" 
                style={{ backgroundColor: '#624839', color: '#f5f5dc' }}
              >
                Cadastrar Novo Endereço
              </a>
            </div>

            <label className="form-label">Forma de Pagamento</label>
            <select 
              className="form-select mb-3"
              value={pagamento}
              onChange={(e) => setPagamento(e.target.value)}
            >
              <option value="Cartão de Crédito">Cartão de Crédito</option>
              <option value="Cartão de Débito">Cartão de Débito</option>
              <option value="PIX">PIX</option>
              <option value="Boleto">Boleto Bancário</option>
            </select>

            <div className="cart-total d-flex justify-content-between align-items-center p-3 border rounded bg-light">
              <span className="fw-bold">Total:</span>
              <span id="cartTotal" className="fw-bold">R$ {total.toFixed(2)}</span>
            </div>

            {enderecos.length > 0 && produtos.length > 0 ? (
              <button 
                type="button" 
                className="btn btn-success w-100 mt-3" 
                style={{ backgroundColor: '#4a3428', color: '#f5f5dc' }}
                onClick={finalizarCompra}
              >
                Finalizar Compra
              </button>
            ) : produtos.length > 0 ? (
              <button 
                type="button" 
                disabled 
                className="btn btn-success w-100 mt-3" 
                style={{ backgroundColor: '#4a3428', color: '#f5f5dc' }}
              >
                Cadastre um endereço para finalizar a compra
              </button>
            ) : (
              <button 
                type="button" 
                disabled 
                className="btn btn-success w-100 mt-3" 
                style={{ backgroundColor: '#4a3428', color: '#f5f5dc' }}
              >
                Adicione um produto para finalizar a compra
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
    <Footer/>
    </>
  );
};

export default Carrinho;