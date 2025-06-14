import { EnderecoModel } from "../model/Endereco.Model";

const salvar = async (endereco?: EnderecoModel) => {
    const token = localStorage.getItem("token");
    return await fetch(`http://localhost:8080/api/endereco`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization":`Beurer ${token}`
        },
        body: JSON.stringify(endereco),
    }).then((response) => response.json());
};

const atualizar = async (id: number, endereco: EnderecoModel) => {
    return await fetch(`http://localhost:8080/api/endereco/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(endereco),
    }).then((response) => response.json());
};

const buscarPorId = async (id: string) => {
    return await fetch(`http://localhost:8080/api/endereco/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    }).then((response) => response.json());
};

const listar = async (userId: number) => {
  const response = await fetch(`http://localhost:8080/api/endereco/usuario/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  return Array.isArray(data) ? data : []; // <- aqui garante um array
};
const excluir = async (id: number) => {
    return await fetch(`http://localhost:8080/api/endereco/${id}`, {
        method: "DELETE"
    }).then((response) => response.json());
}

const enderecoService = {
    salvar,
    atualizar,
    buscarPorId,
    listar,
    excluir
};

export default enderecoService;
