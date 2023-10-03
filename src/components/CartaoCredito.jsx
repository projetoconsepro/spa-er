import React, { useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import VoltarComponente from '../util/VoltarComponente';
import { Button, Group, Notification } from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';
import createAPI from '../services/createAPI';
import FuncTrocaComp from '../util/FuncTrocaComp';

const CartaoCredito = () => {
  const [cardNumber, setCardNumber] = useState('#### #### #### ####');
  const [cardHolder, setCardHolder] = useState('');
  const [expMonth, setExpMonth] = useState('mm');
  const [expYear, setExpYear] = useState('yy');
  const [cvv, setCvv] = useState('');
  const [logoMarca, setLogoMarca] = useState('');
  const [divMensagem, setDivmMensagem] = useState(false);


  const getCardFlag = async (cardNumber) => {
    const cardNumberRegex = [
    {regex: /^4[0-9]{12}(?:[0-9]{3})?$/, label: 'visa'},
    {regex: /^5[1-5][0-9]{14}$/, label: 'mastercard'},
    {regex: /^(4(0117[89]|3(1274|8935)|5(1416|7(393|63[12])))|50(4175|6(699|7([0-6]\d|7[0-8]))|9\d{3})|6(27780|36(297|368)|5(0(0(3[1-35-9]|4\d|5[01])|4(0[5-9]|([1-3]\d|8[5-9]|9\d))|5([0-2]\d|3[0-8]|4[1-9]|[5-8]\d|9[0-8])|7(0\d|1[0-8]|2[0-7])|9(0[1-9]|[1-6]\d|7[0-8]))|16(5[2-9]|[67]\d)|50([01]\d|2[1-9]|[34]\d|5[0-8]))))/, label: 'elocard'},
    ];
  
    const resp = cardNumberRegex.find((cardRegex) => cardNumber.match(cardRegex.regex));

    return resp;
  };

  const handleCardNumberChange =  async (e) => {
    let valorInput = e.target.value;
    let formattedValue = '';

    if (valorInput.length > 19) return;


    const numericValue = valorInput.replace(/\D/g, '');

    for (let i = 0; i < 16; i++) {
      formattedValue += numericValue[i] || '#';
      if ((i + 1) % 4 === 0 && i !== 15) {
        formattedValue += ' ';
      }
    }

    setCardNumber(formattedValue);

    const bandeira = await getCardFlag(numericValue);

    console.log(bandeira);

    if (bandeira) {
      setLogoMarca(`../../assets/img/cartaoCredito/${bandeira.label}.png`);
    } else {
      setLogoMarca('');
    }
    

    handleCvvMouseLeave();
  };

  const handleCardHolderChange = (e) => {
    let valorInput = e.target.value;
    valorInput = valorInput.replace(/[0-9]/g, '');

    if (valorInput === '') {
      setCardHolder('');
    }

    const UpperCase = valorInput.toUpperCase();

    setCardHolder(UpperCase);


    handleCvvMouseLeave();
  };

  const handleExpMonthChange = (e) => {
    setExpMonth(e.target.value);

    handleCvvMouseLeave();
  };

  const handleExpYearChange = (e) => {
    setExpYear(e.target.value);

    handleCvvMouseLeave();
  };

  const handleCvvMouseEnter = () => {
    document.querySelector('.front').style.transform = 'perspective(1000px) rotateY(-180deg)';
    document.querySelector('.back').style.transform = 'perspective(1000px) rotateY(0deg)';
  };

  const handleCvvMouseLeave = () => {
    document.querySelector('.front').style.transform = 'perspective(1000px) rotateY(0deg)';
    document.querySelector('.back').style.transform = 'perspective(1000px) rotateY(180deg)';
  };

  const handleOnclick = () => {
    if (document.querySelector('.front').style.transform === 'perspective(1000px) rotateY(0deg)') {
      document.querySelector('.front').style.transform = 'perspective(1000px) rotateY(-180deg)';
      document.querySelector('.back').style.transform = 'perspective(1000px) rotateY(0deg)';
    } else {
      document.querySelector('.front').style.transform = 'perspective(1000px) rotateY(0deg)';
      document.querySelector('.back').style.transform = 'perspective(1000px) rotateY(180deg)';
    }
  };

  const handleCvvChange = (e) => {
    setCvv(e.target.value);

    handleCvvMouseEnter();
  };

  function shuffleString(inputString, numPositions, order) {
    const array = inputString.split(''); // Converte a string em um array de caracteres
  
    for (let i = 0; i < order.length; i += 2) {
      const pos1 = order[i] % numPositions;
      const pos2 = order[i + 1] % numPositions;
  
      // Troca os elementos nas posições especificadas
      const temp = array[pos1];
      array[pos1] = array[pos2];
      array[pos2] = temp;
    }
  
    return array.join(''); // Converte o array de volta para uma string
  }


  const handleRegistrar = async () => {
    if (cardNumber.includes('#') || cardHolder === '' || expMonth === 'mm' || expYear === 'yy' || cvv === '') {
    
      setDivmMensagem(true);

      setTimeout(() => {
        setDivmMensagem(false);
      }, 5000);
      
    } else {
      const user = localStorage.getItem("user");
      const user2 = JSON.parse(user);

      const bandeira = await getCardFlag(cardNumber).label || '';
      const cardNumberText = cardNumber.replace(/\s/g, '');

      const dados = {
          "numero_cartao": cardNumberText,
          "ccv": cvv,
          "validade": `${expMonth},${expYear}`,
          "bandeira": bandeira
      };

      const stringDados = JSON.stringify(dados);

      let dadosBase64 = btoa(stringDados);

      dadosBase64 = dadosBase64.replace(/=/g, '._.');

      dadosBase64 = dadosBase64.replace(/i/g, '@');

      dadosBase64 = dadosBase64.replace(/Y/g, '=');

      dadosBase64 = dadosBase64.replace(/j/g, 'i');

      dadosBase64 = btoa(dadosBase64);

      dadosBase64 = dadosBase64.split('').reverse().join('');
      
      const idString = user2.id_usuario.toString();

      const numPositions = parseInt(idString.length) + parseInt(idString[0]) * 2;

      const data = new Date();

      let orderString = `${data.getDate()},${data.getMonth()},${data.getFullYear()},${data.getHours()}`;

      orderString = btoa(orderString);

      const order = [data.getDate(), data.getMonth(), data.getFullYear(), data.getHours()];

      const shuffledString = shuffleString(dadosBase64, numPositions, order);

      const requisicao = createAPI()

      requisicao.post('/cartao/', {
        "dados": `${shuffledString}$${orderString}`
      }).then((resposta) => {
        if (resposta.data.msg.resultado) {
          FuncTrocaComp('InserirCreditos');
        } else {
          alert('Erro ao cadastrar o cartão de crédito')
        }
      }
      ).catch((erro) => {
        console.log(erro);
      });
    }
  }


  return (

    <div className="container2 text-start">
      <div className="d-flex justify-content-center">
      <div className="card-container mt-5" onClick={()=>{handleOnclick()}}>
        <div className="front">
          <div className="image">
            <img src="../../assets/img/cartaoCredito/chip.png" alt="" />
            {logoMarca && <img src={logoMarca} alt="" style={{ width :  logoMarca.includes('elo') ? '85px' : '',  height: logoMarca.includes('elo') ? '40px' : '', }} className="logo" />}
          </div>
          <div className="card-number-box">{cardNumber}</div>
          <div className="flexbox">
            <div className="box">
              <span>NOME</span>
              <div className="card-holder-name">
              <TransitionGroup>
              {cardHolder.split('').map((digit, index) => (
            <CSSTransition key={index} classNames="fade" timeout={300}>
              <span className="card-holder">{digit}</span>
            </CSSTransition>
          ))}
        </TransitionGroup>
              </div>
            </div>
            <div className="box">
              <span>Validade</span>
              <div className="expiration">
                <span className="exp-month">{expMonth}/</span>
                <span className="exp-year">{expYear}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="back">
          <div className="stripe"></div>
          <div className="box">
            <span>CVV</span>
            <div className="cvv-box">{cvv}</div>
            {logoMarca && <img src={logoMarca} alt="" className="logo" />}
          </div>
        </div>
        </div>
      </div>
      <form className="mt-3">
        <div className="inputBox mb-3">
          <span>Número do cartão</span>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*" 
            maxLength={16}
            className="card-number-input"
            onChange={(e) => handleCardNumberChange(e)}
            onInput={(e) => {
              // Remove caracteres não numéricos
              e.target.value = e.target.value.replace(/[^0-9]/g, '');
            }}
          />
        </div>
        <div className="inputBox mb-2">
          <span>Nome do titular</span>
          <input
            type="text"
            className="card-holder-input"
            onChange={(e) => handleCardHolderChange(e)}
            value={cardHolder}
            maxLength={20}
          />
        </div>

          <div className="row">
          <div className="col-12">
            <div className="row mt-3 inputBox">
              <div className="col-4">
                <span>Mês da validade</span>
              </div>
              <div className="col-4">
                <span>Ano da validade</span>
              </div>
              <div className="col-4">
                <span>CVV</span>
              </div>
            </div>
            <div className="row">
            <div className="col-4">
          <div className="inputBox">
            <select
              name=""
              id=""
              className="month-input"
              onChange={handleExpMonthChange}
              defaultValue='month'
            >
              <option value="month"  disabled>
                mês
              </option>
              <option value="01">01</option>
              <option value="02">02</option>
              <option value="03">03</option>
              <option value="04">04</option>
              <option value="05">05</option>
              <option value="06">06</option>
              <option value="07">07</option>
              <option value="08">08</option>
              <option value="09">09</option>
              <option value="10">10</option>
              <option value="11">11</option>
              <option value="12">12</option>
            </select>
          </div>
          </div>
          <div className="col-4">
          <div className="inputBox">
            <select
              name=""
              id=""
              className="year-input"
              onChange={handleExpYearChange}
              defaultValue={'ano'}
            >
              <option value="ano" disabled>
                ano
              </option>
              <option value="21">2021</option>
              <option value="22">2022</option>
              <option value="23">2023</option>
              <option value="24">2024</option>
              <option value="25">2025</option>
              <option value="26">2026</option>
              <option value="27">2027</option>
              <option value="28">2028</option>
              <option value="29">2029</option>
              <option value="30">2030</option>
            </select>
          </div>
          </div>
          <div className="col-4">
          <div className="inputBox">
            <input
              type="text"
              maxLength="4"
              className="cvv-input"
              onMouseEnter={handleCvvMouseEnter}
              onMouseLeave={handleCvvMouseLeave}
              onChange={handleCvvChange}
            />
          </div>
          </div>
          </div>
          </div>
          </div>
        <div>
          <div className="row">
            {divMensagem &&
            <div className="col-12">
            <Notification color="red" title="Aviso!" mt={12}>
              Por favor, preencha todos os campos
            </Notification>
            </div>
            }
              <div className="col-12 d-flex justify-content-center mt-4">
              <Button
                variant="gradient"
                gradient={{ from: "indigo", to: "grape.8", deg: 45 }}
                size="md"
                fullWidth
                mt="md"
                radius="md"
                onClick={()=>{handleRegistrar()}}
              >
                Salvar ‎
                <IconArrowRight size="1.3rem" />
              </Button>
              </div>
          </div>
        </div>
      </form>
      <Group position="center" mt="lg">
        <VoltarComponente />
      </Group>
    </div>
  );
};

export default CartaoCredito;