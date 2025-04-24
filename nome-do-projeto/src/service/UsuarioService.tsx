import { UsuarioModel } from "../model/Usuario.model";

const salvar = async (usuario?: UsuarioModel) => {
    return await fetch(`http://localhost:8080/api/usuario`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(usuario),
    })
        .then((response) => response.json());
}

const listar = async () => {
    return await fetch(`http://localhost:8080/api/usuario`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    }) .then((response) => response.json());
}

const buscarPorId = async (id: string) => {
    return await fetch(`http://localhost:8080/api/usuario/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    }) .then((response) => response.json());
}

const usuarioService = {
    salvar,
    listar,
    buscarPorId
};

export default usuarioService;