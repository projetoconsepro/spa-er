/**
 * TESTE DE CARACTERIZAÇÃO — M02-08, M02-09, M02-10
 *
 * Achado:   `Componentes.jsx` é um mapa de 68 telas, todas importadas e
 *           instanciadas no carregamento do módulo. Quem navega para um nome
 *           que não está no mapa cai em <Error />, sem aviso em lugar nenhum —
 *           e existe um botão em produção que faz exatamente isso.
 * Onde:     src/pages/HomePage/Componentes.jsx (69 imports, 68 entradas)
 *           src/components/ConfigurarPerfil.jsx:355 → "VeiculosAgente"
 * Padrões:  P13 (código morto), P17
 * Plano:    PLANO_REFATORACAO.md §2.5, §2.7
 *
 * POR QUE ESTE TESTE LÊ O CÓDIGO-FONTE
 *   Importar `Componentes.jsx` arrastaria as 68 telas — mapas, câmera, gráficos,
 *   impressão — e o teste passaria a depender de todas elas. O que se quer
 *   afirmar aqui é a RELAÇÃO entre três listas (menu, mapa, alvos de
 *   navegação), e essa relação está no texto dos arquivos. É a mesma
 *   verificação cruzada que a auditoria fez à mão, agora automática.
 *
 *   Este teste PASSA contra o código atual.
 */

const fs = require('fs');
const path = require('path');

const SRC = path.resolve(__dirname, '../../..', 'src');
const ler = (p) => fs.readFileSync(path.join(SRC, p), 'utf8');

const fonteComponentes = ler('pages/HomePage/Componentes.jsx');
const fonteSidebar = ler('components/Sidebar.jsx');

const chavesDoMapa = new Set(
  [...fonteComponentes.matchAll(/^\s+([A-Za-z_]+):\s*</gm)].map((m) => m[1]),
);
const itensDeMenu = new Set(
  [...fonteSidebar.matchAll(/componente:\s*"([^"]+)"/g)].map((m) => m[1]),
);

