import { Button } from '@mantine/core'
import { IconArrowLeft } from '@tabler/icons-react'
import React, { useEffect, useState } from 'react'

export const VoltarComponente = ({ space, arrow , fechar}) => {

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
    <>
    {fechar ?
        <Button style={{ width: '300px', height: '51px'}} size="md" radius="md" onClick={() => {voltar()}}>Fechar</Button> 
        : (
            arrow ?
            <IconArrowLeft className="mb-1" onClick={() => {voltar()}}/>
            : 
            <Button className={space ? "bg-gray-500 mx-2" : "bg-gray-500"} size="md" radius="md" onClick={() => {voltar()}}>Voltar</Button> 
        )
    }
    </>
)
}

export const voltar = () => {
    const componenteAnterior = localStorage.getItem('componente')
    const componenteProximo = localStorage.getItem('componenteAnterior')
    localStorage.setItem('componenteAnterior', componenteAnterior)
    localStorage.setItem('componente', componenteProximo)
}

export default VoltarComponente