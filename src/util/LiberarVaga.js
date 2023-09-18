async function LiberarVaga(resposta, setResposta, index) {
    const updatedResposta = [...resposta];
    updatedResposta[index] = {
      ...updatedResposta[index],
      placa: "",
      chegada: "",
      temporestante: "",
      corline: "#fff",
      display: "testeNot2",
    };
    const newArray = updatedResposta.filter((item) => item !== undefined);
    setResposta(newArray);
    localStorage.setItem("listaVagas", JSON.stringify(newArray));
    console.log('SETOU AQUI O LOCAL')
  }
  
  export default LiberarVaga;
  