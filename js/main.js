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

  /* --- 3. Destaque do link da seção visível ---------------- */
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
