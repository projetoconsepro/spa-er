import React, { useState } from "react";
import createAPI from "../services/createAPI";
import ImpressaoFecharCaixa from "../util/ImpressaoFecharCaixa";

function ImprimirCaixa() {
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  const gerarComprovante = async () => {
    setLoading(true);
    setErro("");
    const requisicao = createAPI();
    await requisicao.get("/caixa/fechar/" + user.id_usuario)
      .then((response) => {
        if (response.data.msg.resultado) {
          const dados = response.data.data;
          const valorFechamento =
            parseFloat(dados.valor_abertura) +
            parseFloat(dados.valor_movimentos);
          ImpressaoFecharCaixa(dados, valorFechamento, user.nome);
        } else {
          setErro(response.data.msg.resultado);
        }
      })
      .catch((error) => {
        setErro("Erro ao gerar comprovante. Tente novamente.");
        if (
          error?.response?.data?.msg === "Cabeçalho inválido!" ||
          error?.response?.data?.msg === "Token inválido!" ||
          error?.response?.data?.msg ===
            "Usuário não possui o perfil mencionado!"
        ) {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          localStorage.removeItem("perfil");
        } else {
          console.log(error);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="d-flex align-items-center justify-content-center mt-1 px-2">
      <div className="">
        <div
          className="card-header text-white text-center rounded-top-4"
          style={{ background: "linear-gradient(90deg, #0d6efd, #0a58ca)" }}
        >
          <i className="bi bi-printer-fill fs-1 mb-2"></i>
          <h4 className="fw-bold mb-0">Comprovante Caixa</h4>
          <small className="text-light opacity-75">
            Gere o comprovante do seu caixa atual
          </small>
        </div>

        <div
          className="card-body text-center p-4 h-100"
          style={{
            background: "linear-gradient(135deg, #e3f2fd, #ffffff, #e8f5e9)",
          }}
        >
          {erro && (
            <div className="alert alert-danger py-2" role="alert">
              {erro}
            </div>
          )}

          <div className="my-4">
            <i
              className="bi bi-cash-coin text-primary mb-3"
              style={{ fontSize: "2.5rem" }}
            ></i>
            <p className="text-muted">
              Clique no botão abaixo para imprimir o comprovante de fechamento.
            </p>
          </div>

          <button
            className="btn btn-info btn-lg w-100 shadow-sm"
            onClick={gerarComprovante}
            disabled={loading}
            style={{ borderRadius: "12px" }}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                ></span>
                Gerando Comprovante...
              </>
            ) : (
              <>
                <i className="bi bi-printer-fill me-2"></i>
                Gerar Comprovante
              </>
            )}
          </button>
        </div>
        <div className="mt-4 text-muted small">
          <i className="bi bi-info-circle me-1 text-primary"></i>
          Este comprovante será gerado com base no seu fechamento atual.
        </div>
      </div>
    </div>
  );
}

export default ImprimirCaixa;
