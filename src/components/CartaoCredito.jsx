import React, { useState } from 'react';

const CartaoCredito = () => {
  const [numeroTarjeta, setNumeroTarjeta] = useState('#### #### #### ####');
  const [nomeTarjeta, setnomeTarjeta] = useState('NOME');
  const [logoMarca, setLogoMarca] = useState('');
  const [firma, setFirma] = useState('');
  const [mesExpiracion, setMesExpiracion] = useState('MM');
  const [yearExpiracion, setYearExpiracion] = useState('AA');
  const [ccv, setCCV] = useState('');
  const [formularioAtivo, setFormularioAtivo] = useState(false);

  const mostrarFrente = () => {
    if (document.getElementById('tarjeta').classList.contains('active')) {
      document.getElementById('tarjeta').classList.remove('active');
    }
  };

  const mostrarAtras = () => {
    const tarjeta = document.getElementById('tarjeta');
    if (!tarjeta.classList.contains('active')) {
      tarjeta.classList.add('active');
    }
  };

  const handleTarjetaClick = () => {
    document.getElementById('tarjeta').classList.toggle('active');
  };

  const handleFormularioClick = () => {
    setFormularioAtivo(!formularioAtivo);
  };

  const handleNumeroTarjetaChange = (e) => {
    let valorInput = e.target.value;
    let formattedValue = '';

    // Remove qualquer caractere não numérico do valor digitado
    const numericValue = valorInput.replace(/\D/g, '');

    // Adiciona os caracteres do número do cartão formatado
    for (let i = 0; i < 16; i++) {
      formattedValue += numericValue[i] || '#';
      if ((i + 1) % 4 === 0 && i !== 15) {
        formattedValue += ' ';
      }
    }

    setNumeroTarjeta(formattedValue);
  
    setNumeroTarjeta(formattedValue);

    if (valorInput === '') {
      setLogoMarca('');
      setNumeroTarjeta('#### #### #### ####');
    }

    if (valorInput[0] === '4') {
      setLogoMarca("../../assets/img/cartaoCredito/logos/visa.png");
    } else if (valorInput[0] === '5') {
      setLogoMarca("../../assets/img/cartaoCredito/logos/mastercard.png");
    }

    mostrarFrente();
  };

  const handlenomeTarjetaChange = (e) => {
    let valorInput = e.target.value;
    valorInput = valorInput.replace(/[0-9]/g, '');
    setnomeTarjeta(valorInput);
    setFirma(valorInput);

    if (valorInput === '') {
      setnomeTarjeta('NOME');
    }

    mostrarFrente();
  };

  const handleMesExpiracionChange = (e) => {
    setMesExpiracion(e.target.value);
    mostrarFrente();
  };

  const handleYearExpiracionChange = (e) => {
    setYearExpiracion(e.target.value.slice(2));
    mostrarFrente();
  };

  const handleCCVChange = (e) => {
    let valorInput = e.target.value;
    valorInput = valorInput.replace(/\s/g, '').replace(/\D/g, '');
    setCCV(valorInput);
    mostrarAtras();
  };

  const yearActual = new Date().getFullYear();
  return (
    <div className="contenedor">
       <section id="tarjeta" className="tarjeta mx-5" onClick={handleTarjetaClick}>
       <div className="delantera mx-4">
        <div className="row">
        <div className="logo-banco col-6" id="logo-banco">
            <h6 className='text-white mt-3 fs-4'>CONSEPRO</h6>
        </div>
          <div className="logo-marca col-6" id="logo-marca">
            {logoMarca && <img src={logoMarca} alt="Logo" />}
        </div>
          </div>
          <img src="../../assets/img/cartaoCredito/chip-tarjeta.png" className="chip" alt="hahaha" />
          <div className="datos">
            <div className="grupo" id="numero">
              <p className="label text-start">Número Tarjeta</p>
              <p className="numero text-start" >{numeroTarjeta}</p>
            </div>
            <div className="flexbox">
              <div className="grupo" id="nombre">
                <p className="label text-start">Nome</p>
                <p className="nombre">{nomeTarjeta}</p>
              </div>

              <div className="grupo" id="expiracion">
                <p className="label">Validade</p>
                <p className="expiracion">
                  <span className="mes">{mesExpiracion}</span> / <span className="year">{yearExpiracion}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="trasera mx-4">
          <div className="barra-magnetica"></div>
          <div className="datos">
            <div className="grupo" id="firma">
              <p className="label">Firma</p>
              <div className="firma">
                <p>{firma}</p>
              </div>
            </div>
            <div className="grupo" id="ccv">
              <p className="label">CCV</p>
              <p className="ccv">{ccv}</p>
            </div>
          </div>
          <a href="#" className="link-banco">
            CONSEPRO
          </a>
        </div>
      </section>

      <div className="contenedor-btn">
        <button className={`btn-abrir-formulario ${formularioAtivo ? 'active' : ''}`} id="btn-abrir-formulario" onClick={handleFormularioClick}>
          <i className="fas fa-plus"></i>
        </button>
      </div>

      <form action="" id="formulario-tarjeta" className={`formulario-tarjeta ${formularioAtivo ? 'active' : ''}`}>
        <div className="grupo">
          <label htmlFor="inputNumero" className='text-start'>Número do cartão</label>
          <input type="text" id="inputNumero" maxLength="19" autoComplete="off" onChange={handleNumeroTarjetaChange} />
        </div>
        <div className="grupo">
          <label htmlFor="inputNombre" className='text-start'>Nome</label>
          <input type="text" id="inputNombre" maxLength="19" autoComplete="off" onChange={handlenomeTarjetaChange} />
        </div>
        <div className="flexbox">
          <div className="grupo expira">
            <label htmlFor="selectMes">Validade</label>
            <div className="flexbox">
              <div className="grupo-select">
                <select name="mes" id="selectMes" onChange={handleMesExpiracionChange}>
                  <option disabled selected>Mês</option>
                  {[...Array(12)].map((_, index) => (
                    <option key={index} value={index + 1}>
                      {index + 1}
                    </option>
                  ))}
                </select>
                <i className="fas fa-angle-down"></i>
              </div>
              <div className="grupo-select">
                <select name="year" id="selectYear" onChange={handleYearExpiracionChange}>
                  <option disabled selected>Ano</option>
                  {[...Array(8)].map((_, index) => (
                    <option key={index} value={yearActual + index}>
                      {yearActual + index}
                    </option>
                  ))}
                </select>
                <i className="fas fa-angle-down"></i>
              </div>
            </div>
          </div>

          <div className="grupo ccv">
            <label htmlFor="inputCCV">CVV</label>
            <input type="number" id="inputCCV" maxLength="3" onChange={handleCCVChange} />
          </div>
        </div>
        <button type="submit" className="btn-enviar">
          Enviar
        </button>
      </form>
    </div>
  );
};

export default CartaoCredito;