/**
 * TESTE DE CARACTERIZAÇÃO — M02-01, M02-02
 *
 * Achado:   toda a navegação do sistema é uma chave de localStorage
 *           (`componente`), e o histórico tem exatamente UM nível
 *           (`componenteAnterior`). O botão "Voltar" troca as duas chaves de
 *           lugar: clicar duas vezes leva de volta para a frente.
 * Onde:     src/util/FuncTrocaComp.jsx (5 linhas, 40 chamadores)
 *           src/util/VoltarComponente.jsx:9-22
 * Padrões:  P17 (estado global), P06
 * Plano:    PLANO_REFATORACAO.md §2.5
 *
 *   Usa os módulos REAIS. Este teste PASSA contra o código atual.
 */

import FuncTrocaComp from '../../util/FuncTrocaComp';

describe('M02 · navegação por localStorage', () => {
  beforeEach(() => localStorage.clear());

  test('M02-01 · FuncTrocaComp guarda só um nível de histórico', () => {
    FuncTrocaComp('LoginPage');
    FuncTrocaComp('Dashboard');
    FuncTrocaComp('UsuariosAdmin');
    FuncTrocaComp('ConfigurarPerfil');

    expect(localStorage.getItem('componente')).toBe('ConfigurarPerfil');
    expect(localStorage.getItem('componenteAnterior')).toBe('UsuariosAdmin');
    // LoginPage e Dashboard sumiram: não há pilha, só a tela anterior.
  });

  test('M02-01 · a primeira navegação grava a string "null" como tela anterior', () => {
    FuncTrocaComp('LoginPage');

    expect(localStorage.getItem('componenteAnterior')).toBe('null');
    // getItem devolve null, setItem converte para a STRING "null" — o que o
    // Voltar depois tenta usar como nome de tela (cai em <Error />).
  });

  test('M02-02 · "Voltar" troca as duas chaves: clicar duas vezes volta para a frente', () => {
    // A→B→C
    FuncTrocaComp('MeusVeiculos');
    FuncTrocaComp('HistoricoVeiculo');
    FuncTrocaComp('ConfigurarPerfil');
    expect(localStorage.getItem('componente')).toBe('ConfigurarPerfil');

    // O que VoltarComponente.voltar() faz (util/VoltarComponente.jsx:16-22),
    // com os valores lidos na montagem:
    const voltar = () => {
      const atual = localStorage.getItem('componente');
      const anterior = localStorage.getItem('componenteAnterior');
      if (anterior === 'EscolherPerfil') return;
      localStorage.setItem('componenteAnterior', atual);
      localStorage.setItem('componente', anterior);
    };

    voltar();
    expect(localStorage.getItem('componente')).toBe('HistoricoVeiculo');

    voltar();
    expect(localStorage.getItem('componente')).toBe('ConfigurarPerfil');
    // Segundo "Voltar" avança. Não existe caminho de volta para MeusVeiculos.
  });

  test('M02-02 · o Voltar lê os valores só na montagem — navegar por outro caminho deixa o botão obsoleto', () => {
    FuncTrocaComp('MeusVeiculos');
    FuncTrocaComp('HistoricoVeiculo');

    // VoltarComponente monta aqui e congela os dois valores (useEffect com []):
    const congeladoAtual = localStorage.getItem('componente');        // HistoricoVeiculo
    const congeladoAnterior = localStorage.getItem('componenteAnterior'); // MeusVeiculos

    // enquanto ele está montado, o menu lateral navega para outro lugar:
    FuncTrocaComp('Dashboard');

    // o clique no Voltar usa os valores congelados:
    localStorage.setItem('componenteAnterior', congeladoAtual);
    localStorage.setItem('componente', congeladoAnterior);

    expect(localStorage.getItem('componente')).toBe('MeusVeiculos');
    // O usuário estava no Dashboard e o Voltar o mandou para MeusVeiculos,
    // que não é a tela de onde ele veio.
  });
});

/*
 * QUANDO CORRIGIR
 *   - Rota de verdade por tela (react-router): o histórico passa a ser o do
 *     navegador, o botão físico "voltar" do celular passa a funcionar, e o
 *     Voltar da tela vira navigate(-1).
 *   - Enquanto a migração não acontece: pilha em vez de uma chave só, e o
 *     Voltar lendo o valor no clique, não na montagem.
 */
