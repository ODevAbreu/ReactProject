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
    const token = localStorage.getItem("token");
    return await fetch(`http://localhost:8080/api/usuario/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization":`cafezada ${token}`
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

const login = async (email: string, senha: string) => {
    return await fetch(`http://localhost:8080/usuario/login`, {
        method: "POST",
        headers:{
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
                email: email,
                senha: senha
            })

    }).then((response) => response.json());

}

const usuarioService = {
    salvar,
    listar,
    buscarPorId,
    excluir,
    login
};

export default usuarioService;