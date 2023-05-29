import axios from "axios";
import { React, useState, useEffect } from "react";
import { BsCashCoin } from "react-icons/bs";
import Swal from "sweetalert2";
import { FaCoins } from "react-icons/fa";
import VoltarComponente from "../util/VoltarComponente";
import Filtro from "../util/Filtro";
import { Badge } from "@mantine/core";
import { IconCash } from "@tabler/icons-react";

const HistoricoFinanceiroParceiro = () => {
  const [resposta, setResposta] = useState([]);
  const [resposta2, setResposta2] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [estado, setEstado] = useState(false);
  const [saldo, setSaldo] = useState(0);
  const [estadoLoading, setEstadoLoading] = useState(false);


  function filtrar(filtro) {
   const filtrado = resposta2.filter((item) => {
      if(item.debito === filtro){
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
            'S': 'Acréscimo',
            'N': 'Débito',
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

  requisicao.get('/financeiro/parceiro')
  .then((response) => {
    console.log(response.data.dados)
    setSaldo(response?.data.dados.saldo)
    const newData = response?.data.dados.movimentos.map((item) => ({
      valor: item.valor,
      data: ArrumaHora(item.data),
      tipo: item.tipo,
      cpf: item.cpf === undefined ? '' : item.cpf,
      cnpj: item.cnpj === undefined ? '' : item.cnpj,
      placa: item.placa === undefined ? '' : item.placa,
    }));
    console.log('essa é a newdata', newData)

    for ( let i = 0; i < newData.length; i++) {
      if(newData[i].tipo === 'credito'){
        newData[i].debito = 'S'
      } else if(newData[i].tipo === 'Acréscimo de crédito'){
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

const handleConsulta = (where) => {
  setEstado(false);
  setMensagem("");
  setEstadoLoading(true)
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const user2 = JSON.parse(user);

  setEstadoLoading(true)
  
  const requisicao = axios.create({
    baseURL: process.env.REACT_APP_HOST,
    headers: {
      token: token,
      id_usuario: user2.id_usuario,
      perfil_usuario: user2.perfil[0],
    },
  });

  const base64 = btoa(where)
  requisicao.get(`/financeiro/parceiro/?query=${base64}`).then((response) => {
    console.log(response);
    if (response.data.msg.resultado) {
      
    setEstadoLoading(false)
    setSaldo(response?.data.dados.saldo)
     const newData = response?.data.dados.movimentos.map((item) => ({
      valor: item.valor,
      data: ArrumaHora(item.data),
      tipo: item.tipo,
      cpf: item.cpf === undefined ? '' : item.cpf,
      cnpj: item.cnpj === undefined ? '' : item.cnpj,
      placa: item.placa === undefined ? '' : item.placa,
    }));
    console.log('essa é a newdata', newData)
    for ( let i = 0; i < newData.length; i++) {
      if(newData[i].tipo === 'credito'){
        newData[i].debito = 'S'
      } else if(newData[i].tipo === 'Acréscimo de crédito'){
        newData[i].debito = 'S'
      }
    }
      setResposta(newData);
    } else {
      setResposta([]);
      setEstadoLoading(false)
      setEstado(true);
      setMensagem(response.data.msg.msg);
    }
}).catch((error) => {
    console.log(error)
  })
}

  
  return (  
    <div>
        <p className="mx-3 text-start fs-4 fw-bold">Histórico financeiro:</p>
        <div className="row mb-3">
        <div className="col-5 mx-2"> 
      <Filtro nome={"HistoricoFinanceiroParceiro"} onConsultaSelected={handleConsulta} onLoading={estadoLoading} />
    </div>
    <div className="col-6 text-end mt-1">
      <Badge variant="gradient" fz="sm"
      w={ window.innerWidth < 768 ? 150 : 200 } h={30} 
      gradient={{ from: 'teal', to: 'blue', deg: 210 }} 
      leftSection={<IconCash />}>
        R${saldo}
      </Badge>
    </div>
    </div>
    <div id="kkk" className="mb-3">
    {resposta.map((item, index) => (
  <div className="estacionamento" key={index}>
  <div className="container">
    <div className="row">
      <div className="col-2">
        <div className="icon-container">
          <BsCashCoin size={25} color={item.tipo === 'Acréscimo de crédito' || 'Estacionamento' ? '#3DAE30' : '#3DAE30'} className="icon mt-1" />
          {resposta[index + 1] === undefined || null
          ? null : <div className="line"> </div>}
          <div className="spacer"></div>
        </div>
        </div>
      <div className="col-5 p-0">
        <div className="titulo text-start">
          {item.tipo === 'credito' ? 'Estacionamento' : 
          item.tipo === 'tolerancia' ? 'Estacionamento' : 
          item.tipo === 'regularizacao' ? 'Regularizacao'  : 'Acréscimo de crédito'
          } 
        {item.tipo === 'regularizacao' && window.innerWidth > 1110 ? ` - ${item.placa}` :
        item.tipo === 'credito' && window.innerWidth > 1110 ? ` - ${item.placa}` :
        item.tipo === 'tolerancia' && window.innerWidth > 1110 ? ` - ${item.placa}` :
        item.tipo === 'Acrescimo de credito' && window.innerWidth > 1110 ? ` - ${item.cnpj === '' ?  item.cpf : item.cnpj}` : 
        null}
        </div>
        </div>
        <div className="col-5 p-0">
        <div className="data text-end ">{item.data} </div> 
        </div>
        <div className="col-2">
        </div>
        <div className="col-5 p-0">
        <div className="preco text-start">{`R$ ${item.valor}`},00</div>
        </div>
        <div className="col-5 text-end">
        {item.tipo === 'regularizacao' && window.innerWidth <= 1110 ? `${item.placa}` :
        item.tipo === 'credito' && window.innerWidth <= 1110 ? `${item.placa}` :
        item.tipo === 'tolerancia' && window.innerWidth <= 1110 ? `${item.placa}` :
        item.tipo === 'Acrescimo de credito' && window.innerWidth <= 1110 ? `${item.cnpj === '' ?  item.cpf : item.cnpj}` : 
        null}
        </div>
      </div>
    </div>
</div>
))}
</div>
<div className="alert alert-danger mt-4 mx-3" role="alert" style={{ display: estado ? 'block' : 'none' }}>
  {mensagem}
</div>

<VoltarComponente />

</div>

);
}

export default HistoricoFinanceiroParceiro;