# PIX para todos — Portfólio de IHC

Portfólio acadêmico da disciplina de Introdução à Interação Humano-Computador (UFF · 2026.2).

**Tema:** a dificuldade de idosos não familiarizados com tecnologia em realizar
transferências bancárias via PIX.

## Como abrir

Basta abrir o arquivo `index.html` no navegador. Não há dependências, build ou banco de dados.
O site tem uma página por etapa, ligadas pelo menu lateral (o fio condutor).

## Arquivos

```
index.html               → capa e o caminho do projeto (atalho para cada etapa)
projeto.html             → O Projeto: contexto, problema, público-alvo e objetivo
problema.html … conclusoes.html → uma página por etapa (tabela abaixo)
entrevistas.html         → entrevistas em documento e TCLE (dentro da etapa 05)
respostas.html           → tabela com as respostas do questionário (dentro da etapa 06)
personas.html            → as quatro personas (dentro da etapa 07)
cenarios.html            → os três cenários-problema, ligados às personas (dentro da etapa 07)
modelo-de-tarefas.html   → árvore de tarefas (HTA) e tempos pelo KLM (dentro da etapa 07)
equipe.html              → integrantes do grupo
uso-de-ia.html           → relatório de uso de IA e os prompts na página (inclui o do Figma Make)
css/styles.css           → estilos, organizado em blocos numerados
js/main.js               → tema, menu lateral, animações e leitor de PDF
img/                     → imagens (fotos, gráficos, capas dos PDFs em img/capas/ e personas em img/personas/)
docs/                    → PDFs lidos no site (planejamentos, relatórios) e a planilha
```

## Modo claro e escuro

O site tem os dois temas. O botão fica no canto superior direito e a escolha é
salva no navegador (`localStorage`). Na primeira visita, o site segue a preferência
do sistema operacional da pessoa.

As cores dos dois temas ficam no topo do `css/styles.css`:

- bloco `:root` → tema claro
- bloco `:root[data-tema="escuro"]` → tema escuro

Para mudar qualquer cor do site, basta editar essas variáveis — nenhum outro
trecho do CSS precisa ser alterado.

## Como preencher o conteúdo

Todo texto provisório está marcado com `[A PREENCHER]` e a classe `placeholder`
(aparece em cinza, com uma barra à esquerda). Para publicar um conteúdo real,
substitua o texto e remova a classe `placeholder`.

### Como o site está organizado

Cada parte do trabalho tem a sua página. Todas seguem o mesmo molde:

- **Fio condutor** (`<nav class="trilha">`): o menu lateral com todas as páginas.
  As etapas ficam ligadas por uma linha que se preenche até a etapa aberta. O
  número em `data-etapa` diz até onde a linha vai (0 antes da etapa 01, 11
  depois da etapa 10).
  - No computador o menu fica escondido. Na borda esquerda fica só uma linha
    (`<button class="puxador">`): com o mouse em cima o menu aparece, e um
    clique na linha deixa ele fixo na tela (outro clique recolhe). A escolha
    fica salva no navegador.
  - No celular o menu abre pelo botão do cabeçalho.
- **Cabeçalho da página** (`<header class="pagina__cabecalho">`): caminho
  (Início / fase / etapa), número da etapa, título e texto de abertura. Páginas
  longas têm atalhos ("Nesta página") para as partes da página.
- **Conteúdo** (`<div class="pagina__corpo">`).
- **Anterior / Próxima** (`<nav class="paginacao">`): leva para a página vizinha
  na ordem do fio condutor.

O fio condutor é igual em todas as páginas. Se mudar o nome de uma etapa, mude
nas outras páginas também (o item da página atual leva `aria-current="page"`).

### Preencher uma etapa

As etapas 07 a 10 ainda só têm o texto provisório. Para publicar, abra a página
da etapa (por exemplo `ideacao.html`) e troque o `<p class="placeholder">`
pelo conteúdo, dentro do `<div class="pagina__corpo">`. Os blocos usados nas
outras etapas (`analise__grupo`, `arquivo`, `foto` etc.) funcionam em qualquer
página.

### Animações

