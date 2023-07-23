const FuncTrocaComp = (componente) => {
        const componenteAnterior = localStorage.getItem('componente')
        localStorage.setItem('componenteAnterior', componenteAnterior)
        localStorage.setItem('componente', componente)
}

export default FuncTrocaComp
