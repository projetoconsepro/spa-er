import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:3001"
});

export const createSession = async (login, senha) => {
    return api.post('/login', { login, senha });
};

export const registrar = async (nome, email, cpf, telefone , senha) => {
    return api.post('/usuario', { nome, email, cpf, telefone, senha });
};
