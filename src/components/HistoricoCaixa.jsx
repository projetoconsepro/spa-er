import { React, useEffect, useState } from "react";
import { AiFillPrinter, AiOutlineReload } from "react-icons/ai";
import Swal from "sweetalert2";
import RelatoriosPDF from "../util/RelatoriosPDF";
import VoltarComponente from "../util/VoltarComponente";
import Filtro from "../util/Filtro";
import createAPI from "../services/createAPI";
import {ArrumaHora3} from "../util/ArrumaHora";
import { Button} from '@mantine/core';

const HistoricoCaixa = ( ) => {
  const idCaixa = localStorage.getItem("idCaixa");
  const [data, setData] = useState([]);
  const [estado, setEstado] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [estadoLoading, setEstadoLoading] = useState(false);
  const [estadoAtualizaValor, setEstadoAtualizaValor] = useState();
  const [modalItem, setModalItem] = useState(null);
  useEffect(() => {
    reload();
  }, []);

  const createPDF = () => {
    const dataD = [];
    const nomeArquivo = "Relatório do caixa";
    const cabecalho = [
      "Data",
      "Nome",
      "Abertura",      
      "Valor de abertura",
      "Fechamento",
      "Valor de fechamento",
    ];
    dataD.push(
      ...data.map((item) => [
        item.data,
        item.nome,
        item.hora_abertura,
        `R$${parseFloat(item.valor_abertura).toFixed(2)}`,
        item.hora_fechamento,
                `${
          item.valor_fechamento === null
            ? "Caixa em aberto"
            : `R$${parseFloat(item.valor_fechamento).toFixed(2)}`
        }`,
      ])
    );
    RelatoriosPDF(nomeArquivo, cabecalho, dataD);
  };

  const confirmarValorReal = async (id_caixa, valor_real = null) => {
    const requisicao = createAPI();
    let valorFinal = null;
    if (valor_real !== null && valor_real !== undefined) {
      const valorStr = String(valor_real);
      valorFinal = parseFloat(valorStr.replace(',', '.')).toFixed(2);
    }
    try {
      const response = await requisicao.post('/caixa/valor-real', {
        valor_real: valorFinal,
        id_caixa: id_caixa,
      });
      return !!response.data.msg.resultado;
    } catch (error) {
      if (
        error?.response?.data?.msg === 'Cabeçalho inválido!' ||
        error?.response?.data?.msg === 'Token inválido!' ||
        error?.response?.data?.msg === 'Usuário não possui o perfil mencionado!'
      ) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('perfil');
      } else {
        console.log(error);
      }
      return false;
    }
  };

  const mostrarInformacoes = (item) => {
  Swal.fire({
    title: "Detalhes do Caixa",
    html: `
      <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:12px; padding:21px; margin:16px auto 0; max-width:420px; box-shadow:0 4px 10px rgba(0,0,0,0.06); color:#2d3748; font-size:15px;">
      
        <div style="margin-bottom:14px;">
          <div style="display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px solid #edf2f7;">
            <span style="font-weight:500;">Monitor:</span>
            <span>${item.nome}</span>
          </div>
          <div style="display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px solid #edf2f7;">
            <span style="font-weight:500;">Data:</span>
            <span>${item.data}</span>
          </div>
          <div style="display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px solid #edf2f7;">
            <span style="font-weight:500;">Abertura:</span>
            <span>${item.hora_abertura}</span>
          </div>
          <div style="display:flex; justify-content:space-between; padding:6px 0;">
            <span style="font-weight:500;">Fechamento:</span>
            <span>${item.hora_fechamento}</span>
          </div>
        </div>

        <div style="background:#f8fafc; padding:10px; border-radius:8px; margin-bottom:14px;">
          <h4 style="margin:0 0 8px; font-size:14px; font-weight:600; color:#2d3748;">Valores</h4>
          <div style="display:flex; justify-content:space-between; padding:4px 0;">
            <span>Valor Abertura:</span>
            <span style="color:#3182ce; font-weight:600;">R$${parseFloat(item.valor_abertura).toFixed(2)}</span>
          </div>
          <div style="display:flex; justify-content:space-between; padding:4px 0;">
            <span>Valor Fechamento:</span>
            <span style="color:#38a169; font-weight:600;">
              ${item.valor_fechamento === null? "Caixa em aberto": `R$${parseFloat(item.valor_fechamento).toFixed(2)}`}
            </span>
          </div>
          <div style="display:flex; justify-content:space-between; padding:4px 0;">
            <span>Valor Real:</span>
            <span id="valorRealSpan" style="color:#dd6b20; font-weight:600;">
              ${item.valor_real? `R$${parseFloat(item.valor_real).toFixed(2)}`: 'Não informado'}
            </span>
          </div>
        </div>

        ${item.fechamento_auto
          ? `
          <div id="fechamentoAutoContainer" 
            style="margin:18px 0 25px 0; padding:16px; border:1px solid #f6e05e; border-radius:10px; background:#fffbea;">
            
            <h4 style="margin:0 0 10px; font-size:14px; font-weight:600; color:#744210; text-align:center;">
              Confirmação necessária
            </h4>
            <p style="margin:0 0 14px; font-size:13px; line-height:1.5; color:#5c4b29; text-align:justify;">
              Este caixa foi <strong>fechado automaticamente</strong>.  
              Para garantir a precisão dos registros, confirme se o <span style="font-weight:800;">valor real</span> está correto ou atualize caso seja necessário.
            </p>
            
            <div style="display:flex; gap:10px; justify-content:center;">
              <button id="btnConfirmarValor"
                style="background:#3182ce; color:#fff; border:none; padding:8px 18px; border-radius:6px; font-size:13px; font-weight:500; cursor:pointer; transition:background 0.2s;"
                onmouseover="this.style.background='#2b6cb0'"
                onmouseout="this.style.background='#3182ce'"
              >
                Confirmar valor
              </button>
              <button id="btnEditarValor"
                onclick="document.getElementById('editarValorContainer').style.display='block'; document.getElementById('fechamentoAutoContainer').style.display='none';"
                style="background:#e53e3e; color:#fff; border:none; padding:8px 18px; border-radius:6px; font-size:13px; font-weight:500; cursor:pointer; transition:background 0.2s;"
                onmouseover="this.style.background='#c53030'"
                onmouseout="this.style.background='#e53e3e'"
              >
                Editar valor
              </button>
            </div>
          </div>
          `
          : ''
        }

        <div id="editarValorContainer" style="display:none; margin-top:20px; margin-bottom:20px; padding:16px; border:1px solid #e2e8f0; border-radius:10px; background:#f9fafb;">
          <h4 style="margin:0 0 12px; font-size:14px; font-weight:600; color:#2d3748; text-align:start;">
            Atualizar Valor Real
          </h4>
          
          <form>
            <div style="margin-bottom:12px;">
              <div style="position:relative;">
                <span style="position:absolute; top:50%; left:12px; transform:translateY(-50%); color:#718096; font-size:14px;">R$</span>
                <input 
                  type="text" 
                  id="valorReal" 
                  placeholder="Digite o valor" 
                  step="0.01"
                  style="width:100%; padding:12px 12px 12px 36px; border:1px solid #cbd5e0; border-radius:8px; font-size:15px; outline:none; transition:all .2s;"
                  onfocus="this.style.borderColor='#3182ce'" 
                  onblur="this.style.borderColor='#cbd5e0'" 
                />
              </div>
            </div>

            <div style="display:flex; gap:10px; justify-content:flex-end; margin-top:14px;">
              <button type="button" 
                onclick="document.getElementById('editarValorContainer').style.display='none'; document.getElementById('fechamentoAutoContainer').style.display='block';"
                style="background:#a0aec0; color:#fff; border:none; padding:8px 16px; border-radius:6px; font-size:13px; font-weight:500; cursor:pointer; transition:background 0.2s;"
                onmouseover="this.style.background='#718096'"
                onmouseout="this.style.background='#a0aec0'"
              >
                Cancelar
              </button>

              <button type="submit"
                id="btnConfirmarValorEditar"
                style="background:#3182ce; color:#fff; border:none; padding:8px 16px; border-radius:6px; font-size:13px; font-weight:600; cursor:pointer; transition:background 0.2s;"
                onmouseover="this.style.background='#2b6cb0'"
                onmouseout="this.style.background='#3182ce'"
              >
                Confirmar
              </button>
            </div>
          </form>
        </div>   
        <div
            id="msgValorReal"
            style="
              margin:20px 0;
              display:none;
              border-radius:8px;
              font-size:13px;
              padding:10px 14px;
              font-weight:500;
              box-shadow:0 2px 8px rgba(229,62,62,0.04);
            "
          ></div>

        ${item.descricao
          ? item.descricao === 'Fechamento automático'
            ? `<div style="margin-bottom:14px; background:#fffbea; border:1px solid #f6e05e; border-radius:8px; padding:10px;">
                <p style="margin:0; font-size:13px; line-height:1.4; color:#744210; font-weight:600;">
                  ${item.descricao}
                </p>
              </div>`
            : `<div style="margin-bottom:14px;">
                <h4 style="margin:0 0 6px; font-size:14px; font-weight:600; color:#2d3748;">Descrição</h4>
                <p style="margin:0; font-size:12px; line-height:1.4; color:#4a5568; text-align:justify;">
                  ${item.descricao}
                </p>
              </div>`
          : ''}

        <div style="display:flex; justify-content:space-between; padding:6px 0; border-top:1px solid #edf2f7; font-size:12px; color:#4a5568;">
          <span>Fechamento realizado por:</span>
          <span style="font-weight:600;">${item.usuario_adm}</span>
        </div>
      </div>`,
         didOpen: () => {
          const btnConfirmar = document.getElementById('btnConfirmarValor');
          const btnConfirmarEditar = document.getElementById('btnConfirmarValorEditar');
          const valorReal = document.getElementById('valorReal');
          const msgValorReal = document.getElementById('msgValorReal');
        
          function exibirMsgValorReal(sucesso = false) {
            if (!msgValorReal) return;
            msgValorReal.innerText = sucesso ? "Valor real confirmado com sucesso!" : "Erro ao confirmar valor real!";
            msgValorReal.style.display = "block";
            msgValorReal.style.background = sucesso ? "#f0fff4" : "#fff5f5";
            msgValorReal.style.border = sucesso ? "1px solid #38a169" : "1px solid #feb2b2";
            msgValorReal.style.color = sucesso ? "#38a169" : "#e53e3e";
            setTimeout(() => {
              msgValorReal.style.display = "none";
            }, 5000);
          }
        
          function esconderContainers() {
            const aviso = document.getElementById('fechamentoAutoContainer');
            if (aviso) aviso.style.display = 'none';
            const editar = document.getElementById('editarValorContainer');
            if (editar) editar.style.display = 'none';
          }
        
          if (btnConfirmar) {
            btnConfirmar.onclick = async () => {
              const sucesso = await confirmarValorReal(item.id_caixa);
              esconderContainers();
              exibirMsgValorReal(sucesso);
            };
          }
          
          if (btnConfirmarEditar) {
            btnConfirmarEditar.onclick = async (e) => {
              e.preventDefault();
              let valor = valorReal ? valorReal.value.trim() : "";
              if (valor === "" || valor.toLowerCase() === "null") {
                exibirMsgValorReal("Informe o valor real antes de confirmar!");
                return;
              }
              msgValorReal && (msgValorReal.style.display = "none");
              const sucesso = await confirmarValorReal(item.id_caixa, valor);
              esconderContainers();
              if (sucesso) {
                setData(prev => {
                  const novoData = prev.map(i =>
                    i.id_caixa === item.id_caixa
                      ? {
                          ...i,
                          fechamento_auto: false,
                          valor_real: parseFloat(String(valor).replace(',', '.')).toFixed(2)
                        }
                      : i
                  );
                  setTimeout(() => {
                    const valorRealSpan = document.querySelector('#valorRealSpan');
                    if (valorRealSpan) {
                      valorRealSpan.textContent = `R$${parseFloat(String(valor).replace(',', '.')).toFixed(2)}`;
                    }
                  }, 100);
                  return novoData;
                });
                exibirMsgValorReal(true);
              } else {
                exibirMsgValorReal(false);
              }
            };
          }
        },
    showCancelButton: true,
    cancelButtonText: "Fechar",
    showConfirmButton: item.valor_fechamento === null ? true : false,
  }).then((result) => {
    if (result.isConfirmed) {
    } else if (result.isDenied) {
    } else if (result.isDismissed) {
      Swal.close();
    }
  });
};
 

  const reload = () => {
    const data = new Date();
    const dia = data.getDate();
    const mes = data.getMonth() + 1;
    const ano = data.getFullYear();

    const diaFormatado = dia < 10 ? `0${dia}` : dia;
    const mesFormatado = mes < 10 ? `0${mes}` : mes;
    const dataHoje = `${ano}-${mesFormatado}-${diaFormatado}`;

    const requisicao = createAPI();
    let idrequisicao;
    if (idCaixa === null) {
      idrequisicao = `{"where": [{ "field": "data", "operator": "LIKE", "value": "%${dataHoje}%" }]}`;
    } else {
      idrequisicao = `{"where": [{ "field": "id_caixa", "operator": "=", "value": ${idCaixa} }]}`;
    } 
    const passar = btoa(idrequisicao);
    requisicao
      .get(`/caixa/admin/?query=${passar}`)
      .then((response) => {
        const newData = response.data.data.map((item) => ({
          id_caixa: item.id_caixa,
          data: ArrumaHora3(item.data),
          nome: item.nome,
          usuario_adm: item.usuario_adm,
          hora_abertura: item.hora_abertura,
          hora_fechamento: item.hora_fechamento,
          valor_abertura: item.valor_abertura,
          valor_fechamento: item.valor_fechamento,
          valor_real: item.valor_real_fechamento,
          descricao: item.descricao,
          fechamento_auto: item.fechamento_auto
        }));
        setData(newData);
        localStorage.removeItem("idCaixa");
        setEstado(newData.length <= 0);
        setMensagem(newData.length <= 0 ? "Nenhum registro encontrado" : "");
      })
      .catch((error) => {
        if (
          error?.response?.data?.msg === "Cabeçalho inválido!" ||
          error?.response?.data?.msg === "Token inválido!" ||
          error?.response?.data?.msg === "Usuário não possui o perfil mencionado!"
        ) {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          localStorage.removeItem("perfil");
        } else {
          console.log(error);
        }
      });
  };

  const handleConsultaSelected = (consulta) => {
    setEstadoLoading(true);
    const requisicao = createAPI();
    const base64 = btoa(consulta);
    requisicao
      .get(`/caixa/admin/?query=${base64}`)
      .then((response) => {
        setEstadoLoading(false);
        const newData = response.data.data.map((item) => ({
          id_caixa: item.id_caixa,
          data: ArrumaHora3(item.data),
          nome: item.nome,
          usuario_adm: item.usuario_adm,
          hora_abertura: item.hora_abertura,
          hora_fechamento: item.hora_fechamento,
          valor_abertura: item.valor_abertura,
          valor_fechamento: item.valor_fechamento,
          valor_real: item.valor_real_fechamento,
          descricao: item.descricao,
          fechamento_auto: item.fechamento_auto
        }));
        setData(newData);
        if (newData.length <= 0) {
          setEstado(true);
          setMensagem("Nenhum registro encontrado");
        } else {
          setEstado(false);
          setMensagem("");
        }
      })
      .catch((error) => {
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
      });
  };  

  return (
    <div className="dashboard-container">
      <p className="text-start fs-4 fw-bold ps-md-0 ps-3">Histórico do caixa:</p>
      <div className="mb-3">
        <div className="row">
          <div className="col-md-4 col-9 px-md-2 pt-md-0 ps-4 pt-2  ms-md-0 ">
            <div className="w-100 mx-0">
              <Filtro
                nome="HistoricoCaixa"
                onConsultaSelected={handleConsultaSelected}
                onLoading={estadoLoading}
              />
            </div>
          </div>
          <div className="d-none d-md-block col-md-5"></div>
          <div className="col-md-2 col-9 text-md-end justify-content-center justify-content-md-end me-0 pe-0 pt-1 mt-1 pt-md-0 mt-md-0 px-md-0 px-3 ms-md-0 ms-2">
            <button
              className="btn3 botao p-0 w-100 h-100"
              type="button"
              onClick={() => {
                createPDF();
              }}
            >
              <AiFillPrinter size={21} />
            </button>
          </div>
          <div className="col-md-1 col-2 text-end pt-md-0 pt-2">
            <Button
              variant="gradient"
              gradient={{ from: "indigo", to: "blue", deg: 60 }}
              radius="md"
              size="sm"
              onClick={() => reload()}
            >
              <AiOutlineReload color="white" size={20} />
            </Button>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12 col-xl-12">
          <div className="row">
            <div className="col-12 mb-4">
              <div className="card border-0 shadow">
                <div className="table-responsive">
                  <table className="table align-items-center table-flush">
                    <thead className="thead-light">
                      <tr>
                        <th className="border-bottom" scope="col">
                          Data
                        </th>
                        <th className="border-bottom" scope="col">
                          Monitor
                        </th>
                        <th
                          className="border-bottom"
                          id="tabelaUsuarios2"
                          scope="col"
                        >
                          Abertura
                        </th>
                        <th
                          className="border-bottom"
                          id="tabelaUsuarios2"
                          scope="col"
                        >
                          Valor abertura
                        </th>
                        <th
                          className="border-bottom"
                          id="tabelaUsuarios2"
                          scope="col"
                        >
                          Fechamento
                        </th>

                        <th className="border-bottom" scope="col">
                          Valor fechamento
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((item, index) => (
                        <tr
                          key={index}
                          onClick={() => {
                            mostrarInformacoes(item);
                          }}
                        >
                          <td>{item.data}</td>
                          <td>
                            {item.nome.length > 14
                              ? item.nome.substring(0, 14) + "..."
                              : item.nome}
                          </td>
                          <td id="tabelaUsuarios2">{item.hora_abertura}</td>
                          <td id="tabelaUsuarios2">R${parseFloat(item.valor_abertura).toFixed(2)}</td>
                          <td id="tabelaUsuarios2">{item.hora_fechamento}</td>
                          <td>
                            {item.valor_fechamento === null
                              ? "Caixa em aberto"
                              : `R$${parseFloat(item.valor_fechamento).toFixed(2)}`}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div
                  className="alert alert-danger mt-4 mx-3"
                  role="alert"
                  style={{ display: estado ? "block" : "none" }}
                >
                  {mensagem}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <VoltarComponente />
    </div>
  );
};

export default HistoricoCaixa;
