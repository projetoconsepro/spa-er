
function formatNumero(number) {
    return new Intl.NumberFormat('pt-BR', { style: 'decimal', minimumFractionDigits: 2 }).format(number);
  }

export default formatNumero;