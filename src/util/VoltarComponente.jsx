import React, { useEffect, useState } from 'react'

const VoltarComponente = () => {
    const [estado, setEstado] = useState(false)
    const [componenteAnterior, setComponenteAnterior] = useState('')
    const [componenteProximo, setComponenteProximo] = useState('')

    useEffect(() => {
        const componenteAnterior = localStorage.getItem('componente')
        const componenteProximo = localStorage.getItem('componenteAnterior')
        setComponenteAnterior(componenteAnterior)
        setComponenteProximo(componenteProximo)
    }, [])

    const voltar = () => {
        localStorage.setItem('componenteAnterior', componenteAnterior)
        localStorage.setItem('componente', componenteProximo)
    }

  return (
        <button className="btn2 botao" type="button" onClick={() => {voltar()}}>Voltar</button>
  )
}

export default VoltarComponente
