/**
 * TESTE DE CARACTERIZAÇÃO — M02-06, M02-07
 *
 * Achado:   `CaixaVerificacao` é um invólucro que decide, para o perfil
 *           `monitor`, se o sistema inteiro aparece ou se aparece a mensagem
 *           "abra o caixa". A primeira decisão é tomada com o valor guardado em
 *           `localStorage.caixa`, antes de a API responder — um valor que a
 *           própria monitora pode editar. E ele abre uma conexão WebSocket no
 *           carregamento do módulo, antes de qualquer componente montar.
 * Onde:     src/util/CaixaVerificacao.js:6-12 (socket no módulo), :16 (estado
 *           inicial vindo do localStorage), :76-84 (a decisão)
 * Padrões:  P17, P15
 * Plano:    PLANO_REFATORACAO.md §2.5
 *
 *   Usa o CaixaVerificacao REAL. Este teste PASSA contra o código atual.
 */

import { render, act, screen } from '@testing-library/react';

// Drena a promessa da consulta ao caixa antes de encerrar o teste.
const drenar = () => act(async () => { await Promise.resolve(); });

// Contador simples, e não jest.fn(): a configuração do CRA usa `resetMocks`,
// que zeraria a chamada feita no carregamento do módulo — justamente a que
// este teste quer registrar.
const mockRegistro = { socketsAbertos: 0 };
jest.mock('socket.io-client', () => {
  const fake = () => {
    mockRegistro.socketsAbertos += 1;
    return { emit: () => {}, on: () => {}, off: () => {} };
  };
  return { __esModule: true, default: fake, io: fake };
});

const mockGetChamado = jest.fn();
let mockRespostaDaApi = { data: { msg: { resultado: false } } };
jest.mock('../../services/createAPI', () => ({
  __esModule: true,
  default: () => ({ get: (...a) => { mockGetChamado(...a); return Promise.resolve(mockRespostaDaApi); } }),
}));

const CaixaVerificacao = require('../../util/CaixaVerificacao').default;

const Protegido = () => <div data-testid="conteudo">tela do sistema</div>;
const Embrulhado = CaixaVerificacao(Protegido);

const usuario = (perfil) => JSON.stringify({ id_usuario: 7, nome: 'Fulano', perfil: [perfil] });

describe('M02 · CaixaVerificacao', () => {
  beforeEach(() => {
    localStorage.clear();
    mockGetChamado.mockClear();
    mockRespostaDaApi = { data: { msg: { resultado: false } } };
  });

  test('M02-06 · a conexão WebSocket é aberta ao importar o módulo, não ao montar', () => {
    expect(mockRegistro.socketsAbertos).toBeGreaterThanOrEqual(1);
    // O `io(...)` está no escopo do módulo. Como Componentes.jsx importa as 68
    // telas no arranque, os sockets de módulo de todas elas abrem junto.
  });

  test('monitor sem caixa aberto vê a mensagem, não o sistema', async () => {
    localStorage.setItem('user', usuario('monitor'));
    localStorage.setItem('caixa', 'false');

    render(<Embrulhado />);
    await drenar();

    expect(screen.queryByTestId('conteudo')).toBeNull();
    expect(mockGetChamado).toHaveBeenCalledWith('/caixa/verificar');
  });

  test('M02-07 · o primeiro quadro obedece ao localStorage: "caixa=true" guardado mostra o sistema antes de a API responder', async () => {
    localStorage.setItem('user', usuario('monitor'));
    localStorage.setItem('caixa', 'true'); // valor editável pelo próprio navegador

    render(<Embrulhado />);

    expect(screen.getByTestId('conteudo')).toBeTruthy();
    // A API só é consultada depois; até a resposta chegar, a tela está liberada.

    await drenar(); // deixa a resposta da API chegar antes de encerrar
  });

  test('M02-07 · quando a API responde que não há caixa, a tela fecha — mas só então', async () => {
    localStorage.setItem('user', usuario('monitor'));
    localStorage.setItem('caixa', 'true');

    render(<Embrulhado />);
    expect(screen.getByTestId('conteudo')).toBeTruthy();

    await drenar(); // a promessa da API resolve aqui

    expect(screen.queryByTestId('conteudo')).toBeNull();
    expect(localStorage.getItem('caixa')).toBe('false');
  });

  test('a regra só vale para monitor: cliente passa direto mesmo com caixa=false', async () => {
    localStorage.setItem('user', usuario('cliente'));
    localStorage.setItem('caixa', 'false');

    render(<Embrulhado />);
    await drenar();

    expect(screen.getByTestId('conteudo')).toBeTruthy();
    // O perfil vem de localStorage.user — a mesma origem que o header enviado
    // à API (ver M01-14): trocar o perfil guardado contorna a regra dos dois lados.
  });

  test('sem usuário guardado, o invólucro grava caixa=false e deixa passar', async () => {
    render(<Embrulhado />);
    await drenar();

    expect(localStorage.getItem('caixa')).toBe('false');
    expect(screen.getByTestId('conteudo')).toBeTruthy();
    expect(mockGetChamado).not.toHaveBeenCalled();
  });
});

/*
 * QUANDO CORRIGIR
 *   - O perfil vem do token (M01-06/16), não de localStorage.
 *   - Enquanto a API não responde, mostrar carregando — não adivinhar pelo
 *     valor guardado.
 *   - O socket é criado dentro de um efeito, com desconexão na limpeza.
 */
