import React, { useState, useEffect} from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Form } from 'react-bootstrap';
import "../pages/Style/styles.css";
import FuncTrocaComp from "../util/FuncTrocaComp";
import VoltarComponente from "../util/VoltarComponente";
import { CiEdit } from "react-icons/ci";
import { Group, Text, Button, Image, Box, Divider, Modal } from "@mantine/core";
import { BsCreditCard2Back } from "react-icons/bs";
import createAPI from "../services/createAPI";
import { IconCheck, IconX } from "@tabler/icons-react";

const RecargaAutomatica = () => {
    const [recargaAtivada, setRecargaAtivada] = useState(true);
    const [saldoLimite, setSaldoLimite] = useState();
    const [valorRecarga, setValorRecarga] = useState();
    const [isSaldoLimiteButtonVisible, setIsSaldoLimiteButtonVisible] = useState(true);
    const [saldoLimiteInputValue, setSaldoLimiteInputValue] = useState('');
    const [isValorRecargaButtonVisible, setIsValorRecargaButtonVisible] = useState(true);
    const [valorRecargaInputValue, setValorRecargaInputValue] = useState('');
    const [creditCard, setCreditCard] = useState([]);
    const [CreditCardSelected, setCreditCardSelected] = useState(null);
    const [opened, { open, close }] = useDisclosure(false);
    const [estadoDiv, setEstadoDiv] = useState(false);
const getCreditCardFUNC = async () => {
    const requisicao = createAPI();

    await requisicao
        .get("/cartao/")
        .then((resposta) => {
            if (resposta.data.msg.resultado) {
                const newData = resposta.data.data.map((item) => ({
                    cartao: item.id_cartao,
                    bandeira: item.bandeira,
                    numero: `#### #### #### ${item.cartao}`,
                    debito: item.debito,
                    credito: item.credito,
                }));
                setCreditCard(newData);
            } else {
                setCreditCard([]);
                FuncTrocaComp('CartaoCredito');
            }
        })
        .catch((err) => {
            setCreditCard([]);
        });
};

useEffect(() => {
    getCreditCardFUNC();
}, []);

    const handleToggle = () => {
        if (!recargaAtivada) {
            open();
        } else {
            setRecargaAtivada(false);
        }
    };


    const confirmarTermos = () => {
        const checkbox = document.getElementById("termsCheckbox");
        if (checkbox.checked) {
            localStorage.setItem("termosRecarga", "true");
            setRecargaAtivada(true);
            close();
        } else {
            setEstadoDiv(true);
            setTimeout(() => {
                setEstadoDiv(false);
            }, 3000);
        }
    };

    const handleSaldoLimiteClose = () => {
        setSaldoLimite(saldoLimiteInputValue);
        setIsSaldoLimiteButtonVisible(true);
    }    
    const handleSaldoLimiteButtonClick = () => {
        setIsSaldoLimiteButtonVisible(false);
        setIsValorRecargaButtonVisible(true);
    };
    const handleSaldoLimiteInputChange = (e) => {
        setSaldoLimiteInputValue(e.target.value);
    };
    const handleValorRecargaButtonClick = () => {
        setIsValorRecargaButtonVisible(false);
        setIsSaldoLimiteButtonVisible(true);
    };
    const handleValorRecargaInputChange = (e) => {
        setValorRecargaInputValue(e.target.value);
    };
  const handleValorRecargaClose = () => {
        setValorRecarga(valorRecargaInputValue);
        setIsValorRecargaButtonVisible(true);
    }


    return (
        <div>
            <div className="container p-0 d-flex justify-content-center">
                <div>
                    <div className="card-ativar py-4 px-4 pe-6">
                        <span className='text-white'>{recargaAtivada ? 'DESATIVAR RECARGA AUTOMÁTICA ' : 'ATIVAR RECARGA AUTOMÁTICA '}</span>
                        <Form.Check
                            type="switch"
                            id="toggle-recarga"
                            checked={recargaAtivada}
                            onChange={handleToggle}
                            className="custom-switch" />
                    </div>
                </div>
                <div className="card border-0 shadow mt-6" style={{ maxWidth: '500px', height: 'auto', opacity: recargaAtivada ? 1 : 0.4 }}>
  <div className="card-body" style={{ height: 'auto' }}>
    <div className="align-items-center pb-3">
      <div className="d-flex justify-content-between align-items-center">
        <div className='text-start mt-2'>
          <h5 className="bolder">Recarga Automática</h5>
        </div>
        <Button variant="outline" size="xs" color="gray" onClick={() => open()}>
          ?
        </Button>
      </div>
      <div className='text-start mt-2'>
        <p className=".h5">
          Quando seu saldo chegar ao valor escolhido, realizaremos
          uma recarga com seu cartão de crédito.
        </p>
                            </div>
                            <div className='mt-4'>
                                <div className='div-saldo py-2 pt-3' style={{
                                    borderTop: '2px solid #0CA57B',
                                    borderRight: '2px solid #0CA57B',
                                    borderLeft: '2px solid #0CA57B'
                                }}>
                                    <div className='div-saldo2 mb-2 text-start'>
                                        <span className='text-saldo estilo1 ms-4' style={{ color: '#0CA57B' }}>$</span>
                                        <span className='text-saldo estilo2 ' style={{ color: '#0CA57B' }}>Sempre que seu saldo chegar em:</span>
                                        {isSaldoLimiteButtonVisible ? (
                                            <span className='text-saldo estilo3 ms-5 me-4' style={{ color: '#0CA57B' }}>{saldoLimite}</span>
                                        ) : (<span className='text-saldo estilo3 mx-5'>  </span>)}
                                    </div>
                                </div>
                                {isSaldoLimiteButtonVisible ? (
                                    <button className='saldo-botao py-2' style={{ border: '2px solid #0CA57B', color: '#0CA57B' }} onClick={handleSaldoLimiteButtonClick}>
                                        <CiEdit className='me-1' size={24} /> Editar valor
                                    </button>
                                ) : (
                                    <div className='saldo-editar py-4 text-start px-4' style={{
                                        borderBottom: '2px solid #0CA57B',
                                        borderRight: '2px solid #0CA57B',
                                        borderLeft: '2px solid #0CA57B'
                                    }}>
                                        <span className='text-saldo estilo2' style={{ color: '#0CA57B' }}>Editar valor:</span>
                                        <div className="input-wrapper mt-1" style={{ color: '#0CA57B' }}>
                                            <input type="number" value={saldoLimiteInputValue} onChange={handleSaldoLimiteInputChange} className="saldo-input px-2" style={{ border: '2px solid #0CA57B', color: '#0CA57B' }} />
                                            <span className="text-input">R$</span>
                                        </div>
                                        <button className='button-confirm py-2 mt-2' style={{ backgroundColor: '#0CA57B' }} onClick={handleSaldoLimiteClose}>Confirmar</button>
                                    </div>
                                )}
                            </div>
                            <div className='mt-3'>
                                <div className='div-saldo py-2 pt-3' style={{
                                    borderTop: '2px solid #1099A8',
                                    borderRight: '2px solid #1099A8',
                                    borderLeft: '2px solid #1099A8'
                                }}>
                                    <div className='div-saldo2 mb-2 text-start'>
                                        <span className='text-saldo estilo1 ms-4' style={{ color: '#1099A8' }}>$</span>
                                        <span className='text-saldo estilo4 ' style={{ color: '#1099A8' }}>Recarregar automaticamente:</span>
                                        {isValorRecargaButtonVisible ? (
                                            <span className='text-saldo estilo3 ms-5 me-4' style={{ color: '#1099A8' }}>{valorRecarga}</span>
                                        ) : (<span className='text-saldo estilo3 mx-5'>  </span>)}
                                    </div>
                                </div>
                                {isValorRecargaButtonVisible ? (
                                    <button className='saldo-botao py-2' onClick={handleValorRecargaButtonClick} style={{ border: '2px solid #1099A8', color: '#1099A8' }}>
                                        <CiEdit className='me-1' size={24} /> Editar valor
                                    </button>
                                ) : (
                                    <div className='saldo-editar py-4 text-start px-4' style={{
                                        borderBottom: '2px solid #1099A8',
                                        borderRight: '2px solid #1099A8',
                                        borderLeft: '2px solid #1099A8'
                                    }}>
                                        <span className='text-saldo estilo2' style={{ color: '#1099A8' }}>Editar valor:</span>
                                        <div className="input-wrapper mt-1" style={{ color: '#1099A8' }}>
                                            <input type="number" value={valorRecargaInputValue} onChange={handleValorRecargaInputChange} className="saldo-input px-2" style={{ border: '2px solid #1099A8', color: '#1099A8' }} />
                                            <span className="text-input">R$</span>
                                        </div>
                                        <button className='button-confirm py-2 mt-2' style={{ backgroundColor: '#1099A8' }} onClick={handleValorRecargaClose}>Confirmar</button>
                                    </div>
                                )}
                                <Button className='botao-add mt-3 py-3 text-white' style={{ backgroundColor: '#1099A8' }} onClick={() => { FuncTrocaComp('HistoricoRecargaAuto'); }}>
                                    Ver Histórico
                                </Button>
                                <Group className='mt-4 mb-3' position="apart">
                                    <Text weight={500}>Selecione seu cartão:</Text>
                                </Group> {creditCard.map((item, index) => (
                                    (
                                        <div key={index}>
                                            <Box className="border border-black rounded mb-2 align-items-center"
                                                style={{ maxWidth: '400px', minHeight: '50px', backgroundImage: CreditCardSelected === index ? 'linear-gradient(45deg, #0CA678,  #1098AD)' : 'none' }}
                                                onClick={() => setCreditCardSelected(index)}
                                            >
                                                <div className="d-flex align-items-center">
                                                    <div className="align-items-center">
                                                        {item.bandeira === 'visa' ? (
                                                            CreditCardSelected !== index ? (
                                                                <Image
                                                                    src='../../assets/img/cartaoCredito/visa-unselected.png'
                                                                    alt="image"
                                                                    style={{ width: 45, height: 45, display: 'flex', alignItems: 'center', marginLeft: '5px' }} />
                                                            ) : (
                                                                <Image
                                                                    src='../../assets/img/cartaoCredito/visa.png'
                                                                    alt="image"
                                                                    style={{ width: 45, height: 45, display: 'flex', alignItems: 'center', marginLeft: '5px' }} />
                                                            )
                                                        ) : item.bandeira === 'mastercard' ? (
                                                            <Image
                                                                src='../../assets/img/cartaoCredito/mastercard.png'
                                                                alt="image"
                                                                style={{ width: 50, height: 50, display: 'flex', alignItems: 'center' }} />
                                                        ) : item.bandeira === 'elocard' ? (
                                                            CreditCardSelected === index ? (
                                                                <Image
                                                                    src='../../assets/img/cartaoCredito/elocard.png'
                                                                    alt="image"
                                                                    style={{ width: 50, height: 50, display: 'flex', alignItems: 'center', marginLeft: '2px' }} />
                                                            ) : (
                                                                <Image
                                                                    src='../../assets/img/cartaoCredito/elocard-unselected.png'
                                                                    alt="image"
                                                                    style={{ width: 50, height: 50, display: 'flex', alignItems: 'center', marginLeft: '2px' }} />
                                                            )
                                                        )
                                                            :
                                                            <BsCreditCard2Back className="m-2"
                                                                size={30}
                                                                color={CreditCardSelected === index ? 'white' : 'black'} />}
                                                    </div>
                                                    <div className={CreditCardSelected === index ? "text-start text-white mx-2" : "text-start mx-2"}>
                                                        <Text weight={400} style={{ marginTop: '-3px' }}>{item.numero}</Text>
                                                    </div>
                                                </div>
                                            </Box>
                                        </div>
                                    )
                                ))}
                                <Button className='botao-add mt-1 py-3' onClick={() => { FuncTrocaComp('CartaoCredito'); }}>
                                    Adicionar novo cartão
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='d-flex justify-content-center my-4' style={{ opacity: recargaAtivada ? 1 : 0.4 }}> <VoltarComponente /></div>

            <Modal opened={opened} onClose={() => { close() }} closeOnClickOutside={false} style={{ zIndex: 51 }} centered title="Termos de uso recarga automática">
                <div id="modalTexto">                    <small>⚠️ Importante: Ativar essa opção significa que, sempre que o saldo atingir um valor mínimo, uma recarga automática será realizada. O valor exato e a frequência dessa recarga serão determinados com base na sua utilização.

                       </small> <br />
                    <Divider my="sm" size="md" variant="dashed" />
                    <small> Antes de prosseguir com a ativação, pedimos que você confirme se compreende como a recarga automática funciona e se concorda com o processo de cobrança.</small> <br />
                    <Divider my="sm" size="md" variant="dashed" />
                </div>
                <>
                    <div className="form-check mt-3">
                        <input type="checkbox" className="form-check-input" id="termsCheckbox" />
                        <label className={estadoDiv ? 'form-check-label text-danger' : 'form-check-label'} htmlFor="termsCheckbox">Concordo com os termos de uso</label>
                    </div>
                    <div className="alert alert-danger mt-2" style={{ display: estadoDiv ? 'block' : 'none' }}>
                        <small>É necessário concordar com os termos de uso para ativar a recarga automática.</small>
                    </div>
                    <div className="mt-3 d-flex justify-content-between px-4">
                        <Button
                            color="gray"
                            mt="md"
                            radius="md"
                            onClick={() => {
                                close();
                            }}
                        >
                            Não aceito ‎
                            <IconX size="1.125rem" />
                        </Button>
                        <Button
                            variant="gradient"
                            gradient={{ from: "indigo", to: "blue", deg: 60 }}
                            mt="md"
                            radius="md"
                            onClick={() => {
                                confirmarTermos();
                            }}
                        >
                            Confirmar ‎
                            <IconCheck size="1.125rem" />
                        </Button>
                    </div>
                </>
            </Modal>
        </div>
    );
};

export default RecargaAutomatica;