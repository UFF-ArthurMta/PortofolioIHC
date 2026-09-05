# PIX para todos — Portfólio de IHC

Portfólio acadêmico da disciplina de Introdução à Interação Humano-Computador (UFF · 2026.2).

**Tema:** a dificuldade de idosos não familiarizados com tecnologia em realizar
transferências bancárias via PIX.

## Como abrir

Basta abrir o arquivo `index.html` no navegador. Não há dependências, build ou banco de dados.

## Arquivos

```
index.html      → todo o conteúdo do site (seções comentadas)
css/styles.css  → estilos, organizado em blocos numerados
js/main.js      → tema claro/escuro, menu do celular e link ativo
img/            → coloque aqui imagens (matriz CSD, protótipos, fotos)
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

### Marcar uma etapa como concluída

No `index.html`, dentro da etapa, troque:

```html
<span class="etapa__status">Em breve</span>
```

por:

```html
<span class="etapa__status etapa__status--feito">Concluído</span>
```

### Adicionar uma imagem a uma etapa

```html
<img src="img/matriz-csd.png" alt="Matriz CSD do projeto" style="max-width:100%;border-radius:12px;margin-top:16px;">
```

### Preencher a ficha da capa

Na capa há uma ficha com Curso, Período, Docente e Etapas (`<dl class="ficha">`).
O nome da docente está como `[A preencher]` — ao substituir, remova a classe
`placeholder placeholder--inline`.

### Adicionar uma nova seção

Copie o bloco de uma seção existente no `index.html`, troque o `id`, e adicione
o link correspondente no menu (`<nav class="nav">`). O destaque automático do
menu funciona sozinho a partir daí.

## Etapas do processo

| # | Etapa | Status |
|---|-------|--------|
| 01 | Definição do problema e How Might We | Concluído |
| 02 | Matriz CSD | Concluído |
| 03 | Mapa de Empatia | Concluído |
| 04 | Desk Research | Em breve |
| 05 | Pesquisa com usuários | Em breve |
| 06 | Análise dos resultados | Em breve |
| 07 | Ideação | Em breve |
| 08 | Solução / Protótipo | Em breve |
| 09 | Avaliação | Em breve |
| 10 | Conclusões | Em breve |

## Publicação

O site é publicado pelo GitHub Pages a partir da branch `main` (pasta raiz):
https://uff-arthurmta.github.io/PortofolioIHC/

Todo push para `main` republica o site automaticamente em cerca de um minuto.
