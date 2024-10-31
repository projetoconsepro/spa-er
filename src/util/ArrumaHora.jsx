function ArrumaHora(data) {
    const data2 = data.split("T");
    const data3 = data2[0].split("-");
    const data4 = data3[2] + "/" + data3[1] + "/" + data3[0];
    const data6 = data2[1].split(":");
    const data5 = data4 + " " + (data6[0] - 3) + ":" + data6[1];
    return data5;
  }

  function ArrumaHora2(data) {
    const data2 = data.split("T");
    const data6 = data2[1].split(":");
    const data5 = data6[0] - 3 + ":" + data6[1] + ":";
    const data7 = data5 + data6[2].split(".")[0];
    return data7;
  }
  function ArrumaHora3(data) {
    const data2 = data.split("T");
    const data3 = data2[0].split("-");
    const data4 = data3[2] + "/" + data3[1] + "/" + data3[0];
    return data4;
  }

  export { ArrumaHora, ArrumaHora2, ArrumaHora3 };