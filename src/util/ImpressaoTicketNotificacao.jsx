import axios from 'axios'

const ImpressaoTicketNotificacao = (monitor, vaga, placa) => {
    const obterHoraAtual = () => {
        const dataAtual = new Date();
        const dia = dataAtual.getDate().toString().padStart(2, '0');
        const mes = (dataAtual.getMonth() + 1).toString().padStart(2, '0');
        const ano = dataAtual.getFullYear().toString();
        const hora = dataAtual.getHours().toString().padStart(2, '0');
        const minutos = dataAtual.getMinutes().toString().padStart(2, '0');
        const segundos = dataAtual.getSeconds().toString().padStart(2, '0');
        return `${dia}/${mes}/${ano} ${hora}:${minutos}:${segundos}`;
      };

      console.log(obterHoraAtual())

      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      const user2 = JSON.parse(user);
      const requisicao = axios.create({
        baseURL: process.env.REACT_APP_HOST,
        headers: {
          token: token,
          id_usuario: user2.id_usuario,
          perfil_usuario: user2.perfil[0],
        },
      });

      requisicao.post('/estacionamento/ticket', {
            tipo: 'NNOTIFICACAO',
            dataEmissao: obterHoraAtual(),
            monitor: monitor,
            vaga: vaga[0],
            placa: placa,
            valor: '12.00',
        })
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });

}

export default ImpressaoTicketNotificacao