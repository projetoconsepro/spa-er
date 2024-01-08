import axios from 'axios';
import { React, useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { BsPlus } from 'react-icons/bs'
import Swal from 'sweetalert2';
import VoltarComponente from '../util/VoltarComponente';
import FuncTrocaComp from '../util/FuncTrocaComp';
import { createAPI } from '../services/createAPI';

const SetoresAdmin = () => {
    const [data, setData] = useState([]);
    const [data2, setData2] = useState([]);
    const [setor, setSetor] = useState('');
    const [estado, setEstado] = useState(false);
    const [mensagem, setMensagem] = useState('');

    useEffect(() => {
        requisicaoSetores();
    }, [])

    const cadastraSetor =  async () => {
        Swal.fire({
            title: 'Adicionar setor',
            html: 
            `<div className="form-group">
                <label for="nome" class="form-label col-3 fs-6">Setor:</label>
                <input id="swal-input1" class="swal2-input" placeholder="Digite a Letra do setor" value="">
            </div>`,
            showCancelButton: true,
            confirmButtonText: 'Adicionar',
            confirmButtonColor: '#3A58C8',
            cancelButtonText: 'Cancelar',
            showLoaderOnConfirm: true,
            preConfirm: () => {
                const setor = document.getElementById('swal-input1').value;
                const requisicao = createAPI;
                  requisicao.post('/setores', {
                    nome: setor,
                    }).then((response) => {
                        requisicaoSetores();
                        if(response.data.msg.resultado){
                        Swal.fire({
                            title: 'Sucesso!',
                            text: `${response.data.msg.msg}`,
                            icon: 'success',
                            confirmButtonText: 'Ok'

                        })
                        } else {
                        Swal.fire({
                            title: 'Erro!',
                            text: `${response.data.msg.msg}`,
                            icon: 'error',
                            confirmButtonText: 'Ok'
                        })
                        }
                    }).catch((error) => {
                        Swal.fire({
                            title: 'Erro!',
                            text: 'Erro ao editar usuário!',
                            icon: 'error',
                            confirmButtonText: 'Ok'
                        })
                    })
                
            },
            allowOutsideClick: () => !Swal.isLoading()
        });

          
    }



    const requisicaoSetores = async () => {
        const requisicao = createAPI;

          requisicao.get('/setores'
          ).then(
              response => {
                  const newData = response?.data?.data?.setores.map((item) => ({
                        id_setor: item.id_setor,
                        nome_setor: item.nome,
                        numero_vagas: item.descricao_setor,
                    }))
                setData(newData);
                setData2(newData);
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
          }
          );
        }

        const vagasAdmin = async (setor) => {
            localStorage.setItem('setor', setor)
            FuncTrocaComp( 'VagasAdmin')
            }

  return (
    <div className="col-12 mb-5">
    <div className="row">
        <div className="col-7">
    <h6 className="text-start mx-4 mb-4">Setores</h6>
        </div>
        <div className="col-12 col-xl-8">
            <div className="row">
                <div className="col-12 mb-3">
                    <div className="row mx-2">
                    <div className="col-6 input-group w-50 h-25 mt-3">
                    <span className="input-group-text bg-blue-50 text-white" id="basic-addon1"><FaSearch /></span>
                    <input className="form-control bg-white rounded-end border-bottom-0"  
                        value={setor}

                        placeholder="Digite o setor" 
                        aria-describedby="basic-addon1" 
                        onChange={(e) => {
                            if(e.target.value === "") {
                                setData(data2);
                                setSetor(e.target.value);
                            } else {
                            const upperCase = e.target.value.toUpperCase();
                            const newData = data.filter((item) => item.nome_setor === upperCase);
                                if(newData.length === 0) {
                                    setEstado(true)
                                    setMensagem("Nenhum setor encontrado")
                                    setTimeout(() => {
                                        setEstado(false)
                                        setMensagem("")
                                    }, 4000);
                                }
                                setSetor(upperCase);
                                setData(newData); 
                        }
                        }}
                        />
                        </div>
                        <div className="col-1">
                        </div>
                        <div className="col-5 d-flex justify-content-end">
                        <button className="btn3 botao mt-3 p-0" type="button" onClick={() => {cadastraSetor()}}><BsPlus size={25}/></button>
                        </div>

                </div>
                </div>
            </div>
            </div>
            {data.map((item, index) => (
            <div className="col-12 col-md-9 px-3 mt-2" key={index}>
            <div className="row">
            <div className="col-1">
            </div>
            <div className="col-10">
            <div className="card-body6 bg-blue-50 px-3 text-start text-white mb-2 mt-1"  onClick={() => {vagasAdmin(item.nome_setor)}}>
            Setor {item.nome_setor}
            </div>
            </div>
            <div className="col-1">
            </div>
            </div>
            </div>
            ))}
            <div className="col-12 col-md-9 px-3 mt-2">
            <div className="row">
            <div className="col-1"></div>
            <div className="col-10">
            <VoltarComponente />
            </div>
            <div className="col-1"></div>
            </div>
            </div>
            </div>
            <div className="alert alert-danger" role="alert" style={{ display: estado ? 'block' : 'none' }}>
                {mensagem}
            </div>
            </div>
  )
}

export default SetoresAdmin;