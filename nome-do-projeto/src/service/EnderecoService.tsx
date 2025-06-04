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

const enderecoService = {
    salvar,
  
};


export default enderecoService;