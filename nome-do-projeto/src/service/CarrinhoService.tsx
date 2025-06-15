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
    return await fetch(`http://localhost:8080/api/carrinho/adicionar`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ idUsuario,idProduto, quantidade }),
    }).then((response) => response.json());
};

const atualizarQuantidade = async (ID_Compra: number, idProduto: number, quantidade: number) => {
    const token = localStorage.getItem("token");
    return await fetch(`http://localhost:8080/api/carrinho/atualizar/`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ ID_Compra: ID_Compra, idProduto: idProduto, Qtn_Produto: quantidade }),
    }).then((response) => response.json());
};

const remover = async (idProduto: number,ID_Compra: number) => {
    const token = localStorage.getItem("token");
    return await fetch(`http://localhost:8080/api/carrinho/`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ ID_Compra: ID_Compra, idProduto: idProduto }),
    }).then((response) => response.json());
};

const CarrinhoService = {
    listar,
    adicionar,
    atualizarQuantidade,
    remover
};

export default CarrinhoService;