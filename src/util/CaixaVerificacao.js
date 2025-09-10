import MensagemCaixa from "../components/MensagemCaixa";

function CaixaVerificacao(Componente) {
  return function verificado(props) {
    const user = localStorage.getItem("user");
    const userDados = JSON.parse(user);
    const caixa = localStorage.getItem("caixa") ?? "false";
    if (
      userDados &&
      userDados.perfil &&
      userDados.perfil[0] === "monitor" &&
      caixa !== "true"
    ) {
      return <MensagemCaixa />;
    }
    return <Componente {...props} />;
  };
}

export default CaixaVerificacao;