import { ProdModel } from "../model/Prod.Model";

const salvar = async (produto?: ProdModel) => {
    const token = localStorage.getItem("token");
    return await fetch(`http://localhost:8080/api/produto`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization":`Bearer ${token}`
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
const excluir = async (id: string, produto?: ProdModel) => {
    return await fetch(`http://localhost:8080/api/produto/${id}`, {
        method: "DELETE"
    })
        .then((response) => response.json());
}
const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    return await fetch(`http://localhost:8080/api/upload`, {
        method: "POST",
        body: formData,
    })
        .then((response) => response.json());
}


const produtoService = {
    salvar,
    listar,
    buscarPorId,
    excluir,
    uploadFile
};

export default produtoService;