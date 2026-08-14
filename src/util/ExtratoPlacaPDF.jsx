import jsPDF from "jspdf";

const ExtratoPlacaPDF = (json) => {
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

  const [vagaNumero, valorLinha] = String(json.vaga ?? "").split("\n");
  const valorNumero = parseFloat(
    String(valorLinha ?? "").replace(/[^\d.,-]/g, "").replace(",", ".")
  );
  const valorFormatado = `Valor: R$ ${
    Number.isFinite(valorNumero) ? valorNumero.toFixed(2) : "0.00"
  }`;

  linha("CONSEPRO TAQUARA", 20, 10);
  linha(separador, 10, 10);
  linha("Estacionamento rotativo", 14, 14);

  linha(`Tipo: ${json.tipo}`, 12, 10);
  linha(`Placa: ${json.placa}`, 12, 10);
  linha(`Vaga: ${vagaNumero}`, 12, 10);
  linha(`Início: ${json.dataHoje} ${json.horaInicio}`, 12, 10);
  linha(`Validade: ${json.dataHoje} ${json.horaValidade}`, 12, 10);
  linha(`Monitor: ${json.monitor}`, 12, 10);
  linha(`Método: ${json.metodo}`, 12, 10);
  linha(valorFormatado, 12, 10);
  linha(`Notificações pendentes: ${json.notificacaoPendente ?? 0}`, 12, 14);

  linha(separador, 10, 10);
  linha("CNPJ: 89.668.040/0001-10", 11, 7);
  linha("Rua Júlio de Castilhos, 2500", 11, 7);
  linha("Taquara - RS", 11, 7);
  linha("(51) 9 8660-4241", 11, 7);

  const dateNow = new Date();
  const day = dateNow.getDate().toString().padStart(2, "0");
  const month = (dateNow.getMonth() + 1).toString().padStart(2, "0");
  const year = dateNow.getFullYear().toString().slice(-2);
  const fileName = `${day}-${month}-${year} - Extrato de Placa - ${json.placa}`;

  pdf.save(fileName);
};

export default ExtratoPlacaPDF;
