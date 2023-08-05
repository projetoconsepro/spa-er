import axios from 'axios';

const ImpressaoFecharCaixa = async (item, valor) => {

    const FormatDate =  (date) => {
        const data = new Date(date);
        const year = data.getFullYear();
        const month = String(data.getMonth() + 1).padStart(2, '0');
        const day = String(data.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
    
        return formattedDate;
      }

        console.log(item)

        const json = {
            tipo: 'FECHAMENTO DE CAIXA',
            dataEmissao: FormatDate(item.data),
            valorMovimento: item.valor_movimentos,
            valorAbertura: item.valor_abertura,
            valorFechamento: valor,
        }
        console.log(json)
        if(window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify(json));

    }
        

   

}

export default ImpressaoFecharCaixa;