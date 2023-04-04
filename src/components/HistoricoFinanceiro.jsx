import React from "react";
import { FaCar } from "react-icons/fa";
import { Container, Row, Col } from "react-bootstrap";

const HistoricoFinanceiro = () => {
    return (
        
    <div>
        <p className="mx-3 text-start fs-4 fw-bold">Histórico financeiro:</p>
        <div className="row">
        <div className="col-5"> 
      <select className="mx-3 form-select form-select-sm mb-3" defaultValue="1" aria-label=".form-select-lg example" id="filtroSelect2">
        <option disabled  value='1' id="filtro">Filtro</option>
      <option value="selectPlaca">Placa</option>
        <option value="selectData">Data</option>
        <option value="selectVaga">Vaga</option>
        <option value="selectStatus">Status</option>
        </select>
    </div>
    </div>
   <div className="estacionamento">
  <div className="container">
    <div className="row">
      <div className="col-2">
        <div className="icon-container">
          <FaCar size={25} className="icon" />
          <div className="line"></div>
          <div className="spacer"></div>
        </div>
        </div>
      <div className="col-5 p-0">
        <div className="titulo text-start mt-1">
          Estacionamento
        </div>
        </div>
        <div className="col-5 p-0">
        <div className="data text-end mt-2">02/03/23 - 09:23</div>
        </div>
        <div className="col-2">
        </div>
        <div className="col-5 p-0">
        <div className="preco text-start">R$ 03,00</div>
        </div>
      </div>
    </div>
</div>
<div className="estacionamento">
  <Container>
    <Row>
      <Col xs="2">
        <div className="icon-container">
          <FaCar size={25} className="icon" />
          <div className="line"></div>
          <div className="spacer"></div>
        </div>
      </Col>
      <Col xs="5" className="p-0">
        <div className="titulo text-start mt-1">
          Estacionamento
        </div>
        </Col>
        <Col xs="5" className="p-0">
        <div className="data text-end mt-2">02/03/23 - 09:23</div>
        </Col>
        <Col xs="2">
        </Col>
        <Col xs="5" className="p-0">
        <div className="preco text-start">R$ 03,00</div>
      </Col>
    </Row>
  </Container>
</div>
<div className="estacionamento">
  <Container>
    <Row>
      <Col xs="2">
        <div className="icon-container">
          <FaCar size={25} className="icon" />
          <div className="line"></div>
          <div className="spacer"></div>
        </div>
      </Col>
      <Col xs="5" className="p-0">
        <div className="titulo text-start mt-1">
          Estacionamento
        </div>
        </Col>
        <Col xs="5" className="p-0">
        <div className="data text-end mt-2">02/03/23 - 09:23</div>
        </Col>
        <Col xs="2">
        </Col>
        <Col xs="5" className="p-0">
        <div className="preco text-start">R$ 03,00</div>
      </Col>
    </Row>
  </Container>
</div>
<div className="estacionamento">
  <Container>
    <Row>
      <Col xs="2">
        <div className="icon-container">
          <FaCar size={25} className="icon" />
          <div className="line"></div>
          <div className="spacer"></div>
        </div>
      </Col>
      <Col xs="5" className="p-0">
        <div className="titulo text-start mt-1">
          Estacionamento
        </div>
        </Col>
        <Col xs="5" className="p-0">
        <div className="data text-end mt-2">02/03/23 - 09:23</div>
        </Col>
        <Col xs="2">
        </Col>
        <Col xs="5" className="p-0">
        <div className="preco text-start">R$ 03,00</div>
      </Col>
    </Row>
  </Container>
</div>
<div className="estacionamento">
  <Container>
    <Row>
      <Col xs="2">
        <div className="icon-container">
          <FaCar size={25} className="icon" />
          <div className="line"></div>
          <div className="spacer"></div>
        </div>
      </Col>
      <Col xs="5" className="p-0">
        <div className="titulo text-start mt-1">
          Estacionamento
        </div>
        </Col>
        <Col xs="5" className="p-0">
        <div className="data text-end mt-2">02/03/23 - 09:23</div>
        </Col>
        <Col xs="2">
        </Col>
        <Col xs="5" className="p-0">
        <div className="preco text-start">R$ 03,00</div>
      </Col>
    </Row>
  </Container>
</div>
</div>

);
}

export default HistoricoFinanceiro;