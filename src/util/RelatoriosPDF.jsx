import jsPDF from 'jspdf';
import Logo from '../util/logoconseproof2.png';

const RelatoriosPDF = (nomeArquivo, cabecalho, array) => {
  const user = localStorage.getItem('user');
  const user2 = JSON.parse(user);


  const doc = new jsPDF();

  console.log(user2.nome)


const header = () => {
  const logoWidth = 30;
  const logoHeight = 12;
  const logoPositionX = doc.internal.pageSize.width - 15 - logoWidth;
  const logoPositionY = 6;
  doc.addImage(Logo, 'PNG', logoPositionX, logoPositionY, logoWidth, logoHeight);


  doc.setFontSize(16);
  doc.setTextColor(40);
  doc.text(nomeArquivo, 15, 10);
  doc.setFontSize(10);
  doc.setTextColor(100);
  const dateNow = new Date();
  const day = dateNow.getDate().toString().padStart(2, '0');
  const month = (dateNow.getMonth() + 1).toString().padStart(2, '0');
  const year = dateNow.getFullYear().toString();
  const hour = dateNow.getHours().toString().padStart(2, '0');
  const minute = dateNow.getMinutes().toString().padStart(2, '0');
  const formattedDate = `${day}/${month}/${year} ${hour}:${minute}`;
  doc.text(`Gerado por: ${user2.nome}`, 15, 17);
  doc.text(`Data: ${formattedDate}`, 15, 23);
};

  header();

  const dataD = [];
  dataD.push(...array.map((item) => Object.values(item)));

  doc.autoTable({
    startY: 30,
    head: [cabecalho],
    body: dataD,
    styles: {
      cell: {
        textColor: [0, 0, 0],
      },
    },
    didParseCell: function (data) {
      if (data.column.index === 3 && data.cell.raw === 'Pendente') {
        data.cell.styles.textColor = 'red';
      } else if (data.column.index === 3 && data.cell.raw === 'Quitado') {
        data.cell.styles.textColor = 'green';
      }
    },
  });
  const dateNow = new Date();
  const day = dateNow.getDate().toString().padStart(2, '0');
  const month = (dateNow.getMonth() + 1).toString().padStart(2, '0');
  const year = dateNow.getFullYear().toString().slice(-2);
  const formattedDate = `${day}-${month}-${year}`;

  const fileName = `${formattedDate} - ${nomeArquivo}`;

  
  const totalPages = doc.internal.getNumberOfPages();

  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(100);
    const text = `Página ${i} / ${totalPages}`;
    const textWidth = doc.getTextWidth(text);
    const textX = (doc.internal.pageSize.width - textWidth) / 2;
    const textY = doc.internal.pageSize.height - 3;
    
    doc.text(text, textX, textY);
  }

  doc.save(fileName);

};
export default RelatoriosPDF;