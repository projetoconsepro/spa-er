import axios from "axios";
import { React, useState, useEffect } from "react";
import { BsCashCoin } from "react-icons/bs";
import { FaCoins } from "react-icons/fa";
import { Container, Row, Col } from "react-bootstrap";
import Swal from "sweetalert2";

const HistoricoFinanceiro = () => {
  const [resposta, setResposta] = useState([]);
  const [resposta2, setResposta2] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [estado, setEstado] = useState(false);
  const [cont, setCont] = useState(0);
  const [saldo, setSaldo] = useState(0);

  function filtrar(filtro) {
   const filtrado = resposta2.filter((item) => {
      if(item.tipo === filtro){
        return item
      }
      else if(item.data.includes(filtro)){
        return item
      }
      else{
        setMensagem('Nenhum resultado encontrado')
        setEstado(true)
        setTimeout(() => {
          setMensagem("")
          setEstado(false)
          setResposta(resposta2)
        }, 3000);
      }
    })
    setResposta(filtrado)
  }

  const filtragem = async () => {
    const select = document.getElementById("filtroSelect2").value;
    console.log(select)
    if(select === 'selectData'){
      Swal.fire({
        title: 'Digite a data que deseja filtrar',
        html : `<input type="date" id="date" class="swal2-input">`,
        showCancelButton: true,
        confirmButtonText: 'Filtrar',
        confirmButtonColor: '#3a58c8',
        cancelButtonText: 'Voltar',
        showLoaderOnConfirm: true,
        preConfirm: () => {
            const resposta =document.getElementById('date').value
            if (resposta === "" || resposta === null) {
                Swal.showValidationMessage(
                    `Digite uma data válida`
                )
            }
            else {
              const newResposta = resposta[8] + resposta[9] + "/" + resposta[5] + resposta[6] + "/" + resposta[0] + resposta[1] + resposta[2] + resposta[3]
              console.log(newResposta)
              filtrar(newResposta);
            }
        }
        }).then((result) => {
    
        }
        )
    }
    else if(select === 'selectTipo'){
      const inputOptions = new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            'Acréscimo de crédito': 'Acréscimo',
            'credito': 'Débito',
          })
        }, 1000)
      })
      
      const { value: tipo } = await Swal.fire({
        title: 'Selecione um tipo de movimento',
        input: 'radio',
        inputOptions: inputOptions,
        inputValidator: (value) => {
          if (!value) {
            return 'Você precisa selecionar um tipo de movimento.'
          }
        }
      })
      
      if (tipo) {
        filtrar(tipo)
      }
    }
  }

  function ArrumaHora(data) {
    const data2 = data.split("T");
    const data3 = data2[0].split("-");
    const data4 = data3[2] + "/" + data3[1] + "/" + data3[0];
    const data6 = data2[1].split(":");
    const data5 = data4 + " " + (data6[0]-3) + ":" + data6[1];
    return data5;
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const user2 = JSON.parse(user);
     const requisicao = axios.create({
    baseURL: process.env.REACT_APP_HOST,
    headers: {
      token: token,
      id_usuario: user2.id_usuario,
      perfil_usuario: `${user2.perfil[0]}`,
    },
  });

  requisicao.get('/financeiro/cliente')
  .then((response) => {
    console.log(response);
    setSaldo(response?.data.dados.saldo)
    const newData = response?.data.dados.movimentos.map((item) => ({
      valor: item.valor,
      data: ArrumaHora(item.data),
      tipo: item.tipo,
    }));
    console.log('essa é a newdata', newData)
    for ( let i = 0; i < newData.length; i++) {
      if(newData[i].tipo === 'credito'){
        newData[i].debito = 'S'
      } else if(newData[i].tipo === 'Acréscimo de crédito'){
        newData[i].debito = 'N'
      }
      else if (newData[i].tipo === 'regularizacao'){
        newData[i].debito = 'S'
      }

    }
    setResposta(newData)
    setResposta2(newData)
  }
  ).catch((error) => {
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
}, []);


  
  return (  
    <div>
        <p className="mx-3 text-start fs-4 fw-bold">Histórico financeiro:</p>
        <div className="row">
        <div className="col-5"> 
      <select className="mx-3 form-select form-select-sm mb-3" defaultValue="1" aria-label=".form-select-lg example" id="filtroSelect2"
      onChange={() => {filtragem()}}>   
        <option disabled  value='1' id="filtro">Filtro</option>
        <option value="selectData">Data</option>
        <option value="selectTipo">Tipo</option>
        </select>
    </div>
    <div className="col-6 text-end mt-1">
    <FaCoins/> ‎ R${saldo},00
    </div>

    </div>
    <div id="kkk" className="mb-3">
    {resposta.map((item, index) => (
  <div className="estacionamento" key={index}>
  <div className="container">
    <div className="row">
      <div className="col-2">
        <div className="icon-container">
          <BsCashCoin size={25} color={item.tipo === 'Acréscimo de crédito' ? '#3DAE30' : '#FB6660'} className="icon mt-1" />
          {resposta[index + 1] === undefined || null
          ? null : <div className="line"> </div>}
          <div className="spacer"></div>
        </div>
        </div>
      <div className="col-5 p-0">
        <div className="titulo text-start">
          {item.tipo === 'credito' ? 'Estacionamento' : item.tipo === 'tolerancia' ? 'Estacionamento' : item.tipo === 'regularizacao' ? 'Regularizacao'  : 'Acréscimo de crédito'}
        </div>
        </div>
        <div className="col-5 p-0">
        <div className="data text-end mt-2">{item.data}</div>
        </div>
        <div className="col-2">
        </div>
        <div className="col-5 p-0">
        <div className="preco text-start">{`R$${item.valor.length === 1 || item.valor < 10 ? '0' + item.valor : item.valor}`},00</div>
        </div>
      </div>
    </div>
</div>
))}
</div>
<div className="alert alert-danger mt-4 mx-3" role="alert" style={{ display: estado ? 'block' : 'none' }}>
      {mensagem}
</div>
</div>

);
}

export default HistoricoFinanceiro;