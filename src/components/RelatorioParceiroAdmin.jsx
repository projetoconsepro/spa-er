import React, { useEffect, useState } from 'react';
import createAPI from "../services/createAPI";
import Filtro from "../util/Filtro";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Logo from '../util/logoconseproof2.png';
import formatNumero from '../util/formatNumero';
import { ArrumaHora } from '../util/ArrumaHora';
import "../pages/Style/styles.css";
import VoltarComponente from "../util/VoltarComponente";
import { AiFillPrinter } from "react-icons/ai";

const RelatorioParceiroAdmin = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [resultados, setResultados] = useState([]);
  const [estadoLoading, setEstadoLoading] = useState(false);
  const [showResultados, setShowResultados] = useState(false);
  const [dataFiltrada, setDataFiltrada] = useState('');
  const [totalValue, setTotalValue] = useState(0);
  const [selectedUserName, setselectedUserName] = useState('');
  
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const requisicao = await createAPI();
        let query = `{"where": [{ "field": "perfil", "operator": "=", "value": "admin" },{ "field": "perfil", "operator": "=", "value": "parceiro" }]}`;
        query = btoa(query);

        requisicao.get(`/usuario/listar/?query=${query}`)
          .then((response) => {
            setUsuarios(Array.isArray(response.data.data) ? response.data.data : []);
          })
          .catch((error) => {
            console.error('Erro ao buscar usuários:', error);
          });
      } catch (error) {
        console.error('Erro ao criar API:', error);
      }
    };

    fetchUsuarios();
  }, []);

  const handleCheckboxChange = (userId) => {
    setSelectedUser(userId);
  };

  const HandleGetMovByMonitor = async (query) => {
    try {
      setEstadoLoading(true);
      const queryObject = JSON.parse(query);

      if (queryObject) {
        const periodoCondition = queryObject.where.find(condition => condition.field === 'periodo');
        const dataCondition = queryObject.where.find(condition => condition.field === 'data');

        if (periodoCondition && periodoCondition.value) {
          const periodoValue = periodoCondition.value;
          const formattedPeriodoValue = `Período: De ${periodoValue[0]} até ${periodoValue[1]}`;
          setDataFiltrada(formattedPeriodoValue);

        } else if (dataCondition && dataCondition.value) {
          let dataValue = dataCondition.value;
          dataValue = dataValue.replace(/%/g, '');
          const formattedDataValue = `Data: ${dataValue}`;
          setDataFiltrada(formattedDataValue);
        }
      }

      const requisicao = await createAPI();
      query = query.split("]}");
      query = query[0].replace(/%/g, '');
      query = query + `, { "field": "id_usuario", "operator": "=", "value": "${selectedUser}" }]}`;
      query = btoa(query);

      requisicao
        .get(`financeiro/parceiro/relatorio/?query=${query}`)
        .then((response) => {
          const { resposta, credito } = response.data.data; 
          setResultados({ resposta, credito });
          let totalValue = 0;

          if (resposta && Array.isArray(resposta)) {
            totalValue = resposta.reduce((acc, resultado) => acc + parseFloat(resultado.movimento_valor), 0);
          }

          if (credito && Array.isArray(credito)) {
            const totalCreditoValue = credito.reduce((acc, credito) => acc + parseFloat(credito.credito_valor), 0);
            totalValue += totalCreditoValue;
          }

          const userName = usuarios.find(user => user.id_usuario === selectedUser)?.nome || 'Parceiro';
          
          setselectedUserName(userName);
          setTotalValue(totalValue);
          setEstadoLoading(false);
          setShowResultados(true);
        })
        .catch((error) => {
          console.error('Erro ao buscar relatório:', error);
          setEstadoLoading(false);
        });
    } catch (error) {
      console.error('Erro', error);
      setEstadoLoading(false);
    }
  };

  const handleBackButtonClick = () => {
    setShowResultados(false);
  };

  const handlePrintButtonClick = () => {
    const doc = new jsPDF({ orientation: 'landscape' });
    const header = () => {
      const logoWidth = 30;
      const logoHeight = 12;
      const logoPositionX = doc.internal.pageSize.width - 15 - logoWidth;
      const logoPositionY = 6; 
      doc.addImage(Logo, 'PNG', logoPositionX, logoPositionY, logoWidth, logoHeight);

      doc.setFontSize(16);
      doc.setTextColor(40);
      doc.text(`Relatório - ${selectedUserName}`, 13, 10);
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(dataFiltrada, 13, 18);
      doc.text(`Parceiro: ${selectedUserName}`, 13, 24);
    };

    const tableBody = [];

    resultados.resposta.forEach((resultado) => {
      tableBody.push([
        resultado.tipo.replace('credito', 'Crédito').replace('regularizacao', 'Regularização'),
        resultado.placa,
        `R$ ${formatNumero(resultado.movimento_valor)}`,
        resultado.setor_nome,
        ArrumaHora(resultado.hora),
        resultado.vaga_numero,
        resultado.vaga_local,
        resultado.movimento_tipo.replace('dinheiro', 'Dinheiro'),
      ]);
    });

    if (resultados.credito && typeof resultados.credito === 'object') {
      Object.values(resultados.credito).forEach((credito) => {
        tableBody.push([
          'Acréscimo de saldo', '', `R$ ${formatNumero(credito.credito_valor)}`, '', ArrumaHora(credito.credito_data), '', '', credito.credito_tipo.replace('dinheiro', 'Dinheiro'),
        ]);


      });
    }

    tableBody.push([
      { content: 'Total', styles: { halign: 'left', fontStyle: 'bold' } },
      { content: `R$ ${formatNumero(totalValue)}`, colSpan: 7, styles: { halign: 'right', fontStyle: 'bold' } }
    ]);

    const margins = { top: 35 };

    doc.autoTable({
      head: [['Tipo', 'Placa', 'Valor', 'Setor', 'Hora', 'Número', 'Local', 'Método']],
      body: tableBody,
      didDrawPage: header,
      margin: margins,
      styles: {
        lineColor: [100],
        lineWidth: 0.5,
        fillColor: false,
        textColor: 0,
      },
      headStyles: {
        fillColor: [200],
        textColor: 0,
      },
      alternateRowStyles: {
        fillColor: false,
      },
    });

    doc.save(`Relatório-${selectedUserName}.pdf`);
  };



  return (
    <div>
      <div className="container ">
        {!showResultados ? (<div className="row px-5">
          <div className="col-12">
            <p className="text-start fs-3 fw-bold m-0">
              <VoltarComponente arrow={true} /> Relatório Parceiro
            </p>
          </div></div>) : null}
        {!showResultados ? (
          <>

            {usuarios.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-sm user-list-table">
                  <thead className="thead-light">
                    <tr>
                      <th scope="col" className='text-center'>Selecionar</th>
                      <th scope="col" className='ps-4'>Nome</th>
                      <th scope="col" className='ps-4'>Perfil</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map((usuario) => (
                      <tr
                        key={usuario.id_usuario}
                        className={selectedUser === usuario.id_usuario ? 'selected-row' : ''}
                        onClick={() => handleCheckboxChange(usuario.id_usuario)}
                      >
                        <td className="text-center user-list-checkbox">
                          <input
                            type="checkbox"
                            className="styled-checkbox"
                            checked={selectedUser === usuario.id_usuario}
                            onChange={() => handleCheckboxChange(usuario.id_usuario)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </td>
                        <td className="user-list-name ps-4">{usuario.nome}</td>
                        <td className="user-list-name ps-4 ">{usuario.perfil}</td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div
              className="alert alert-danger mt-4 mx-3"
              role="alert"
            >
              Nenhum usuário encontrado
            </div>
            )} <div style={{ width: '90%', margin: '20px auto' }}>
              <Filtro
                nome="RelatorioMonitorAdmin"
                onConsultaSelected={HandleGetMovByMonitor}
                onLoading={estadoLoading}
              /></div>
          </>
        ) : (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>Relatório {selectedUserName}</h3>
              <div>
                <button onClick={handleBackButtonClick} style={{ width: '100px', marginRight: '10px' }} className="btn btn-white">Voltar</button>
                <button onClick={handlePrintButtonClick} style={{ width: '180px' }} className="btn btn-white"><AiFillPrinter className='me-1' size={21} />Imprimir</button>
              </div>
            </div>
            {resultados.resposta && resultados.resposta.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-sm user-list-table" id='table-f'>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col" id="tabelaUsuarios">Tipo</th>
                      <th scope="col" id="tabelaUsuarios">Placa</th>
                      <th scope="col" id="tabelaUsuarios">Valor</th>
                      <th scope="col" id="tabelaUsuarios">Setor</th>
                      <th scope="col" id="tabelaUsuarios">Hora</th>
                      <th scope="col" id="tabelaUsuarios">Número</th>
                      <th scope="col" id="tabelaUsuarios">Local</th>
                      <th scope="col" id="tabelaUsuarios">Método</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultados.resposta.map((resultado, index) => (
                      <tr key={index}>
                        <td id="tabelaUsuarios" className="user-list-name">{resultado.tipo.replace('credito', 'Crédito').replace('regularizacao', 'Regularização')}</td>
                        <td id="tabelaUsuarios" className="user-list-name">{resultado.placa}</td>
                        <td id="tabelaUsuarios" className="user-list-name">{`R$ ${formatNumero(resultado.movimento_valor)}`}</td>
                        <td id="tabelaUsuarios" className="user-list-name">{resultado.setor_nome}</td>
                        <td id="tabelaUsuarios" className="user-list-name">{ArrumaHora(resultado.hora)}</td>
                        <td id="tabelaUsuarios" className="user-list-name">{resultado.vaga_numero}</td>
                        <td id="tabelaUsuarios" className="user-list-name">{resultado.vaga_local}</td>
                        <td id="tabelaUsuarios" className="user-list-name">{resultado.movimento_tipo.replace('dinheiro', 'Dinheiro')}</td>
                      </tr>
                    ))}

                    {resultados.credito && typeof resultados.credito === 'object' && Object.values(resultados.credito).map((credito, index) => (
                      <tr key={`credito-${index}`}>
                        <td id="tabelaUsuarios" className="user-list-name">Acréscimo de saldo</td>
                        <td id="tabelaUsuarios" className="user-list-name"></td>
                        <td id="tabelaUsuarios" className="user-list-name">{`R$ ${formatNumero(credito.credito_valor)}`}</td>
                        <td id="tabelaUsuarios" className="user-list-name"></td>
                        <td id="tabelaUsuarios" className="user-list-name">{ArrumaHora(credito.credito_data)}</td>
                        <td id="tabelaUsuarios" className="user-list-name"></td>
                        <td id="tabelaUsuarios" className="user-list-name"></td>
                        <td id="tabelaUsuarios" className="user-list-name">{credito.credito_tipo.replace('dinheiro', 'Dinheiro')}</td>
                      </tr>
                    ))}

                    <tr>
                      <td className="font-weight-bold">Total</td>
                      <td colSpan="7" className="text-end font-weight-bold">{`R$ ${formatNumero(totalValue)}`}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div
              className="alert alert-danger mt-4 mx-3"
              role="alert"
            >
              Nenhuma informação encontrada
            </div>
            )}
          </div>
        )}
      </div></div>
  );
};

export default RelatorioParceiroAdmin;