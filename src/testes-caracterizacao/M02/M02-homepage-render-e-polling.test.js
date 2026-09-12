/**
 * TESTE DE CARACTERIZAÇÃO — M02-03, M02-04, M02-05
 *
 * Achado:   HomePage escreve em localStorage DENTRO do corpo do render, decide
 *           a tela inicial por um `switch` que não tem caso para o perfil
 *           `agente`, e mantém um laço de `setTimeout` de 500 ms que nunca
 *           termina. Esse laço é o único mecanismo que faz o sistema perceber
 *           uma troca de tela — e também o que faz o logout ter efeito.
 * Onde:     src/pages/HomePage/HomePage.jsx:18-60 (render), :43-58 (switch),
 *           :93-98 (laço de 500 ms)
 * Padrões:  P12 (timer não limpo), P17, P06
 * Plano:    PLANO_REFATORACAO.md §2.5
 *
 *   Renderiza o HomePage REAL. Sidebar e Componentes são substituídos porque
 *   arrastariam as 68 telas; o alvo (HomePage) e o invólucro CaixaVerificacao
 *   são os de verdade.
 *
 *   Este teste PASSA contra o código atual.
 */

import { render, act, screen } from '@testing-library/react';

// HomePage é exportado já envolvido por CaixaVerificacao, que consulta a API e
// muda estado depois. Cada teste termina drenando essa promessa — senão o
// React avisa sobre atualização fora de act().
const drenar = () => act(async () => { await Promise.resolve(); });

jest.mock('../../components/Sidebar', () => () => <div data-testid="sidebar" />);
jest.mock('../../pages/HomePage/Componentes', () => ({ Componente }) => (
  <div data-testid="tela">{Componente}</div>
));
jest.mock('socket.io-client', () => ({
  __esModule: true,
  default: () => ({ emit: jest.fn(), on: jest.fn(), off: jest.fn() }),
  io: () => ({ emit: jest.fn(), on: jest.fn(), off: jest.fn() }),
}));
jest.mock('../../services/createAPI', () => ({
  __esModule: true,
  default: () => ({ get: () => Promise.resolve({ data: { msg: { resultado: true } } }) }),
}));

const HomePage = require('../../pages/HomePage/HomePage').default;

const usuario = (perfil) => JSON.stringify({ id_usuario: 7, nome: 'Fulano', perfil: [perfil] });

describe('M02 · HomePage', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.useFakeTimers();
  });
  afterEach(() => {
    act(() => { jest.runOnlyPendingTimers(); });
    jest.useRealTimers();
  });

  test('M02-03 · renderizar a página ESCREVE em localStorage — o render tem efeito colateral', async () => {
    expect(localStorage.getItem('componente')).toBeNull();

    render(<HomePage />);

    await drenar();
    expect(localStorage.getItem('componente')).toBe('LoginPage');
    // Sem usuário e sem tela permitida, o corpo do render grava a tela de login.
    // Em React 18 com StrictMode (como em src/index.js) o render é invocado
    // duas vezes em desenvolvimento — esta gravação acontece nas duas.
  });

  test('M02-03 · com usuário cliente parado na tela de login, o render redireciona', async () => {
    localStorage.setItem('user', usuario('cliente'));
    localStorage.setItem('componente', 'LoginPage');

    render(<HomePage />);

    await drenar();
    expect(localStorage.getItem('componente')).toBe('MeusVeiculos');
  });

  test('M02-04 · o switch não tem caso para "agente": ele fica preso na tela de login', async () => {
    localStorage.setItem('user', usuario('agente'));
    localStorage.setItem('componente', 'LoginPage');

    render(<HomePage />);

    await drenar();
    expect(localStorage.getItem('componente')).toBe('LoginPage');
    // Os outros quatro perfis são redirecionados; o agente cai no `default: break`.
    // Mesma coisa se ele parar em NewPassword, Confirmation ou ResetPassword.
  });

  test('M02-04 · e em NewPassword o agente também fica preso', async () => {
    localStorage.setItem('user', usuario('agente'));
    localStorage.setItem('componente', 'NewPassword');

    render(<HomePage />);

    await drenar();
    expect(localStorage.getItem('componente')).toBe('NewPassword');
  });

  test('M02-05 · o laço de 500 ms se reagenda para sempre', async () => {
    localStorage.setItem('user', usuario('cliente'));
    localStorage.setItem('componente', 'MeusVeiculos');

    render(<HomePage />);
    await drenar();

    for (let i = 0; i < 20; i += 1) {
      expect(jest.getTimerCount()).toBeGreaterThan(0);
      act(() => { jest.advanceTimersByTime(500); });
    }
    expect(jest.getTimerCount()).toBeGreaterThan(0);
    // 2 renderizações por segundo, por toda a sessão, em todo dispositivo.
    // Nenhum clearTimeout: o efeito depende de [cont], que ele mesmo altera.
  });

  test('M02-05 · é o laço que faz o logout surtir efeito — sem ele a tela não muda', async () => {
    localStorage.setItem('user', usuario('cliente'));
    localStorage.setItem('componente', 'MeusVeiculos');
    render(<HomePage />);
    await drenar();

    act(() => { jest.advanceTimersByTime(500); });
    expect(screen.getByTestId('tela').textContent).toBe('MeusVeiculos');

    // O logout do menu (Sidebar.handleLogout) só apaga chaves; não navega.
    localStorage.removeItem('user');
    localStorage.removeItem('token');

    // Nada acontece até o próximo tique do laço:
    act(() => { jest.advanceTimersByTime(500); });
    act(() => { jest.advanceTimersByTime(500); });

    expect(localStorage.getItem('componente')).toBe('LoginPage');
    // Consequência: quem remover o laço de 500 ms sem substituir a navegação
    // quebra o logout junto.
  });
});

/*
 * QUANDO CORRIGIR
 *   - A tela sai de localStorage e vai para a URL (react-router). O laço some.
 *   - O redirecionamento inicial vira uma função pura (perfil → rota), com
 *     entrada para `agente` e um destino padrão explícito.
 *   - Logout navega, em vez de depender de um efeito colateral do laço.
 */
