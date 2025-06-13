import createAPI from "../services/createAPI";

export const MensagemCompra = async () => {
    const requisicao = createAPI();
    try {
        const response = await requisicao.get("financeiro/mensagem/");
        if (
            response.data.msg?.resultado &&
            response.data.data.length > 0
        ) {
            return response.data.data[0].texto;
        }
        return null;
    } catch (error) {
        if (
            error?.response?.data?.msg === "Cabeçalho inválido!" ||
            error?.response?.data?.msg === "Token inválido!" ||
            error?.response?.data?.msg === "Usuário não possui o perfil mencionado!"
        ) {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            localStorage.removeItem("perfil");
        }
        return null;
    }
};