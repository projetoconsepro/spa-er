import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Detalhesveiculos = () => {
    const [valorcobranca, setValorCobranca] = useState("");
    const [valorcobranca2, setValorCobranca2] = useState("2");
    const [valor, setValor] = useState(0);
    const [vaga, setVaga] = useState([]);
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const user2 = JSON.parse(user);

    const saldo = axios.create({
        baseURL: process.env.REACT_APP_HOST,
        headers: {
            'token': token,
            'id_usuario': user2.id_usuario,
            'perfil_usuario': "cliente"
        }
    })

    useEffect(() => {
        saldo.get('/usuario/saldo-credito'
        ).then(
            response => {
                if(response.data.msg.resultado){
                    setValor(response.data.data.saldo);
                }
                else{
                    setValor(0);
                }
            }
        ).catch(function (error) {
            console.log(error);
        });
    }, [])

    const atualizafunc = () => {
        const tempo1 = document.getElementById("tempos").value;

        if(tempo1 === "02:00:00"){
            setValorCobranca2(valorcobranca*2);
        }
        else if(tempo1 === "01:00:00"){
            setValorCobranca2(valorcobranca);
        }
        else if(tempo1 === "00:30:00"){
            setValorCobranca2(valorcobranca/2);
        }
    }

    return (
        <div className="h6 mt-3 mx-5" onChange={atualizafunc}>
                <select class="form-select form-select-lg mb-1" aria-label=".form-select-lg example" id="tempos">
                        <option value="00:30:00">30 Minutos</option>
                        <option value="01:00:00" selected>60 Minutos</option>
                        <option value="02:00:00">120 Minutos</option>
                </select>
                        <p id="tempoCusto" className="text-end">Esse tempo ira custar: R$ {valorcobranca2},00 </p>
                            <div className="form-group mb-4 mt-4">
                                <p className='text-start' id='vagaInput'>Numero da vaga:</p>
                                <div className="input-group">
                                    <input className="form-control" value={vaga} onChange={(e) => setVaga([e.target.value])} placeholder="Exemplo: 003" />
                                </div>
                            </div>
                            <div className="mt-1 mb-5 gap-2 d-md-block">
                                <button type="submit" onClick='' className="btn5 botao">Confirmar</button>
                            </div>
                    </div>
    )
}

export default Detalhesveiculos;