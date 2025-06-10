import { EnderecoModel } from "../model/Endereco.Model";

const salvar = async (endereco?:EnderecoModel ) => {
    return await fetch(`http://localhost:8080/api/endereco`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(endereco),
    })
        .then((response) => response.json());
}

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
        }
    }) .then((response) => response.json());
}
const enderecoService = {
    salvar,
    atualizar,
    buscarPorId
  
};


export default enderecoService;