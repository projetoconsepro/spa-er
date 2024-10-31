const FormatDate = (date) => {
    const data = new Date(date);
    const year = data.getFullYear();
    const month = String(data.getMonth() + 1).padStart(2, '0');
    const day = String(data.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
  }

  const FormatDateBr = (date) => {
    const data = new Date(date);
    const year = data.getFullYear();
    const month = String(data.getMonth() + 1).padStart(2, "0");
    const day = String(data.getDate()).padStart(2, "0");
    const formattedDate = `${day}/${month}/${year}`;

    return formattedDate;
  };
  export {FormatDate, FormatDateBr};