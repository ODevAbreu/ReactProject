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

const excluir = async (id: string) => {
    try {
        const response = await fetch(`http://localhost:8080/api/usuario/${id}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error('Erro ao excluir usuário');
        }

        return await response.json();
    } catch (err) {
        console.error('Erro ao excluir o usuário', err);
        throw err;
    }
}
const usuarioService = {
    salvar,
    listar,
    buscarPorId,
    excluir
};

export default usuarioService;