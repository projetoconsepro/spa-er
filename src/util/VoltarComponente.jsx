import React, { useEffect, useState } from 'react'

const VoltarComponente = () => {
    const [estado, setEstado] = useState(false)  

    useEffect(() => {
        const componenteAnterior = localStorage.getItem('componente')
        const componenteProximo = localStorage.getItem('componenteAnterior')
        localStorage.setItem('componenteAnterior', componenteAnterior)
        localStorage.setItem('componente', componenteProximo)
    }, [estado])

  return (
        <button className="btn2 botao" type="button" onClick={() => setEstado(!estado)}>Voltar</button>
  )
}

export default VoltarComponente
