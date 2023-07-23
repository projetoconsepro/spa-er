import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import FuncTrocaComp from '../util/FuncTrocaComp';
import VoltarComponente from '../util/VoltarComponente'
import { Button, Divider, Group, Input, Text } from '@mantine/core';
import { IconLockAccess } from '@tabler/icons-react';

const Confirmation = () => {
    const [codigo, setCodigo] = useState("");
    const [inputLogin, setInputLogin] = useState("form-control");
    const [mensagem, setMensagem] = useState("");
    const [estado, setEstado] = useState(false);

    const handleSubmit = async (e) => {
        const veiculo = axios.create({
            baseURL: process.env.REACT_APP_HOST,
        })
        veiculo.get(`/verificar?codigo=${codigo}`).then(
            response => {
                const resposta = response.data.msg.resultado;
                if (resposta === false){
                    setMensagem(response.data.msg.msg);
                    setEstado(true);
                    setTimeout(() => {
                        setEstado(false);
                    }, 5000);
                }
                else{
                    localStorage.setItem('codigoConfirm', codigo);
                    localStorage.removeItem('email')
                    FuncTrocaComp("NewPassword");
                }
            }
        ).catch(function (error) {
                        if(error?.response?.data?.msg === "Cabeçalho inválido!" 
            || error?.response?.data?.msg === "Token inválido!" 
            || error?.response?.data?.msg === "Usuário não possui o perfil mencionado!"){
                localStorage.removeItem("user")
            localStorage.removeItem("token")
            localStorage.removeItem("perfil");
            } else {
                console.log(error)
            }
        });
    }

    const reenviarCodigo = async (e) => {
        const email = localStorage.getItem('email');
        const veiculo = axios.create({
            baseURL: process.env.REACT_APP_HOST,
        })
        veiculo.get(`/codigo-recuperacao-senha?email=${email}`).then(
            response => {
                const resposta = response.data.msg.resultado;
                if (resposta === false){
                    setMensagem(response.data.msg.msg);
                    setEstado(true);
                    setTimeout(() => {
                        setEstado(false);
                    }, 5000);
                }
            }
        ).catch(function (error) {
                        if(error?.response?.data?.msg === "Cabeçalho inválido!" 
            || error?.response?.data?.msg === "Token inválido!" 
            || error?.response?.data?.msg === "Usuário não possui o perfil mencionado!"){
                localStorage.removeItem("user")
            localStorage.removeItem("token")
            localStorage.removeItem("perfil");
            } else {
                console.log(error)
            }
        });
    }

    return (
        <section className="vh-lg-100 mt-5 mt-lg-0 bg-soft d-flex align-items-center">
            <div className="container">
                <div className="row justify-content-center form-bg-image" data-background-lg="../../assets/img/illustrations/signin.svg">
                    <div className="col-12 d-flex align-items-center justify-content-center">
                        <div className="bg-white shadow border-0 rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                            <div className="text-center text-md-center pt-3 mt-4 mt-md-0">
                                <img src="../../assets/img/logoconseproof2.png" alt="logo" className="mb-4" />
                            </div>
                            <p className="pt-2 pb-1 fs-5"><strong>Digite o código de verificação enviado ao seu Email</strong></p>
                            
                            <Divider my="sm" size="md" variant="dashed" />
                            
                            <div className="form-group mb-2 text-start">
                                <Text mb="sm" size="lg">Código de verificação:</Text>
                                <Input icon={<IconLockAccess size={18}/>} placeholder="Digite o codigo enviado ao seu email"
                                 value={codigo} onChange={(e) => setCodigo(e.target.value)}
                                />       
                            </div>
                            <p className="text-start mx-1" style={{cursor: "pointer", color: "#3A58C8"}} onClick={reenviarCodigo}><small><u>Clique para reenviar</u></small></p>
                            <div className="mt-5 mb-5 gap-2 d-md-block">
                                <VoltarComponente space={true} />
                                <Button
                                onClick={() => handleSubmit()}
                                loaderPosition="right"
                                className="bg-blue-50"
                                size="md"
                                radius="md"
                                >
                                    Confirmar
                                </Button>
                                </div>
                                <div className="alert alert-danger" role="alert" style={{ display: estado ? "block" : "none" }}>
                                    {mensagem}
                                </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}


export default Confirmation;