jest.mock("../../services/createAPI", () => ({
  __esModule: true,
  default: () => {
    const id = JSON.parse(global.localStorage.getItem("user")).id_usuario;
    return { get: async () => ({ data: { msg: { resultado: true }, data: { elegivel: true, disponivel: true, id } } }) };
  },
}));

import { consultarAcessoRecarga, podeVerRecargaAutomatica } from "../../util/recargaAutomatica";

describe("M02 · acesso à recarga automática", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("sem usuário no localStorage resolve sem acesso e não rejeita", async () => {
    localStorage.removeItem("user");
    const acesso = await consultarAcessoRecarga();
    expect(acesso.acesso).toBe(false);
    expect(await podeVerRecargaAutomatica()).toBe(false);
  });
});
