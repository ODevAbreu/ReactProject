import { ProdModel } from "../model/Prod.Model";

const salvar = async (produto?: ProdModel) => {
    return await fetch(`http://localhost:8080/api/produto`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(produto),
    })
        .then((response) => response.json());
}

const listar = async () => {
    return await fetch(`http://localhost:8080/api/produto`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    }) .then((response) => response.json());
}

const buscarPorId = async (id: string) => {
    return await fetch(`http://localhost:8080/api/produto/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    }) .then((response) => response.json());
}

const produtoService = {
    salvar,
    listar,
    buscarPorId
};

export default produtoService;