import jsPDF from "jspdf";

const TicketPDFBase = (subtitulo, linhas, sufixoArquivo) => {
  const pdf = new jsPDF();

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const centerX = pdfWidth / 2;
  const separador = "-".repeat(90);
  let y = 20;

  const linha = (texto, tamanhoFonte = 12, espacamento = 8) => {
    pdf.setFontSize(tamanhoFonte);
    const linhasTexto = pdf.splitTextToSize(String(texto ?? "-"), pdfWidth - 30);
    pdf.text(linhasTexto, centerX, y, { align: "center" });
    y += espacamento * linhasTexto.length;
  };

  linha("CONSEPRO TAQUARA", 20, 10);
  linha(separador, 10, 10);
  linha(subtitulo, 14, 14);

  linhas.forEach(({ texto, tamanhoFonte, espacamento }) =>
    linha(texto, tamanhoFonte, espacamento)
  );

  linha(separador, 10, 10);
  linha("CNPJ: 89.668.040/0001-10", 11, 7);
  linha("Rua Júlio de Castilhos, 2500", 11, 7);
  linha("Taquara - RS", 11, 7);
  linha("(51) 9 8660-4241", 11, 7);

  const dateNow = new Date();
  const day = dateNow.getDate().toString().padStart(2, "0");
  const month = (dateNow.getMonth() + 1).toString().padStart(2, "0");
  const year = dateNow.getFullYear().toString().slice(-2);
  const fileName = `${day}-${month}-${year} - ${sufixoArquivo}`;

  pdf.save(fileName);
};

export default TicketPDFBase;
