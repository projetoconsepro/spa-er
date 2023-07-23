const FuncValidaResponse = (response) => {
    if(response?.response?.data?.msg === "Cabeçalho inválido!" 
    || response?.response?.data?.msg === "Token inválido!" 
    || response?.response?.data?.msg === "Usuário não possui o perfil mencionado!"
    ){
        localStorage.removeItem("user")
        localStorage.removeItem("token")
    } else {
        console.log(response)
    }
}

export default FuncValidaResponse;
