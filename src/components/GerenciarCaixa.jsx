import { React, useEffect, useState } from "react";
import { AiOutlineReload } from "react-icons/ai";
import Swal from "sweetalert2";
import VoltarComponente from "../util/VoltarComponente";
import createAPI from "../services/createAPI";
import {ArrumaHora3} from "../util/ArrumaHora";
import { IconCash } from '@tabler/icons-react';
import { Button, Input, Modal, Loader,  } from '@mantine/core';
import ImpressaoFecharCaixa from '../util/ImpressaoFecharCaixa';
import { BsXLg } from "react-icons/bs";
import { IconUserCircle,  IconSearch } from "@tabler/icons-react";
import FuncTrocaComp from "../util/FuncTrocaComp";

const GerenciarCaixa = () => {
  const [data, setData] = useState([]);
  const [estado, setEstado] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [estadoLoading, setEstadoLoading] = useState(false);
  const [valor, setValor] = useState('');
  const [estado2, setEstado2] = useState(false);
  const user = localStorage.getItem('user');
  const [tempoAtual, setTempoAtual] = useState(''); 
  const [modalOpen, setModalOpen] = useState(false);
  const [monitorSelecionado, setMonitorSelecionado] = useState(null);
  const [pesquisaNome, setPesquisaNome] = useState('');
  const user2 = JSON.parse(user);
  const [setorSelecionado, setSetorSelecionado] = useState(1);
  const [setorSelecionado2, setSetorSelecionado2] = useState(1);
  const [resposta2, setResposta2] = useState([]);

  const FuncArrumaInput = (e) => {
    let valor = e;
    if (valor.length === 1 && valor !== '0') {
      valor = `0,0${valor}`;
    } else if (valor.length > 1) {
      valor = valor.replace(/\D/g, '');
      valor = valor.replace(/^0+/, '');
      if (valor.length < 3) {
        valor = `0,${valor}`;
      } else {
        valor = valor.replace(/(\d{2})$/, ',$1');
      }
      valor = valor.replace(/(?=(\d{3})+(\D))\B/g, '.');
    }
    setValor(valor);
  };

  useEffect(() => {
    const setoresSalvos = localStorage.getItem('setores');
    if (setoresSalvos) {
      setResposta2(JSON.parse(setoresSalvos));
      return;
    }
    const requisicao = createAPI();
    requisicao.get('/setores').then((response) => {
      const setoresData = response?.data?.data?.setores || [];
      const novosSetores = setoresData.map((setor) => ({
        setores: setor.nome,
        id_setores: setor.id_setor
      }));
      setResposta2(novosSetores);
      localStorage.setItem('setores', JSON.stringify(novosSetores));
    })
      .catch((error) => {
        if (
          error?.response?.data?.msg === 'Cabeçalho inválido!'
          || error?.response?.data?.msg === 'Token inválido!'
          || error?.response?.data?.msg
          === 'Usuário não possui o perfil mencionado!'
        ) {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          localStorage.removeItem('perfil');
        } else {
          console.log(error);
        }
      });
  }, []);

  const setarSetor = () => {
    const setor2 = document.getElementById('setoresSelect2').value;
    setSetorSelecionado2(setor2);
    const setorA = resposta2.find((setor) => setor.setores === setor2);
    const setorId2 = setorA && setorA.id_setores;
    setSetorSelecionado(setorId2);
  };

  const abrirCaixa = () => {
    const requisicao = createAPI();
    const valorFinal = parseFloat(valor.replace(',', '.')).toFixed(2);
    requisicao.post('/caixa/abrir', {
      valor_abertura: `${valorFinal}`,
      id_usuario: monitorSelecionado.id_usuario,
      setor_id: setorSelecionado,
    })
      .then((response) => {
        if (response.data.msg.resultado) {
          Swal.fire({
            title: "Caixa aberto!",
            icon: "success",
            timer: 2000,
            text: `O caixa foi aberto com sucesso!`,
          });
          setData(prevData =>
            prevData.map(caixaItem =>
              caixaItem.id_usuario === monitorSelecionado.id_usuario
                ? { ...caixaItem, caixa: true }
                : caixaItem
            )
          );
          setMonitorSelecionado(null);
          setSetorSelecionado2(1);
          setModalOpen(false);
          setValor("");
          reload();
        } else {
          setEstado2(true);
          setMensagem(response.data.msg.msg);
          setTimeout(() => {
            setEstado2(false);
            setMensagem('');
          }, 5000);
        }
      })
      .catch((error) => {
        if (
          error?.response?.data?.msg === 'Cabeçalho inválido!'
          || error?.response?.data?.msg === 'Token inválido!'
          || error?.response?.data?.msg
          === 'Usuário não possui o perfil mencionado!'
        ) {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          localStorage.removeItem('perfil');
        } else {
          console.log(error);
        }
      });
  };

  useEffect(() => {
    reload();
  }, []);

  const reload = () => {
    const requisicao = createAPI();
    requisicao
      .get(`/caixa`)
      .then((response) => {
        setEstadoLoading(true);
        const newData = response.data.data.map((item) => ({
          data: ArrumaHora3(item.data),
          nome: item.nome,
          id_usuario: item.id_usuario,
          caixa: item.caixa,
          hora_abertura: item.hora_abertura ? item.hora_abertura : " ",
          hora_fechamento: item.hora_fechamento ? item.hora_fechamento : " ",
          valor_abertura: item.valor_abertura ? item.valor_abertura : 0,
          valor_fechamento: item.valor_fechamento ? item.valor_fechamento : null,
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

  useEffect(() => {
    if (pesquisaNome) {
      const dadosFiltrados = pesquisaNome
        ? data.filter(item =>item.nome.toLowerCase().includes(pesquisaNome.toLowerCase())): data;setData(dadosFiltrados);
    }else{
      reload();
    }
  }, [pesquisaNome]);


  const fecharCaixa = (item) => {
    const requisicao = createAPI();
    requisicao
      .get("/caixa/fechar/" + item.id_usuario)
      .then((response2) => {
        if (response2.data.msg.resultado) {
          const sim =
            parseFloat(response2.data.data.valor_abertura) +
            parseFloat(response2.data.data.valor_movimentos);
          Swal.fire({
            title: "Fechamento de caixa",
            showDenyButton: true,
            html: `
              <div class="p-0 p-lg-3" style="font-family: Arial, sans-serif; color: #2d3748; max-width: 420px; margin: auto;">
                <div class="d-none d-lg-block" style="text-align: center;">
                  <h4 style="margin: 0; color: #2d3748; font-size: 20px; font-weight: 700;">
                    Confirmar Fechamento de Caixa
                  </h4>
                </div>
                <div style="margin-top: 20px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 24px; box-shadow: 0 6px 14px rgba(0,0,0,0.05);">
                  <div style="margin-bottom: 18px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 15px;">
                      <span style="font-weight: 500; color: #4a5568;">Valor de Abertura</span>
                      <span style="font-weight: 600; color: #3182ce;">R$${parseFloat(response2.data.data.valor_abertura).toFixed(2)}</span>
                    </div>

                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 15px;">
                      <span style="font-weight: 500; color: #4a5568;">Saldo Movimentos</span>
                      <span style="font-weight: 600; color: #38a169;">R$${parseFloat(response2.data.data.valor_movimentos).toFixed(2)}</span>
                    </div>

                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: #fff5f5; border-radius: 8px;">
                      <span style="font-weight: 600; color: #4a5568; font-size: 15px;">Saldo Final</span>
                      <span style="font-weight: 700; color: #e53e3e; font-size: 1.2em;">R$${parseFloat(sim).toFixed(2)}</span>
                    </div>
                  </div>

                  <div style="margin-bottom:18px;">
                    <label for="valorReal" style="display:block; font-size:14px; font-weight:600; margin-bottom:6px; color:#4a5568; text-align: left;">Valor Real</label>
                    <div style="position:relative;">
                      <span style="position:absolute; top:50%; left:12px; transform:translateY(-50%); color:#718096; font-size:14px;">R$</span>
                      <input type="text" id="valorReal" placeholder="Digite o valor" step="0.01"
                        style="width:100%; padding:12px 12px 12px 36px; border:1px solid #cbd5e0; border-radius:10px; font-size:15px; outline:none; transition:all .3s;"
                        onfocus="this.style.border='1px solid #3182ce'; this.style.boxShadow='0 0 6px rgba(49,130,206,0.3)'"
                        onblur="this.style.border='1px solid #cbd5e0'; this.style.boxShadow='none'">
                    </div>
                  </div>
    
                  <div style="margin-bottom:18px;">
                    <label for="descricao" style="display:block; font-size:14px; font-weight:600; margin-bottom:6px; color:#4a5568; text-align: left;">Observação</label>
                    <textarea id="descricao" placeholder="Adicione uma observação..." rows="3"
                      style="width:100%; padding:12px; border:1px solid #cbd5e0; border-radius:10px; font-size:15px; resize:none; outline:none; transition:all .3s;"
                      onfocus="this.style.border='1px solid #3182ce'; this.style.boxShadow='0 0 6px rgba(49,130,206,0.3)'"
                      onblur="this.style.border='1px solid #cbd5e0'; this.style.boxShadow='none'"></textarea>
                  </div>

                  <div style="display: flex; align-items: center; gap: 8px;"> 
                    <input type="checkbox" checked id="imprimirCheckbox" name="imprimirCheckbox" style="transform: scale(1);"> 
                    <label style="font-size: 15px; margin: 0;">Imprimir comprovante</label> 
                  </div>
                </div>
              </div>`,
            confirmButtonText: "Confirmar",
            confirmButtonColor: "#28a745",
            denyButtonText: "Cancelar",
            preConfirm: () => {
              const valorRealInput = document.getElementById("valorReal");
              const valorReal = valorRealInput.value;
              const descricaoInput = document.getElementById("descricao");
              const imprimirCheckbox = document.getElementById("imprimirCheckbox");
              if (!valorReal || valorReal.trim() === "") {
                Swal.showValidationMessage("O campo Valor Real é obrigatório!");
                setTimeout(() => {
                  Swal.resetValidationMessage();
                }, 2500);
                return false;
              }
              return {
                valorReal: parseFloat(valorReal).toFixed(2),
                descricao: descricaoInput.value,
                imprimir: imprimirCheckbox.checked ? 1 : 0,
              };
            },
          }).then((result) => {
            if (result.isConfirmed) {
              requisicao
                .post("/caixa/fechar", {
                  id_usuario: item.id_usuario,
                  usuario_fechamento_id: user2.id_usuario,
                  descricao: result.value.descricao,
                  valor_real: result.value.valorReal,
                })
                .then((response) => {
                  if (response.data.msg.resultado === true) {
                    setData((prevData) =>
                      prevData.map((caixaItem) =>
                        caixaItem.id_usuario === item.id_usuario
                          ? {
                            ...caixaItem,
                            caixa: false,
                            valor_abertura: 0,
                            hora_abertura: "00:00",
                          }
                          : caixaItem
                      )
                    );
                    Swal.fire({
                      title: "Caixa fechado com sucesso",
                      icon: "success",
                      showCancelButton: true,
                      confirmButtonText: "Ver caixa fechado",
                      cancelButtonText: "Fechar",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        localStorage.setItem(
                          "idCaixa",
                          response2.data.data.id_caixa
                        );

                        FuncTrocaComp("HistoricoCaixa");
                      }
                    });
                    if (result.value.imprimir === 1) {
                      ImpressaoFecharCaixa(response2.data.data, sim, item.nome);
                    }
                  } else {
                    Swal.fire(
                      "Erro ao fechar caixa",
                      `${response.data.msg.msg}`,
                      "error"
                    );
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
            }
          });
        } else {
          Swal.fire("Erro ao tentar fechar caixa", "error");
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

  const openModal = (item) => {
    setSetorSelecionado2(1);
    setMonitorSelecionado(item);
    const data = new Date();
    let hora = data.getHours();
    if (hora < 10) {
      hora = `0${hora}`;
    }
    let minuto = data.getMinutes();
    if (minuto < 10) {
      minuto = `0${minuto}`;
    }
    let segundos = data.getSeconds();
    if (segundos < 10) {
      segundos = `0${segundos}`;
    }
    const horaAtual = `${hora}:${minuto}:${segundos}`;
    setTempoAtual(horaAtual);
    item.caixa ? fecharCaixa(item) : setModalOpen(true);
  };

  return (
    <div className="container px-0 px-md-4">
      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        centered
        size="520px"
        overlayColor="rgba(0,0,0,0.35)"
        overlayBlur={3}
        withCloseButton
      >
        <div className="p-2 p-lg-4">
          <div className="text-center mb-4">
            <h5 className="mb-1">Menu de Caixa</h5>
            <h6 className="text-muted mb-1">{monitorSelecionado?.nome}</h6>
            <small className="text-muted" style={{ fontSize: '14px' }}>
              {tempoAtual ? `Horário: ${tempoAtual}` : '--:--:--'}
            </small>
          </div>

          <div className="bg-white shadow-sm rounded p-4">
            <div className="col-6">
               <h6 className="mb-2">Defina o Setor:</h6>
              <select
                className="form-select form-select-sm mb-4 mt-2"
                aria-label=".form-select-lg example"
                id="setoresSelect2"
                value={setorSelecionado2}
                onChange={() => {setarSetor();}}>
                {resposta2.map((link, index) => (
                  <option value={link.setores} key={index}>
                    Setor:
                    {' '}
                    {link.setores}
                  </option>
                ))}
              </select>
            </div>
            <h6 className="mb-2">Defina o valor do caixa:</h6>
            <div className="row g-2 mb-3">
              {['1000', '2000', '3000', '5000'].map((v, i) => (
                <div className="col-3" key={i}>
                  <button
                    type="button"
                    className="btn btn-info w-100"
                    onClick={() => FuncArrumaInput(v)}
                  >
                    {Number(v) / 100}
                  </button>
                </div>
              ))}
            </div>

            <Input
              icon={<IconCash />}
              placeholder="R$ 0,00"
              value={valor}
              onChange={(e) => FuncArrumaInput(e.target.value)}
              radius="md"
              size="md"
              className="mb-3"
              styles={{
                input: { fontSize: 15, padding: '10px 12px', borderRadius: 8 }
              }}
            />

            {valor !== '' && (
              <h6 className="text-start mb-3">
                Valor definido em: R${valor === 0 ? '00' : valor}
              </h6>
            )}
            <button type="button" className="btn5 botao mt-2" onClick={() => {if (valor.trim() !== '') { abrirCaixa(); } else { setEstado2(true); setMensagem('Por favor, insira um valor para abrir o caixa!'); setTimeout(() => { setEstado2(false); }, 5000); } }} > Confirmar abertura </button>
            {estado2 && (
              <div className="alert alert-danger mt-3" role="alert">
                {mensagem}
              </div>
            )}
          </div></div>
      </Modal>

      <p className="text-start fs-4 fw-bold ps-md-0 ps-3">Gerenciar Caixa:</p>
      <div className="mb-3">
        <div className="row">
          <div className="col-md-4 col-9">
            <div className="p-md-0 ps-3">
              <Input
                icon={<IconUserCircle size="1rem" />}
                placeholder="Usuário"
                value={pesquisaNome}
                onChange={(e) => setPesquisaNome(e.target.value)}
                className="p-0"
                rightSection={
                  pesquisaNome
                    ? <BsXLg style={{ cursor: "pointer" }} onClick={() => setPesquisaNome('')} />
                    : <IconSearch size="1rem" />
                }
              /></div>
          </div>

          <div className="d-none d-md-block col-md-7"></div>

          <div className="col-md-1 col-2 text-end pt-md-0">
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
                {estadoLoading ? (
                  <div className="table-responsive">
                    <table className="table table-hover align-items-center table-flush">
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
                          <th className="border-bottom" scope="col">Ação</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.map((item, index) => (
                          <tr
                            key={index}
                          >
                            <td>{item.data}</td>
                            <td>
                              <span className="d-block d-md-none text-truncate" style={{ maxWidth: 100 }}>
                                {item.nome}
                              </span>
                              <span className="d-none d-md-block">
                                {item.nome}
                              </span>
                            </td>
                            <td id="tabelaUsuarios2">{item.hora_abertura}</td>
                            <td id="tabelaUsuarios2">R${parseFloat(item.valor_abertura).toFixed(2)}</td>
                            <td className="border-start">                                                
                              <button
                              className={`btn text-center ${item.caixa ? "btn-danger" : "btn-info"} `}
                              style={{ width: "120px" }}
                              onClick={(e) => {
                                e.stopPropagation();
                                openModal(item);
                              }}
                            >
                              {item.caixa ? "Fechar Caixa" : "Abrir Caixa"}
                            </button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>) : (
                  <div className="col-12 text-center mt-4 mb-4">
                    <Loader />
                  </div>
                )}
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

export default GerenciarCaixa;
