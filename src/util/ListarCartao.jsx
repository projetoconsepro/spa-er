import React, { useState, useEffect } from 'react';
import { Box, Button, Group, Image, Text } from '@mantine/core';
import { BsCreditCard2Back } from 'react-icons/bs';
import createAPI from '../services/createAPI';
import FuncTrocaComp from '../util/FuncTrocaComp';

const ListarCartao = ({ metodo, onNoCards }) => {
  const [creditCard, setCreditCard] = useState([]);
  const [CreditCardSelected, setCreditCardSelected] = useState(null);

  const getCreditCardFUNC = async () => {
    const requisicao = createAPI();
    await requisicao
      .get("/cartao/")
      .then((resposta) => {
        if (resposta.data.msg.resultado) {
          const newData = resposta.data.data
            .filter(item => (metodo === 'cartaoCred' ? item.credito === 'S' : item.debito === 'S'))
            .map((item) => ({
              cartao: item.id_cartao,
              bandeira: item.bandeira,
              numero: `#### #### #### ${item.cartao}`,
              debito: item.debito,
              credito: item.credito,
            }));
          setCreditCard(newData);
          
          if (newData.length === 0 && onNoCards) onNoCards();
        } else {
          setCreditCard([]);
          if (onNoCards) onNoCards();
        }
      })
      .catch((err) => {
        setCreditCard([]);
        if (onNoCards) onNoCards();
      });
  };

  useEffect(() => {
    getCreditCardFUNC();
  }, [metodo]);

  return (
    <>
      <Group className='mt-4 mb-3' position="apart">
        <Text weight={500}>Selecione seu cartão:</Text>
      </Group>
      {creditCard.map((item, index) => (
        <div key={index}>
          <Box
            className="border border-black rounded mb-2 align-items-center"
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
                ) : (
                  <BsCreditCard2Back className="m-2"
                    size={30}
                    color={CreditCardSelected === index ? 'white' : 'black'} />
                )}
              </div>
              <div className={CreditCardSelected === index ? "text-start text-white mx-2" : "text-start mx-2"}>
                <Text weight={400} style={{ marginTop: '-3px' }}>{item.numero}</Text>
              </div>
            </div>
          </Box>
        </div>
      ))}
      <Button className='botao-add mt-1 py-3' onClick={() => { FuncTrocaComp('CartaoCredito'); }}>
        Adicionar novo cartão
      </Button>
    </>
  );
};

export default ListarCartao;