/**
 * TESTE — troca de senha no primeiro acesso e na recuperação
 *
 * O que garante:
 *   - no primeiro acesso com a senha padrão, o login guarda o token e o
 *     perfil, e a troca de senha vai com eles no cabeçalho;
 *   - na recuperação, a tela do código e a tela da nova senha mandam o e-mail
 *     junto com o código, e o e-mail só sai do armazenamento depois da troca;
 *   - o app continua mandando o que já mandava (`id_usuario` no corpo, o
 *     código e o telefone).
 * Onde:     src/pages/contexts/auth.jsx (login), src/components/NewPassword.jsx,
 *           src/components/Confirmation.jsx, src/components/LoginPage.jsx
 *
 *   Usa as telas REAIS com o axios substituído por um cliente que registra
 *   as chamadas.
 */

import { useContext } from 'react';
import {
  render, screen, fireEvent, act,
} from '@testing-library/react';
import sha256 from 'crypto-js/sha256';

// Registro simples, e não jest.fn(): a configuração do CRA usa `resetMocks`.
const mockChamadas = [];
let mockResposta = { data: { msg: { resultado: true, msg: 'ok' } } };
jest.mock('axios', () => {
  const cliente = {
    post: (...args) => { mockChamadas.push({ metodo: 'post', args }); return Promise.resolve(mockResposta); },
    get: (...args) => { mockChamadas.push({ metodo: 'get', args }); return Promise.resolve(mockResposta); },
  };
  return { __esModule: true, default: { create: () => cliente } };
});

let mockLogin;
jest.mock('../../services/api', () => ({
  __esModule: true,
  api: { defaults: { headers: {} } },
  createSession: () => Promise.resolve(mockLogin),
  registrar: () => Promise.resolve({}),
}));

const NewPassword = require('../../components/NewPassword').default;
const Confirmation = require('../../components/Confirmation').default;
const { AuthContext, AuthProvider } = require('../../pages/contexts/auth');

const digitar = (placeholder, valor) => {
  fireEvent.change(screen.getByPlaceholderText(placeholder), { target: { value: valor } });
};
// Drena a promessa da chamada à API antes das asserções.
const drenar = () => act(async () => { await Promise.resolve(); });
const confirmar = async () => {
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar' }));
  await drenar();
};

describe('M01 · troca de senha', () => {
  beforeEach(() => {
    localStorage.clear();
    mockChamadas.length = 0;
    mockResposta = { data: { msg: { resultado: true, msg: 'ok' } } };
  });

  test('login com a senha padrão guarda o token e o perfil para a troca', async () => {
    mockLogin = {
      data: {
        msg: { resultado: true, msg: 'Usuário Logado com Sucesso!' },
        dados: {
          senhaPadrao: true,
          token: 'token-do-login',
          usuario: { id_usuario: 7, perfil: [{ perfil: 'monitor' }] },
        },
      },
    };
    let login;
    const Captura = () => { ({ login } = useContext(AuthContext)); return null; };
    render(<AuthProvider><Captura /></AuthProvider>);

    await act(async () => { await login('fulano@exemplo.com', '123'); });

    expect(localStorage.getItem('tokenSenhaDefault')).toBe('token-do-login');
    expect(localStorage.getItem('perfilSenhaDefault')).toBe('monitor');
    expect(localStorage.getItem('id_usuario')).toBe('7');
    expect(localStorage.getItem('componente')).toBe('NewPassword');
    expect(localStorage.getItem('token')).toBeNull();
  });

  test('a troca da senha padrão vai com o token, a conta e o perfil no cabeçalho', async () => {
    localStorage.setItem('SenhaDefault', 'true');
    localStorage.setItem('id_usuario', '7');
    localStorage.setItem('tokenSenhaDefault', 'token-do-login');
    localStorage.setItem('perfilSenhaDefault', 'monitor');
    render(<NewPassword />);

    digitar('Digite sua senha', 'nova-senha');
    digitar('Digite sua senha novamente', 'nova-senha');
    await confirmar();

    expect(mockChamadas).toHaveLength(1);
    const [url, corpo, config] = mockChamadas[0].args;
    expect(url).toBe('/usuario/senha');
    expect(corpo).toEqual({ senha: sha256('nova-senha').toString(), id_usuario: '7' });
    expect(config.headers).toEqual({ token: 'token-do-login', id_usuario: '7', perfil_usuario: 'monitor' });
    expect(localStorage.getItem('tokenSenhaDefault')).toBeNull();
    expect(localStorage.getItem('perfilSenhaDefault')).toBeNull();
    expect(localStorage.getItem('componente')).toBe('LoginPage');
  });

  test('a tela do código manda o código e o e-mail, e guarda o e-mail para a troca', async () => {
    localStorage.setItem('email', 'pessoa+1@exemplo.com');
    render(<Confirmation />);

    digitar('Digite o codigo enviado ao seu email', '123456');
    await confirmar();

    expect(mockChamadas[0].metodo).toBe('get');
    expect(mockChamadas[0].args[0]).toBe('/verificar?codigo=123456&email=pessoa%2B1%40exemplo.com');
    expect(localStorage.getItem('codigoConfirm')).toBe('123456');
    expect(localStorage.getItem('email')).toBe('pessoa+1@exemplo.com');
    expect(localStorage.getItem('componente')).toBe('NewPassword');
  });

  test('código recusado: a tela mostra a mensagem e não avança', async () => {
    mockResposta = { data: { msg: { resultado: false, msg: 'Código inválido ou vencido. Peça um novo código.' } } };
    localStorage.setItem('email', 'pessoa@exemplo.com');
    render(<Confirmation />);

    digitar('Digite o codigo enviado ao seu email', '000000');
    await confirmar();

    expect(screen.getByText('Código inválido ou vencido. Peça um novo código.')).toBeTruthy();
    expect(localStorage.getItem('codigoConfirm')).toBeNull();
    expect(localStorage.getItem('componente')).toBeNull();
  });

  test('a nova senha pela recuperação vai com o código e o e-mail', async () => {
    localStorage.setItem('codigoConfirm', '123456');
    localStorage.setItem('email', 'pessoa@exemplo.com');
    render(<NewPassword />);

    digitar('Digite sua senha', 'nova-senha');
    digitar('Digite sua senha novamente', 'nova-senha');
    await confirmar();

    const [url, corpo] = mockChamadas[0].args;
    expect(url).toBe('/usuario/senha');
    expect(corpo).toEqual({
      codigo_seguranca: '123456',
      email: 'pessoa@exemplo.com',
      senha: sha256('nova-senha').toString(),
      telefone: '',
    });
    expect(localStorage.getItem('email')).toBeNull();
    expect(localStorage.getItem('codigoConfirm')).toBeNull();
    expect(localStorage.getItem('componente')).toBe('LoginPage');
  });
});
