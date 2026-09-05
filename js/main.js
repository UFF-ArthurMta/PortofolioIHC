/* ============================================================
   PIX para todos — scripts do site
   Três funções: tema claro/escuro, menu mobile e link ativo.
   ============================================================ */

(function () {
  'use strict';

  /* --- 1. Modo claro / escuro ------------------------------
     O tema inicial já é aplicado pelo script no <head>.
     Aqui apenas montamos o botão que alterna e salva a escolha.
     -------------------------------------------------------- */
  var temaBotao = document.getElementById('tema-toggle');

  // Ícones desenhados em SVG (sem emojis)
  var ICONE_SOL = '<svg viewBox="0 0 24 24" aria-hidden="true">' +
    '<circle cx="12" cy="12" r="4.2"></circle>' +
    '<path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2' +
    'M5.2 5.2l1.4 1.4M17.4 17.4l1.4 1.4M18.8 5.2l-1.4 1.4M6.6 17.4l-1.4 1.4"></path></svg>';

  var ICONE_LUA = '<svg viewBox="0 0 24 24" aria-hidden="true">' +
    '<path d="M20 14.2A8.2 8.2 0 0 1 9.8 4a8.4 8.4 0 1 0 10.2 10.2z"></path></svg>';

  function aplicarTema(tema) {
    document.documentElement.setAttribute('data-tema', tema);

    if (!temaBotao) return;
    var escuro = tema === 'escuro';
    temaBotao.querySelector('.tema-toggle__icone').innerHTML = escuro ? ICONE_SOL : ICONE_LUA;
    temaBotao.querySelector('.tema-toggle__texto').textContent = escuro ? 'Claro' : 'Escuro';
    temaBotao.setAttribute('aria-label', escuro ? 'Ativar modo claro' : 'Ativar modo escuro');
  }

  aplicarTema(document.documentElement.getAttribute('data-tema') || 'claro');

  if (temaBotao) {
    temaBotao.addEventListener('click', function () {
      var novo = document.documentElement.getAttribute('data-tema') === 'escuro'
        ? 'claro' : 'escuro';
      aplicarTema(novo);
      try { localStorage.setItem('tema', novo); } catch (e) {}
    });
  }

  /* --- 2. Menu no celular ---------------------------------- */
  var botao = document.getElementById('menu-toggle');
  var menu = document.getElementById('menu');

  if (botao && menu) {
    botao.addEventListener('click', function () {
      var aberto = menu.classList.toggle('aberto');
      botao.setAttribute('aria-expanded', String(aberto));
      botao.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
    });

    // Fecha o menu ao clicar em um link
    menu.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        menu.classList.remove('aberto');
        botao.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* --- 3. Abrir e fechar as etapas do processo -------------
     O botão é criado aqui, e não no HTML: assim basta adicionar
     um novo <li class="etapa"> que ele ja vem com o botao.
     Etapas concluidas comecam abertas; as "Em breve", fechadas.
     -------------------------------------------------------- */
  var CHEVRON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9.5l6 6 6-6"></path></svg>';

  document.querySelectorAll('.etapa').forEach(function (etapa, i) {
    var corpo = etapa.querySelector('.etapa__corpo');
    var topo = etapa.querySelector('.etapa__topo');
    if (!corpo || !topo) return;

    // Junta tudo o que vem depois do titulo em um bloco recolhivel
    var conteudo = document.createElement('div');
    conteudo.className = 'etapa__conteudo';
    conteudo.id = 'etapa-conteudo-' + (i + 1);
    while (topo.nextSibling) conteudo.appendChild(topo.nextSibling);
    if (!conteudo.children.length) return;
    corpo.appendChild(conteudo);

    var titulo = topo.querySelector('.etapa__titulo');
    var nome = titulo ? titulo.textContent.trim() : 'etapa';
    var concluida = !!topo.querySelector('.etapa__status--feito');

    var botao = document.createElement('button');
    botao.className = 'etapa__toggle';
    botao.innerHTML = CHEVRON;
    botao.setAttribute('aria-controls', conteudo.id);
    topo.appendChild(botao);

    function aplicar(aberto) {
      conteudo.hidden = !aberto;
      etapa.classList.toggle('etapa--aberta', aberto);
      botao.setAttribute('aria-expanded', String(aberto));
      botao.setAttribute('aria-label', (aberto ? 'Fechar' : 'Abrir') + ' a etapa ' + nome);
    }

    aplicar(concluida);
    botao.addEventListener('click', function () {
      aplicar(conteudo.hidden);
    });
  });

  /* --- 4. Destaque do link da seção visível ---------------- */
  var links = document.querySelectorAll('.nav__lista a');
  var secoes = [];

  links.forEach(function (link) {
    var alvo = document.querySelector(link.getAttribute('href'));
    if (alvo) secoes.push({ link: link, alvo: alvo });
  });

  if ('IntersectionObserver' in window && secoes.length) {
    var observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) return;
        links.forEach(function (l) { l.classList.remove('ativo'); });
        var atual = secoes.find(function (s) { return s.alvo === entrada.target; });
        if (atual) atual.link.classList.add('ativo');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    secoes.forEach(function (s) { observador.observe(s.alvo); });
  }

})();