Os blocos entram subindo quando aparecem na tela, a linha do fio condutor avança
de uma etapa para a outra e a troca entre páginas é suave nos navegadores que
suportam. Quem pediu menos movimento no sistema vê o site sem animações.

### Adicionar uma imagem a uma etapa

Coloque o arquivo em `img/` e use a classe `foto`:

```html
<figure class="foto">
  <img src="img/mapa-empatia.jpg" alt="Descreva a imagem aqui" loading="lazy">
  <figcaption>Legenda da imagem.</figcaption>
</figure>
```

### Adicionar um PDF para ler no site

Os PDFs não são baixados: abrem no modo de leitura do próprio site (uma janela
por cima da página, com zoom e contador de páginas). Coloque o PDF em `docs/`,
salve a primeira página como imagem em `img/capas/` e use o cartão `documento`:

```html
<a class="documento" href="docs/nome-do-arquivo.pdf" data-leitor>
  <span class="documento__capa"><img src="img/capas/nome-do-arquivo.jpg" alt="" width="360" height="510" loading="lazy"></span>
  <span class="documento__texto">
    <strong class="documento__titulo">Título do documento</strong>
    <small class="documento__meta">PDF &middot; 5 páginas</small>
    <span class="documento__acao">Ler aqui</span>
  </span>
</a>
```

Sem a imagem de capa (apague o `<img>`), o cartão mostra uma folha em branco.
O leitor usa o PDF.js, carregado do cdnjs só quando alguém abre um documento.

### Vídeos das entrevistas

Os vídeos foram tirados do site. O código que toca um vídeo numa tela da página
(`data-videoteca` no `main.js` e os estilos `.video` e `.videoteca` no CSS)
continua no projeto, caso queiram voltar com eles.

### Personas

`personas.html` tem os cartões das quatro personas, a ligação entre elas e as
fichas completas em abas (uma ficha por vez; sem JavaScript aparecem todas em
sequência). Cada ficha é um `<article class="ficha-persona persona--primaria">`
com `id="ficha-nome"`, `data-aba` (nome na aba) e `data-papel` (rótulo da aba).
A cor vem da classe `persona--primaria`, `--secundaria`, `--stakeholder` ou
`--antiusuario`. As ilustrações ficam em `img/personas/`. O texto é o mesmo dos
PDFs de persona; para mudar, edite a ficha e o cartão correspondente.

### Figma e prompts de IA

O botão "Acesso ao Figma" da capa (`index.html`, dentro de `.hero__acoes`) e o
botão da etapa 7 em `uso-de-ia.html` apontam para o protótipo no Figma Make.
Para trocar o link, edite o `href` dos dois.

Em `uso-de-ia.html`, cada prompt é um `<li class="prompt">` dentro de uma
`<section class="prompt-etapa">`. O PDF do relatório continua com os 19
primeiros prompts; do 20º ao 27º (Figma Make, personas, cenários e tarefas) estão só na página. Se o PDF for refeito,
atualize o texto do card.

### Cenários

`cenarios.html` mostra os três cenários-problema. Cada cenário é um
`<article class="cenario" id="cenario-1" data-aba="Cenário 1">` dentro de
`<div class="fichas" data-abas="cenarios">`; o `main.js` monta as abas a partir
do `<div class="aba-modelo" hidden>` que fica no começo de cada cenário (sem
JavaScript os três aparecem em sequência).

Dentro de cada cenário:

- `.faixa`: uma barra com um traço por momento, colorida pelo estado;
- `.momentos`: a história em linha do tempo. Cada `<li class="momento momento--plano">`
  (ou `--duvida`, `--quebra`) é um momento; o último, `momento--fim`, diz onde a
  pessoa termina;
- `.problemas`: cada ponto problemático ao lado do que a ficha da persona já
  pedia, com link para a ficha (o texto entre aspas tem que existir em `personas.html`);
- `<details class="cenario__questoes">`: as questões exploratórias e de verificação.

