import { useEffect, useState } from "react";
import { Group, Loader, Pagination } from "@mantine/core";
import VoltarComponente from "../util/VoltarComponente";
import Filtro from "../util/Filtro";
import formatNumero from '../util/formatNumero';
import { AiFillPrinter } from 'react-icons/ai';
import Logo from '../util/logoconseproof2.png';
import { ArrumaHora } from '../util/ArrumaHora';
import createAPI from "../services/createAPI";
import jsPDF from 'jspdf';

const ListarMovimentosFinanceiros = () => {
  const [estado, setEstado] = useState(false);
  const [estado2, setEstado2] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [estadoLoading, setEstadoLoading] = useState(false);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;
  const [totalValor, setTotalValor] = useState(0);
  const [dataFiltrada, setDataFiltrada] = useState('');
  const [nomeFiltrado, setNomeFiltrado] = useState('');

   const handlePageChange = (pageNumber) => {
     setCurrentPage(pageNumber);
   };
 
   const indexOfLastItem = currentPage * itemsPerPage;
   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
   const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
 
  useEffect(() => {
    const listar = async () => {
      setEstado(false);
      setDataFiltrada('');
      setNomeFiltrado('');
      setMensagem("");
      const requisicao = createAPI();
      try {
        const response = await requisicao.get(`/financeiro/movimentos`)
        if (response.data.data && response.data.data.length > 0) {
          setEstado2(true);
          const newData = response.data.data.map((item) => ({
          id_transacao: item.id_transacao,
          data: item.data,
          tipo: item.tipo,
          valor: item.valor,
          usuario: item.usuario,
          perfil: item.perfil,
          }));
          setData(newData);
          const total = newData.reduce((acc, item) => acc + item.valor, 0);
          setTotalValor(total);
        } else {
          setData([]);
          setTotalValor(0);
          setEstado(true);
          setEstado2(true);
          setMensagem("Não há movimentos para exibir");
        }
      } catch (error) {
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
      }
    };
    listar();
  }, []);

  const handleConsultaSelected = (consulta) => {
    handleFiltro(consulta);
  };

  const handleFiltro = async (where) => {
    setDataFiltrada('');
    setNomeFiltrado('');
    setEstadoLoading(true);
    setEstado(false);
    setMensagem("");
    const requisicao = createAPI();
    const base64 = btoa(where);
    const queryObject = JSON.parse(where);

    if (queryObject) {
      const periodoCondition = queryObject.where.find(condition => condition.field === 'periodo');
      const nomeCondition = queryObject.where.find(condition => condition.field === 'nome');
      const dataCondition = queryObject.where.find(condition => condition.field === 'data');
      if (periodoCondition && periodoCondition.value) {
        const periodoValue = periodoCondition.value;
        const formattedPeriodoValue = `Período: De ${new Date(periodoValue[0] + 'T00:00:00').toLocaleDateString('pt-BR')} até ${new Date(periodoValue[1]+'T00:00:00').toLocaleDateString('pt-BR')}`;
        setDataFiltrada(formattedPeriodoValue);
      }else if (nomeCondition && nomeCondition.value[1]) {
        const nomeValue = nomeCondition.value;
        const formattedNomeValue = `Período: De ${new Date(nomeValue[1] + 'T00:00:00').toLocaleDateString('pt-BR')} até ${new Date(nomeValue[2]+'T00:00:00').toLocaleDateString('pt-BR')}`;
        const nome = `Nome: ${nomeValue[0].replace(/^%|%$/g, '').charAt(0).toUpperCase() + nomeValue[0].replace(/^%|%$/g, '').slice(1)}`;
        setDataFiltrada(formattedNomeValue);
        setNomeFiltrado(nome);
      } else if (dataCondition && dataCondition.value) {
        let dataValue = dataCondition.value;
        dataValue = dataValue.replace(/%/g, '');
        const date = new Date(dataValue);
        const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
        const formattedDataValue = `Data: ${localDate.toLocaleDateString('pt-BR')}`;
        setDataFiltrada(formattedDataValue);
      }
    }
    requisicao
      .get(`/financeiro/movimentos?query=${base64}`)
      .then((response) => {
        setEstadoLoading(false);
        setEstado2(true);
        if (response.data.data && response.data.data.length > 0) {
          setEstado2(true);
          const newData = response.data.data.map((item) => ({
            id_transacao: item.id_transacao,
            data: item.data,
            tipo: item.tipo,
            valor: item.valor,
            usuario: item.usuario,
            perfil: item.perfil,
          }));
          setData(newData);
          const total = newData.reduce((acc, item) => acc + parseFloat(item.valor), 0);
          setTotalValor(total);
        } else {
          setData([]);
          setTotalValor(0);
          setEstado(true);
          setEstado2(true);
          setMensagem("Não há movimentos para exibir");
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

  const gerarPdf = () => {
    const doc = new jsPDF({ orientation: 'landscape' });
    const user = localStorage.getItem('user');
    const user2 = JSON.parse(user);
    const header = () => {
      const logoWidth = 30;
      const logoHeight = 12;
      const logoPositionX = doc.internal.pageSize.width - 15 - logoWidth;
      const logoPositionY = 6;
      doc.addImage(Logo, 'PNG', logoPositionX, logoPositionY, logoWidth, logoHeight);
      const dataAtual = ArrumaHora(new Date().toISOString());
      doc.setFontSize(16);
      doc.setTextColor(40);
      doc.text(`Relatório Financeiro ${dataFiltrada}`, 13, 10);
      
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`${nomeFiltrado}`, 13, 15);
      doc.text(`Gerado por: ${user2.nome}`, 13, 20);
      doc.text(`Data: ${dataAtual}`, 13, 25);
    };

    const tableBody = [];

    data.forEach((item) => {
      tableBody.push([
        ArrumaHora(item.data),
        item.usuario.charAt(0).toUpperCase() + item.usuario.slice(1),
        item.perfil.charAt(0).toUpperCase() + item.perfil.slice(1),
        item.tipo.replace('cartao', 'cartão').charAt(0).toUpperCase() + item.tipo.slice(1),
        `R$ ${formatNumero(item.valor)}`,
      ]);
    });

    tableBody.push([
      { content: 'Total', styles: { halign: 'left', fontStyle: 'bold' } },
      { content: `R$ ${formatNumero(totalValor)}`, colSpan: 7, styles: { halign: 'right', fontStyle: 'bold' } }
    ]);

    const margins = { top: 35 };
    const columnStyles = {
      0: { cellWidth: 70 },
      1: { cellWidth: 70 },
      2: { cellWidth: 70 },
    };

    doc.autoTable({
      head: [['Data','Nome','Perfil','Tipo', 'Valor']],
      body: tableBody,
      didDrawPage: header,
      margin: margins,
      styles: {
        lineColor: [100],
        lineWidth: 0.3,
        fillColor: false,
        textColor: 0,
        fontSize: 10,
        cellPadding: 2
      },
      columnStyles: columnStyles,
      headStyles: {
        fillColor: [200],
        textColor: 0,
      },
      alternateRowStyles: {
        fillColor: false,
      },
    });

    doc.save(`Relatório_financeiro_${dataFiltrada}.pdf`);
  };
  
  return (
    <div className="dashboard-container mb-3">
      <p className="me-3 text-start fs-4 fw-bold">Listar Movimentos Financeiros</p>
      <div className="row me-2 mb-3">
        <div className="col-7">
          <Filtro nome={"ListarMovimentosFinanceiros"} onConsultaSelected={handleConsultaSelected} onLoading={estadoLoading} />
        </div>
        <div className="col-3">
        </div>
        <div className="col-2">
          <button className="btn3 botao p-0 m-0 w-100 h-100" type="button" onClick={() => { gerarPdf() }}><AiFillPrinter size={21} /></button>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="row">
            <div className="col-12 mb-4">
              <div className="text-start">
              <p><strong>{dataFiltrada}</strong></p>
              </div>
              {estado2 ? (
                <div className="card border-0 shadow">
                  <div
                    className="table-responsive"
                    style={{ overflowX: "auto" }}
                  >
                    <table className="table align-items-center table-flush">
                      <thead className="thead-light">
                        <tr>
                          <th
                            className="border-bottom"
                            id="tabelaUsuarios"
                            scope="col"
                          >
                            Data
                          </th>
                          <th
                            className="border-bottom"
                            id="tabelaUsuarios"
                            scope="col"
                          >
                            Nome
                          </th>
                          <th
                            className="border-bottom"
                            id="tabelaUsuarios"
                            scope="col"
                          >
                            Perfil
                          </th>
                          <th
                            className="border-bottom"
                            id="tabelaUsuarios"
                            scope="col"
                          >
                            Tipo
                          </th>
                          <th
                            className="border-bottom"
                            id="tabelaUsuarios"
                            scope="col"
                          >
                            Valor
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentItems.map((item, index) => (
                          <tr key={index}>
                            <td id="tabelaUsuarios">{new Date(item.data).toLocaleString()}</td>
                            <td id="tabelaUsuarios">{item.usuario.charAt(0).toUpperCase() + item.usuario.slice(1)}</td>
                            <td id="tabelaUsuarios">{item.perfil.charAt(0).toUpperCase() + item.perfil.slice(1)}</td>
                            <td id="tabelaUsuarios">
                              {item.tipo === 'cartao' ? 'Cartão' : item.tipo.charAt(0).toUpperCase() + item.tipo.slice(1)}
                            </td>
                            <td id="tabelaUsuarios">{`R$ ${parseFloat(item.valor).toFixed(2)}`}</td>

                          </tr>
                        ))}
                        {!estado ? (
                          <tr>
                            <td className="font-weight-bold">Total</td>
                            <td colSpan="3" className="text-end font-weight-bold">{`R$ ${formatNumero(totalValor)}`}</td>
                          </tr>) : (null)}
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
              ) : (
                <div className="col-12 text-center mt-4 mb-4">
                  <Loader />
                </div>
              )}
            </div>
          </div>
        </div>
        <Group position="center" mb="md">
          <Pagination
            value={currentPage}
            size="sm"
            onChange={handlePageChange}
            total={
              Math.floor(data.length / 50) === data.length / 50
                ? data.length / 50
                : Math.floor(data.length / 50) + 1
            }
            limit={itemsPerPage}
          />
        </Group>
      </div>
      <VoltarComponente />
    </div>
  );
};

export default ListarMovimentosFinanceiros;
