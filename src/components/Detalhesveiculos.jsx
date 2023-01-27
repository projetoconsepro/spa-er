import React from 'react';
import { useState, useEffect } from "react";

const Detalhesveiculos = () => {

    return (
        <div class="card border-0 d-flex align-items-center justify-content-between pb-3">
        <button className="btn2 botao mt-2 w-75"> Estacionar </button>
        <button className="btn2 botao mt-2 w-75"> Irregularidades </button>
        <button className="btn2 botao mt-2 w-75"> Histórico </button>
        <button className="btn2 bg-danger mt-2 w-75 text-white"> Remover veículo </button>
        </div>
    )
}

export default Detalhesveiculos;