O quadro "O que se repete" (`.padroes`) cruza os cenários. Os rostos pequenos
(`.avatar--marlene`, `--sergio`, `--camila`) são recortes das fotos em `img/personas/`.
Nas fichas de `personas.html`, o bloco `.fp__cenarios` leva de volta ao cenário.
O conteúdo vem do arquivo de cenários do grupo (não publicado no site).

### Modelo de tarefas

`modelo-de-tarefas.html` tem a árvore de tarefas (`.hta`) com quatro tarefas, cada
uma com subtarefas (`.hta__no--2`) e ações (`.hta__no--3`). Os planos ficam em
`<details class="hta__planos">`, o Plano 0 junto da raiz e os demais dentro de cada
tarefa. As barras de tempo (`.tempo`) usam `--w` (porcentagem do maior tempo, 61,2 s)
e as tabelas do KLM são `.klm`; as linhas fora da tela levam a classe `klm__fora`.
Os números (23,30 s e 61,20 s) são somas das linhas das tabelas; se mudar uma linha,
refaça o total, a barra e a síntese comparativa.

### Adicionar um link simples a uma lista

Para um item que não é PDF nem vídeo, use o `doc` dentro de `<ul class="lista-docs">`:

```html
<li>
  <a class="doc" href="LINK" target="_blank" rel="noopener">
    <span class="doc__codigo">P01</span>
    <span class="doc__nome">Nome do material</span>
    <span class="doc__meta">YouTube</span>
  </a>
</li>
```

Quando a lista ganhar o primeiro item, apague o `<p class="placeholder">` da seção.

### Ligar uma certeza da Matriz CSD a uma referência

Cada certeza tem uma etiqueta com o nome da fonte que aponta para a lista de
referências no fim da etapa:

```html
<a class="csd__fonte" href="#ref-csd-1" aria-label="Ver a referência 1: Portal Unit">…</a>
```

O número no `href` é o `id` do item da lista (`<li id="ref-csd-1">`). Para usar
uma nova fonte, basta acrescentar o item na lista com o próximo `id`.

### Adicionar uma nova página

Copie uma página parecida (por exemplo `ideacao.html`), troque o título, o
cabeçalho e o conteúdo, e acrescente o link dela no fio condutor de todas as
páginas. Ajuste também os links de Anterior / Próxima das páginas vizinhas.

### Crazy 4

`crazy4.html` mostra as ideias de duas folhas do Crazy 4, agrupadas pela regra (cara, barata e rápida,
jogos, robôs). Cada ideia é um `<li class="ideia ideia--segue|ressalva|custo|nao" data-veredito="...">` com o
comentário de um colega; os botões `.filtro__botao` (main.js, bloco 9) destacam as ideias de mesmo resultado.
As fotos das folhas não estão no site, porque têm nomes escritos; só o texto foi transcrito.

## Etapas do processo

| # | Fase | Etapa | Página |
|---|------|-------|--------|
| 01 | Imersão | Definição do problema e How Might We | `problema.html` |
| 02 | Imersão | Matriz CSD | `matriz-csd.html` |
| 03 | Imersão | Mapa de Empatia | `mapa-de-empatia.html` |
| 04 | Imersão | Análise Competitiva | `analise-competitiva.html` |
| 05 | Imersão | Pesquisa com usuários | `pesquisa.html` |
| 06 | Imersão | Análise dos resultados | `resultados.html` |
| 07 | Ideação e prototipação | Ideação | `ideacao.html` |
| 08 | Ideação e prototipação | Solução / Protótipo | `prototipo.html` |
| 09 | Avaliação | Avaliação | `avaliacao.html` |
| 10 | Avaliação | Conclusões | `conclusoes.html` |

Links antigos como `index.html#processo` ou `index.html#equipe` continuam
funcionando: a capa redireciona para a página nova.

## Publicação

O site é publicado pelo GitHub Pages a partir da branch `main` (pasta raiz):
https://uff-arthurmta.github.io/PortofolioIHC/

Todo push para `main` republica o site automaticamente em cerca de um minuto.

O CSS e o JS são chamados com `?v=N` em todas as páginas. Sempre que mudar um
desses arquivos, aumente o número em todas elas — assim o navegador não mostra a
versão antiga guardada em cache.
