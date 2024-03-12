import React, { useEffect, useState } from "react";
import createAPI from "../services/createAPI";
import ValidarRequisicao from "../util/ValidarRequisicao";
import { AiFillCheckCircle, AiFillPrinter } from "react-icons/ai";
import Filtro from "../util/Filtro";
import Logo from '../util/logoconseproof2.png';
import jsPDF from "jspdf";
import { Button, Divider } from "@mantine/core";

const RelatorioMonitorAdmin = () => {
  const [monitor, setMonitor] = useState([]);
  const [step, setStep] = useState(0);
  const [estadoLoading, setEstadoLoading] = useState(false);
  const [Relatorio, setRelatorio] = useState([]);

  const HandleGetMonitor = async () => {
    const requisicao = await createAPI();

    let query = `{"where": [{ "field": "perfil", "operator": "=", "value": "admin" },{ "field": "perfil", "operator": "=", "value": "monitor" }]}`;

    query = btoa(query);

    requisicao
      .get(`/usuario/listar/?query=${query}`)
      .then((res) => {
        if (res.data.msg.resultado) {
          const ArrayAtivos = res.data.data.filter((item) => {
            return item.ativo === "S";
          });

          const newData = ArrayAtivos.map((item) => {
            return {
              id: item.id_usuario,  
              nome: item.nome,
              email: item.email === "" ? "Não informado" : item.email,
              telefone: item.telefone,
              perfil: item.perfil,
              checked: false,
            };
          });

          setMonitor(newData);
        } else {
          console.log("Erro ao buscar monitor");
        }
      })
      .catch((err) => {
        ValidarRequisicao(err);
      });
  };

  const HandleGetMovByMonitor = async (query) => {
    setEstadoLoading(true);
    const requisicao = await createAPI();

    const Array = monitor.filter((item) => {
      return item.checked === true;
    });

    const NewArray = Array.map((item) => {
      return item.id;
    });

    query = query.split("]}");

    query = query[0].replace(/%/g, '');

    query = query + `, { "field": "id_usuario", "operator": "IN", "value": "[${NewArray}]" }]}`;
    
    query = btoa(query);

    requisicao
      .get(`financeiro/monitor/relatorio/?query=${query}`)
      .then((res) => {
        setEstadoLoading(false);
        if (res.data.msg.resultado) {
          setStep(1);

          console.log(res.data.data);
          setRelatorio(res.data.data);
        } else {
          console.log("Erro ao buscar movimento");
        }
      })
      .catch((err) => {
        ValidarRequisicao(err);
      });
  };

  useEffect(() => {
    HandleGetMonitor();
  }, []);

  const gerarPdf = (index) => {
    const user = localStorage.getItem('user');
    const user2 = JSON.parse(user);
    const doc = new jsPDF({ orientation: 'landscape' });

    const RelatorioNew = Relatorio[index];

    const header = () => {
      const logoWidth = 30;
      const logoHeight = 12;
      const logoPositionX = doc.internal.pageSize.width - 15 - logoWidth;
      const logoPositionY = 6;
      doc.addImage(Logo, 'PNG', logoPositionX, logoPositionY, logoWidth, logoHeight);

      doc.setFontSize(16);
      doc.setTextColor(40);
      doc.text('Relatório Monitores', 3.5, 10);
      doc.setFontSize(10);
      doc.setTextColor(100);
      const dateNow = new Date();
      const day = dateNow.getDate().toString().padStart(2, '0');
      const month = (dateNow.getMonth() + 1).toString().padStart(2, '0');
      const year = dateNow.getFullYear().toString();
      const hour = dateNow.getHours().toString().padStart(2, '0');
      const minute = dateNow.getMinutes().toString().padStart(2, '0');
      const formattedDate = `${day}/${month}/${year} ${hour}:${minute}`;
      doc.text(`Gerado por: ${user2.nome}`, 3.5, 18);
      doc.text(`Data: ${formattedDate}`, 3.5, 22);
      doc.text(`Monitor: ${RelatorioNew.nome}`, 3.5, 26);
    };

    header()

    const PdfData = [
      [`${RelatorioNew.nome}`, { content: 'Regularização', colSpan: 4 },{ content: 'Estacionamento', colSpan: 4 }, { content: 'Recarga', colSpan: 4 }, { content: 'Total arrecadado', colSpan: 3 },],
      [['', 'Nº' ,'Din', 'Pix', 'Total', 'Nº' , 'Din', 'Pix', 'Total' , 'Nº' , 'Din', 'Pix','Total' , 'Din', 'Pix', 'Total']],
    ];

    const regularizacao = Object.keys(RelatorioNew.data).map((date) => {  
        return [
          RelatorioNew.data[date].data,
          RelatorioNew.data[date].Regularizacao.quantidade,
          formatNumero(RelatorioNew.data[date].Regularizacao.dinheiro),
          formatNumero(RelatorioNew.data[date].Regularizacao.pix),
          formatNumero(RelatorioNew.data[date].Regularizacao.TotalValor),
          RelatorioNew.data[date].estacionamento.quantidade,
          formatNumero(RelatorioNew.data[date].estacionamento.dinheiro),
          formatNumero(RelatorioNew.data[date].estacionamento.pix),
          formatNumero(RelatorioNew.data[date].estacionamento.TotalValor),
          RelatorioNew.data[date].creditosInseridos.quantidade,
          formatNumero(RelatorioNew.data[date].creditosInseridos.dinheiro),
          formatNumero(RelatorioNew.data[date].creditosInseridos.pix),
          formatNumero(RelatorioNew.data[date].creditosInseridos.TotalValor),
          formatNumero(RelatorioNew.data[date].finalTotal.dinheiro),
          formatNumero(RelatorioNew.data[date].finalTotal.pix),
          formatNumero(RelatorioNew.data[date].finalTotal.TotalValor)
        ];
      });
    
    PdfData.push(regularizacao);

    let TotalFinal = new Array(16).fill(0);

    Object.keys(RelatorioNew.data).map((date) => {
        TotalFinal[0] = "Total";
        TotalFinal[1] += RelatorioNew.data[date].Regularizacao.quantidade;
        TotalFinal[2] += parseFloat(RelatorioNew.data[date].Regularizacao.dinheiro);
        TotalFinal[3] += parseFloat(RelatorioNew.data[date].Regularizacao.pix);
        TotalFinal[4] += parseFloat(RelatorioNew.data[date].Regularizacao.TotalValor);
        TotalFinal[5] += RelatorioNew.data[date].estacionamento.quantidade;
        TotalFinal[6] += parseFloat(RelatorioNew.data[date].estacionamento.dinheiro);
        TotalFinal[7] += parseFloat(RelatorioNew.data[date].estacionamento.pix);
        TotalFinal[8] += parseFloat(RelatorioNew.data[date].estacionamento.TotalValor);
        TotalFinal[9] += RelatorioNew.data[date].creditosInseridos.quantidade;
        TotalFinal[10] += parseFloat(RelatorioNew.data[date].creditosInseridos.dinheiro);
        TotalFinal[11] += parseFloat(RelatorioNew.data[date].creditosInseridos.pix);
        TotalFinal[12] += parseFloat(RelatorioNew.data[date].creditosInseridos.TotalValor);
        TotalFinal[13] += parseFloat(RelatorioNew.data[date].finalTotal.dinheiro);
        TotalFinal[14] += parseFloat(RelatorioNew.data[date].finalTotal.pix);
        TotalFinal[15] += parseFloat(RelatorioNew.data[date].finalTotal.TotalValor);
    });

    TotalFinal[2] = formatNumero(TotalFinal[2]);
    TotalFinal[3] = formatNumero(TotalFinal[3]);
    TotalFinal[4] = formatNumero(TotalFinal[4]);
    TotalFinal[6] = formatNumero(TotalFinal[6]);
    TotalFinal[7] = formatNumero(TotalFinal[7]);
    TotalFinal[8] = formatNumero(TotalFinal[8]);
    TotalFinal[10] = formatNumero(TotalFinal[10]);
    TotalFinal[11] = formatNumero(TotalFinal[11]);
    TotalFinal[12] = formatNumero(TotalFinal[12]);
    TotalFinal[13] = formatNumero(TotalFinal[13]);
    TotalFinal[14] = formatNumero(TotalFinal[14]);
    TotalFinal[15] = formatNumero(TotalFinal[15]);

    PdfData.push([TotalFinal]);
      
    let headStyles = {
      fillColor: [255, 255, 255], 
      textColor: [0, 0, 0], 
      fontStyle: 'bold', 
      lineWidth: 0.1, 
      lineColor: [0, 0, 0],
      halign: 'center'
    }

    const columnStyles = {
      0: { cellWidth: 21 },
      1: { cellWidth: 13 },
      2: { cellWidth: 19 },
      3: { cellWidth: 19 },
      4: { cellWidth: 19 },
      5: { cellWidth: 13 },
      6: { cellWidth: 19 },
      7: { cellWidth: 19 },
      8: { cellWidth: 19 },
      9: { cellWidth: 13  },
      10: { cellWidth: 19 },
      11: { cellWidth: 19 },
      12: { cellWidth: 19 },
      13: { cellWidth: 19 },
      14: { cellWidth: 19 },
      15: { cellWidth: 19 },
      16: { cellWidth: 19 },
      17: { cellWidth: 19 },
    };

    doc.autoTable({
      head: [PdfData[0]],
      body: PdfData.slice(1).flat(),
      startY: 30,
      theme: 'grid',
      margin: { left: 3.5, right: 3.5},
      columnStyles: columnStyles,
      headStyles: headStyles,
      styles: {
        fontSize: 7, 
      },
      didParseCell: (data) => {
        const rowIndex = data.row ? data.row.index : null;
        const rowCount = data.table.body.length;

        if (rowIndex !== null && (rowIndex === 0 || rowIndex === rowCount - 1)) {
        const columnCount = data.table.columns.length;

        for (let i = 0; i < columnCount; i++) {
          const cell = data.row.cells[i];
          if (cell && cell.styles) {
            cell.styles.fontStyle = 'bold';
        }
      }
    }
    },
    });

    doc.save(`Relatorio Monitor - ${RelatorioNew.nome}.pdf`);
  }

  function formatNumero(number) {
    return new Intl.NumberFormat('pt-BR', { style: 'decimal', minimumFractionDigits: 2 }).format(number);
  }

  return (
    <div className="row" style={{ backgroundColor: "#fff", padding: 20, borderRadius: 15 }}>

      <div className="row">
        <div className="col-12">
          <h4 className="text-center mb-5">Relatório Monitores</h4>
        </div>
      </div>
      {step === 0 ? (
        <>
          <div className="row">
            <div className="col-12">
              <h5 className="text-start text-muted">Selecione a Monitora:</h5>
            </div>
          </div>
          <table className="table table-striped table-hover table-bordered table-responsive">
            <thead>
              <tr className="text-center">
                <th>
                  <AiFillCheckCircle size={20} />
                </th>
                <th>Nome</th>
                <th>Perfil</th>
              </tr>
            </thead>
            <tbody>
              {monitor.map(
                (link, index) =>
                  link.pago !== "S" &&
                  (monitor.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center">
                        Carregando...
                      </td>
                    </tr>
                  ) : (
                    <tr key={index}>
                      <td
                        className="px-1"
                        style={{ width: "40px", textAlign: "center" }}
                      >
                        <input
                          type="checkbox"
                          checked={link.checked}
                          onChange={() => {
                            link.checked = !link.checked;
                            setMonitor([...monitor]);
                          }}
                          style={{ width: "20px", height: "20px" }}
                        />
                      </td>
                      <td>{link.nome}</td>
                      <td>
                        {link.perfil.toUpperCase().charAt(0) +
                          link.perfil.slice(1).toLowerCase()}
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
          <div className="row">
            <div className="col-12 mb-5">
              <Filtro
                nome="RelatorioMonitorAdmin"
                onConsultaSelected={HandleGetMovByMonitor}
                onLoading={estadoLoading}
              />
            </div>
          </div>
        </>
      ) : step === 1 ? (
        <>
        {Relatorio.length === 0 ? (
          <div className="row">
            <div className="col-12">
              <h5 className="text-center">Nenhum registro encontrado</h5>
            </div>
          </div>
        ) : (
          <div className="row">
            <div className="col-12">
            {Relatorio.map((item, index) => (
              <div className="mt-5 mb-5" key={index}>
                <div className="row mb-2">
                  <div className="col-10">
                    <h5 className="card-title text-start">Monitor: {item.nome}</h5>
                  </div>
                  <div className="col-2">
                    <button className="btn3 botao p-0 m-0 w-100 h-100" type="button" onClick={()=>{gerarPdf(index);}}><AiFillPrinter  size={21}/></button>
                  </div>
                  </div>
                      <div className="table-responsive">
                          <table className="table align-items-center table-flush">
                              <thead className="thead-light">
                                  <tr>
                                      <th className="border-bottom" id="tabelaUsuarios" scope="col">Data</th>
                                      <th className="border-bottom" id="tabelaUsuarios2" scope="col">Regularização</th>
                                      <th className="border-bottom" id="tabelaUsuarios2" scope="col">Estacionamento</th>
                                      <th className="border-bottom" id="tabelaUsuarios2" scope="col">Recarga</th>
                                      <th className="border-bottom" id="tabelaUsuarios" scope="col">Total arrecadado</th>
                                  </tr>
                              </thead>
                              <tbody> 
                              {Object.keys(item.data).map((date, index) => (
                                      <tr className="card-list" key={index}>
                                          <th className='fw-bolder col' id="tabelaUsuarios"> {item.data[date].data} </th>
                                          <td className='fw-bolder col' id="tabelaUsuarios2"> {formatNumero(item.data[date].Regularizacao.TotalValor)} </td>
                                          <td className='fw-bolder col' id="tabelaUsuarios2"> {formatNumero(item.data[date].estacionamento.TotalValor)} </td>
                                          <td className='fw-bolder col' id="tabelaUsuarios2"> {formatNumero(item.data[date].creditosInseridos.TotalValor)} </td>
                                          <td className='fw-bolder col' id="tabelaUsuarios"> {formatNumero(item.data[date].finalTotal.TotalValor)} </td>
                                      </tr> 
                                ))}
                              </tbody>
                          </table>
                      </div>
                      <Divider my="sm" size="md" mt={5} variant="dashed" />
                  </div>
              ))}
          </div>
          <Button className="btn3" style={{
            backgroundColor: "#F2F4F6",
            color: "#000",
            borderColor: "#000",
            marginTop: 20,
          }} size="lg" onClick={() => setStep(0)}>Voltar</Button>
           
          
        </div>
        )}
        </>
      ) : null}
    </div>
  );
};

export default RelatorioMonitorAdmin;
