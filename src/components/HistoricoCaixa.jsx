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



  const mostrarInformacoes = (item) => {
    Swal.fire({
      title: "Histórico do caixa",
      html: `
      <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:12px; padding:18px; margin:16px auto; max-width:420px; box-shadow:0 4px 10px rgba(0,0,0,0.06); color:#2d3748; font-size:15px;">
        <div style="margin-bottom:18px; text-align:center;">
          <h3 style="margin:0; font-size:18px; color:#2d3748; font-weight:700;">Detalhes do Caixa</h3>
        </div>

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
            <span style="color:#dd6b20; font-weight:600;">
              ${item.valor_real? `R$${parseFloat(item.valor_real).toFixed(2)}`: 'Não informado'}
            </span>
          </div>
        </div>

        ${item.descricao
          ? `<div style="margin-bottom:14px;">
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
          data: ArrumaHora3(item.data),
          nome: item.nome,
          usuario_adm: item.usuario_adm,
          hora_abertura: item.hora_abertura,
          hora_fechamento: item.hora_fechamento,
          valor_abertura: item.valor_abertura,
          valor_fechamento: item.valor_fechamento,
          valor_real: item.valor_real_fechamento,
          descricao: item.descricao,
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
          data: ArrumaHora3(item.data),
          nome: item.nome,
          usuario_adm: item.usuario_adm,
          hora_abertura: item.hora_abertura,
          hora_fechamento: item.hora_fechamento,
          valor_abertura: item.valor_abertura,
          valor_fechamento: item.valor_fechamento,
          valor_real: item.valor_real_fechamento,
          descricao: item.descricao,
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
