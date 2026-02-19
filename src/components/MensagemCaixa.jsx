function MensagemCaixa() {
  return (
    <div
      className="container"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="row justify-content-center form-bg-image" data-background-lg="../../assets/img/illustrations/signin.svg">
        <div className="col-12 d-flex align-items-center justify-content-center">
          <div className="bg-white shadow-lg border-0 rounded-4 p-4 p-lg-5 w-100 fmxw-500 text-center">
            <div className="mb-3">
              <i className="bi bi-exclamation-octagon-fill text-danger" style={{ fontSize: '3rem' }}></i>
            </div>
            <h3 className="mb-3 text-danger fw-bold">Atenção!</h3>
            <p className="text-muted mb-2" style={{ fontSize: '17px', lineHeight: '1.6' }}>
              Para continuar utilizando o sistema, é necessário solicitar a <strong>abertura do caixa</strong> com um administrador.
            </p>
            <p className="text-dark fw-semibold mt-3" style={{ fontSize: '16px' }}>
              Dirija-se ao responsável para realizar a abertura do caixa.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MensagemCaixa;