import React, { useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

const CartaoCredito = () => {
  const [cardNumber, setCardNumber] = useState('#### #### #### ####');
  const [cardHolder, setCardHolder] = useState('');
  const [expMonth, setExpMonth] = useState('mm');
  const [expYear, setExpYear] = useState('yy');
  const [cvv, setCvv] = useState('');
  const [logoMarca, setLogoMarca] = useState('');

  const handleCardNumberChange = (e) => {
    setCardNumber(e.target.value);
    let valorInput = e.target.value;
    let formattedValue = '';

    const numericValue = valorInput.replace(/\D/g, '');

    for (let i = 0; i < 16; i++) {
      formattedValue += numericValue[i] || '#';
      if ((i + 1) % 4 === 0 && i !== 15) {
        formattedValue += ' ';
      }
    }

    setCardNumber(formattedValue);

    if (valorInput === '') {
      setLogoMarca('');
      setCardNumber('#### #### #### ####');
    }

    if (valorInput[0] === '4') {
      setLogoMarca("../../assets/img/cartaoCredito/visa.png");
    } else if (valorInput[0] === '5') {
      setLogoMarca("../../assets/img/cartaoCredito/mastercard.png");
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

  return (

    <div className="container text-start">
      <div className="d-flex justify-content-center">
      <div className="card-container mt-5" onClick={()=>{handleOnclick()}}>
        <div className="front">
          <div className="image">
            <img src="../../assets/img/cartaoCredito/chip.png" alt="" />
            {logoMarca && <img src={logoMarca} alt="" className="logo" />}
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
      <form action="">
        <div className="inputBox">
          <span>Número do cartão</span>
          <input
            type="number"
            maxLength="16"
            className="card-number-input"
            onChange={handleCardNumberChange}
          />
        </div>
        <div className="inputBox">
          <span>Nome do titular</span>
          <input
            type="text"
            className="card-holder-input"
            onChange={handleCardHolderChange}
            value={cardHolder}
            maxLength={26}
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
              <option value="2021">2021</option>
              <option value="2022">2022</option>
              <option value="2023">2023</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
              <option value="2027">2027</option>
              <option value="2028">2028</option>
              <option value="2029">2029</option>
              <option value="2030">2030</option>
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
                <div className="col-12 d-flex justify-content-center mt-4">
        <button className="btn3 botao">Salvar</button>
        </div>
        </div>
        </div>
      </form>
    </div>
  );
};

export default CartaoCredito;