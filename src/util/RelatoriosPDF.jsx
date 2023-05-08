import jsPDF from 'jspdf';

const RelatoriosPDF = (nomeArquivo, cabecalho, array) => {
    const doc = new jsPDF();
    const dataD = [];

    dataD.push(...array.map((item) => Object.values(item)));

    doc.autoTable({
      head: [cabecalho],
      body: dataD,
      styles: {
        cell: {
          textColor: [0, 0, 0],
        },
      },
      didParseCell: function (data) {
        if (data.column.index === 3 && data.cell.raw === "Pendente") {
          data.cell.styles.textColor = 'red';
        } 
        else if(data.column.index === 3 && data.cell.raw === "Pago"){
          data.cell.styles.textColor = 'green'; 
        }
      },
    });

  const dateNow = new Date();
  const day = dateNow.getDate().toString().padStart(2, "0");
  const month = (dateNow.getMonth() + 1).toString().padStart(2, "0");
  const year = dateNow.getFullYear().toString().slice(-2);
  const formattedDate = `${day}-${month}-${year}`;

  const fileName = `${formattedDate} - ${nomeArquivo}`;

  doc.save(fileName);
}

export default RelatoriosPDF