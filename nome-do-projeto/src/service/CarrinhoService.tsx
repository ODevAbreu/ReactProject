import { CarrinhoModel } from "../model/Carrinho.Model";

const listar = async (idUsuario: number): Promise<CarrinhoModel[]> => {
    return await fetch(`http://localhost:8080/api/carrinho/${idUsuario}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    }).then((response) => response.json());
};

const adicionar = async (idUsuario: number, idProduto: number, quantidade: number) => {
    const token = localStorage.getItem("token");
    return await fetch(`http://localhost:8080/api/carrinho/${idUsuario}/adicionar`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ idProduto, quantidade }),
    }).then((response) => response.json());
};

const atualizarQuantidade = async (idUsuario: number, idProduto: number, quantidade: number) => {
    const token = localStorage.getItem("token");
    return await fetch(`http://localhost:8080/api/carrinho/${idUsuario}/atualizar/${idProduto}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ qtd: quantidade }),
    }).then((response) => response.json());
};

const remover = async (idUsuario: number, idProduto: number) => {
    const token = localStorage.getItem("token");
    return await fetch(`http://localhost:8080/api/carrinho/${idUsuario}/${idProduto}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    }).then((response) => response.json());
};

const CarrinhoService = {
    listar,
    adicionar,
    atualizarQuantidade,
    remover
};

export default CarrinhoService;