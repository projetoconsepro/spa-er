const ValidarRequisicao = (response) => {
  if (
    response?.response?.data?.msg === "Cabeçalho inválido!" ||
    response?.response?.data?.msg === "Token inválido!" ||
    response?.response?.data?.msg === "Usuário não possui o perfil mencionado!"
  ) {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("perfil");
  } else {
    console.log(response);
  }
};

export default ValidarRequisicao;