function todosOsArquivos(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return todosOsArquivos(p);
    return /\.(js|jsx|ts|tsx)$/.test(e.name) ? [p] : [];
  });
}
const alvosDeNavegacao = new Set();
todosOsArquivos(SRC).forEach((f) => {
  const t = fs.readFileSync(f, 'utf8');
  [...t.matchAll(/FuncTrocaComp\(\s*["']([^"']+)["']/g)].forEach((m) => alvosDeNavegacao.add(m[1]));
  [...t.matchAll(/setItem\(\s*["']componente["']\s*,\s*["']([^"']+)["']/g)].forEach((m) => alvosDeNavegacao.add(m[1]));
});

describe('M02 · mapa de telas', () => {
  test('M02-08 · o mapa tem 68 entradas e importa as 68 telas de uma vez', () => {
    expect(chavesDoMapa.size).toBe(68);
    expect((fonteComponentes.match(/^import /gm) || []).length).toBe(69);
    expect(fonteComponentes).not.toMatch(/React\.lazy|import\(/);
    // Sem divisão de código: o cliente baixa as telas de admin e a monitora
    // baixa as do parceiro, toda vez.
  });

  test('M02-09 · "VeiculosAgente" é destino de um botão em produção e NÃO existe no mapa', () => {
    expect(alvosDeNavegacao.has('VeiculosAgente')).toBe(true);
    expect(chavesDoMapa.has('VeiculosAgente')).toBe(false);

    const origem = ler('components/ConfigurarPerfil.jsx');
    expect(origem).toMatch(/FuncTrocaComp\("VeiculosAgente"\)/);
    // Botão "Voltar aos veículos", visível só para o perfil agente
    // (ConfigurarPerfil.jsx:355). Leva à tela de erro desde 01/06/2023.
  });

  test('M02-09 · fora esse, todo destino de navegação existe no mapa', () => {
    const semDestino = [...alvosDeNavegacao].filter((a) => !chavesDoMapa.has(a));
    expect(semDestino).toEqual(['VeiculosAgente']);
  });

  test('M02-10 · três itens de menu não são telas: são ações no aplicativo nativo', () => {
    const semTela = [...itensDeMenu].filter((i) => !chavesDoMapa.has(i)).sort();
    expect(semTela).toEqual(['ConectarImpressora', 'ConfigurarImpressora', 'linkWhatsapp']);
    // NÃO são menus quebrados: os dois primeiros chamam ConfigImpressora
    // (postMessage para o APK) e o terceiro abre o WhatsApp em outra aba
    // (Sidebar.jsx:78-92). Remover qualquer um deles tira função de campo.
  });

  test('M02-10 · quatro telas do mapa não têm caminho: nem menu, nem navegação', () => {
    const inalcancaveis = [...chavesDoMapa]
      .filter((c) => !itensDeMenu.has(c) && !alvosDeNavegacao.has(c))
      .sort();
    expect(inalcancaveis).toEqual(['Error', 'MapaCliente', 'MensagemCaixa', 'VeiculosAdmin']);
    // Error e MensagemCaixa são renderizados diretamente por outro código —
    // a entrada no mapa é que é morta. MapaCliente e VeiculosAdmin não têm
    // nenhum caminho: são telas inteiras que ninguém alcança.
  });


  test('M02-11 · cinco conexões WebSocket são abertas no arranque, em módulos que o mapa importa', () => {
    const comSocketNoModulo = todosOsArquivos(SRC)
      .filter((f) => !f.includes('testes-caracterizacao'))
      .filter((f) => /^\s*(const|let|var)\s+socket\s*=\s*io\(/m.test(fs.readFileSync(f, 'utf8')))
      .map((f) => path.relative(SRC, f).split(path.sep).join('/'))
      .sort();

    expect(comSocketNoModulo).toEqual([
      'components/MapaAdmin.jsx',
      'components/MapaCliente.jsx',
      'components/VagaMonitor.jsx',
      'pages/HomePage/HomePage.jsx',
      'util/CaixaVerificacao.js',
    ]);
    // Estão no escopo do módulo, e os cinco módulos entram no pacote pelo
    // mapa de telas. Um cliente abre o socket do mapa do administrador;
    // uma monitora abre o do cliente. Nenhum é fechado.
  });

  test('M02-08 · o pacote inclui praticamente todo o código-fonte: 122 dos 123 arquivos', () => {
    // Alcance a partir de src/index.js, seguindo imports relativos.
    const resolver = (base, rel) => {
      const p = path.resolve(path.dirname(base), rel);
      const exts = ['', '.js', '.jsx', '.ts', '.tsx', '/index.js', '/index.jsx'];
      return exts.map((e) => p + e).find((c) => fs.existsSync(c) && fs.statSync(c).isFile());
    };
    const vistos = new Set();
    const fila = [path.join(SRC, 'index.js')];
    while (fila.length) {
      const f = fila.pop();
      if (!f || vistos.has(f)) continue;
      vistos.add(f);
      const t = fs.readFileSync(f, 'utf8');
      [...t.matchAll(/from\s+["'](\.[^"']+)["']/g)].forEach((m) => {
        const d = resolver(f, m[1]);
        if (d) fila.push(d);
      });
    }
    const fonte = todosOsArquivos(SRC).filter((f) => !f.includes('testes-caracterizacao'));
    const mortos = fonte.filter((f) => !vistos.has(f)).map((f) => path.relative(SRC, f).split(path.sep).join('/'));

    expect(fonte.length).toBe(123);
    expect(fonte.length - mortos.length).toBe(122);
    expect(mortos).toEqual(['util/Paginacao.jsx']);
    // Um único pacote: todo perfil baixa as telas de todos os outros.
  });

  test('M02-08 · o mapa guarda ELEMENTOS prontos, não componentes — nenhuma tela recebe props', () => {
    expect(fonteComponentes).toMatch(/MeusVeiculos:\s*<ListarVeiculos \/>/);
    expect(fonteComponentes).not.toMatch(/:\s*ListarVeiculos,/);
    // Consequência aproveitada sem querer: como os elementos são os mesmos
    // objetos a cada render, o React descarta a re-renderização da tela ativa
    // nas 2 renderizações por segundo do laço da HomePage (M02-05).
    // Trocar para `<Componente />` sem tirar o laço faz TODA tela re-renderizar
    // duas vezes por segundo.
  });
});

/*
 * QUANDO CORRIGIR
 *   - React.lazy por tela, agrupado por perfil: a monitora não baixa admin.
 *   - Mapa de componentes (não de elementos), para permitir props e rota.
 *   - Destino inexistente deve falhar no build (lista fechada), não em runtime.
 *   - A entrada `VeiculosAgente` precisa existir OU o botão apontar para
 *     `ListarNotificacoesVaga`, que é a tela inicial do agente.
 */
