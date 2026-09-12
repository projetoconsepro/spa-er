# Testes de caracterização — spa-er

> Um teste de caracterização descreve o que o código **faz hoje** — inclusive o
> defeito. Ele **passa** contra o código atual. Quando o defeito for corrigido,
> ele falha; aí troca-se a asserção e ele vira o teste de correção.

Mesma regra e mesmo formato dos testes da `api-er`
(`api-er/tests/caracterizacao/README.md`). O que muda é a ferramenta.

## Rodar

```bash
npm run test:caracterizacao
```

**Nenhuma dependência nova.** Usa o `react-scripts test` (Jest + jsdom) e o
`@testing-library/react` que já estavam no `package.json`, e o `cross-env` que
já era usado nos outros scripts.

Para rodar um arquivo só:

```bash
npm run test:caracterizacao -- --testPathPattern=M02-mapa
```

## Onde ficam

`src/testes-caracterizacao/<módulo>/` — uma pasta por módulo. Precisa ficar
dentro de `src/` porque é onde o Jest do CRA procura. Arquivos `*.test.js` não
entram no pacote de produção.

Nome: `M02-navegacao-por-localstorage.test.js` — módulo, e o achado em
kebab-case. O cabeçalho aponta o ID do achado, o arquivo e a linha, os padrões
transversais e a seção do plano.

## Três formas de teste, nesta ordem de preferência

**1. Chamar a função real** (`M02-navegacao-por-localstorage`). Quando o módulo
não tem dependência pesada, importe e chame. `localStorage` já existe no jsdom.

**2. Renderizar o componente real, substituindo os filhos**
(`M02-homepage-render-e-polling`, `M02-caixa-verificacao`). O alvo é sempre o de
verdade; o que se substitui são os filhos que arrastariam meio sistema:

```js
jest.mock('../../components/Sidebar', () => () => <div data-testid="sidebar" />);
jest.mock('socket.io-client', () => ({ __esModule: true, default: () => ({ emit(){}, on(){}, off(){} }) }));
```

Duas armadilhas do Jest do CRA:

- variáveis usadas dentro de uma fábrica de `jest.mock` **precisam começar com
  `mock`** — o resto dá `ReferenceError` na hora de compilar;
- a configuração do CRA liga `resetMocks`. Um `jest.fn()` que registrou algo no
  **carregamento do módulo** chega zerado ao primeiro teste. Para afirmar sobre
  o carregamento, use um contador comum (`const mockRegistro = { n: 0 }`).

Componentes que mudam estado depois de uma promessa precisam de
`await act(async () => {})` no fim do teste, senão o React reclama.

**3. Ler o código-fonte** (`M02-mapa-de-telas`). Só quando a afirmação é sobre a
**relação entre arquivos** — "todo destino de navegação existe no mapa de
telas" — e importar o alvo traria as 68 telas junto. É a verificação cruzada da
auditoria, automatizada. Diga no cabeçalho por que não deu para importar.

## Regras

1. **Nunca mockar o alvo.** Se ele for difícil de montar, isso é achado
   (acoplamento) e vai para o relatório do módulo.
2. **Um cenário por `test()`**, com o ID do achado no nome.
3. **A mensagem do teste explica o defeito**, não a asserção.
4. **Bloco `QUANDO CORRIGIR`** no fim do arquivo, com o que passa a valer.
