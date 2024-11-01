import React, { useState, useEffect } from 'react';
import "../pages/Style/styles.css";
import VoltarComponente from "../util/VoltarComponente";
import { Card } from "@mantine/core";
import Filtro from "../util/Filtro";


const HistoricoRecargaAuto = () => {
 

  return (
    <div className="mb-3">
     
      <p className=" text-start fs-4 fw-bold">
        <VoltarComponente arrow={true} /> Histórico Recarga Automática:
      </p>
      <div className="row mb-3">
        <div className="col-5 ">
          <Filtro
            nome={"HistoricoRecargaAuto"}
          />
        </div>
        <div className="col-6 text-end mt-1">
  
        </div>
      </div>
        <div>
      <Card shadow="sm" radius="md" withBorder>
        <div className="container px-2 py-2">
          <div className="row">
            <div className="col-12">
              <div className="text-start"  style={{fontWeight: '700', fontSize: '20px'}}>
                Aviso!
              </div>
              <div className="text-start mt-2" style={{fontWeight: '500'}}>
                Não conseguimos processar a recarga automática no seu cartão. Por favor, verifique as informações e tente novamente.
              </div>
              <div className="text-start mt-4">
                               <button className="btn text-white py-2" style={{ backgroundColor: '#A81010', width:'100%', fontSize: '17px' }}>
                  Tente novamente
                </button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
    <div className="mb-3 mt-4">
        <Card className='mt-2' shadow="sm" radius="md" withBorder>
          <div className="container px-3">
            <div className="row">
              <div className="col-2 d-flex align-items-center" style={{ padding: 0 }}>
                <div className="icon-container" style={{ margin: 0 }}>
                  <img 
                    src="../../assets/img/cartao-de-credito-aceito.png" 
                    alt="cartão" 
                    className='pe-2'
                    style={{ width: '70px'}}
                  />
                  <div className="spacer"></div>
                </div>
              </div>
              <div className="col-6 p-0 d-flex align-items-center ps-2">
                <div className="titulo text-success text-start  m-0" style={{ lineHeight: 'normal', width: '150px', fontWeight: '600' }}>
                  Saldo adicionado com sucesso
                </div>
              </div>
              <div className="col-4 p-0 d-flex flex-column align-items-end justify-content-center">
                <div className="preco text-success text-end w-100">
                 R$ 20,00
                </div>
                <div className="data text-end w-100">29/10/2024 14:17:08</div>
              </div>
            </div>
          </div>
        </Card>
    </div>

      <VoltarComponente />
    </div>
  );
};

export default HistoricoRecargaAuto;