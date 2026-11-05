/* ============================================================
   PIX para todos — scripts do site
   Tema claro/escuro, fio condutor (menu lateral), barra de
   leitura e animação dos blocos ao rolar a página.
   ============================================================ */

(function () {
  'use strict';

  var poucoMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // A troca animada entre páginas é pulada quando a pessoa navega rápido;
  // isso não é erro, então não precisa aparecer no console.
  window.addEventListener('pagereveal', function (e) {
    if (e.viewTransition) e.viewTransition.ready.catch(function () {});
  });

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

  /* --- 2. Fio condutor no celular --------------------------
     Em telas estreitas o menu lateral vira uma gaveta que abre
     pelo botão do cabeçalho. Fecha com Esc, ao clicar fora ou
     ao escolher uma página.
     -------------------------------------------------------- */
  var botaoMenu = document.getElementById('menu-toggle');
  var trilha = document.getElementById('trilha');

  function abrirMenu(aberto) {
    trilha.classList.toggle('aberta', aberto);
    document.body.classList.toggle('menu-aberto', aberto);
    botaoMenu.setAttribute('aria-expanded', String(aberto));
    botaoMenu.setAttribute('aria-label', aberto ? 'Fechar o menu' : 'Abrir o menu');
  }

  if (botaoMenu && trilha) {
    botaoMenu.addEventListener('click', function () {
      abrirMenu(!trilha.classList.contains('aberta'));
    });

    document.addEventListener('click', function (e) {
      if (!trilha.classList.contains('aberta')) return;
      var dentro = trilha.contains(e.target);
      if ((dentro && e.target.closest('a')) || (!dentro && !botaoMenu.contains(e.target))) {
        abrirMenu(false);
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && trilha.classList.contains('aberta')) {
        abrirMenu(false);
        botaoMenu.focus();
      }
    });
  }

  /* --- 3. Linha do fio condutor ----------------------------
     A linha entre as etapas fica colorida até a etapa atual
     (data-etapa no <nav class="trilha">). Ela parte de onde
     estava na página anterior, então parece avançar.
     -------------------------------------------------------- */
  var processo = document.querySelector('.trilha__processo');
  var fio = processo && processo.querySelector('.trilha__fio');

  if (trilha && fio) {
    var nos = processo.querySelectorAll('.trilha__no');
    var etapa = parseInt(trilha.getAttribute('data-etapa'), 10) || 0;

    var medirFio = function (animar) {
      if (!nos.length) return;
      var topo = processo.getBoundingClientRect().top;
      var primeiro = nos[0].getBoundingClientRect();
      var inicio = primeiro.top + primeiro.height / 2 - topo;
      var altura = 0;
      if (etapa > 0) {
        var alvo = nos[Math.min(etapa, nos.length) - 1].getBoundingClientRect();
        altura = Math.max(0, alvo.top + alvo.height / 2 - topo - inicio);
      }

      fio.style.top = inicio + 'px';
      if (animar && !poucoMovimento) {
        var antes = 0;
        try { antes = parseFloat(sessionStorage.getItem('fio')) || 0; } catch (e) {}
        fio.style.transition = 'none';
        fio.style.height = antes + 'px';
        fio.getBoundingClientRect();  // aplica a altura antiga antes de animar
        fio.style.transition = '';
      }
      fio.style.height = altura + 'px';
      try { sessionStorage.setItem('fio', String(altura)); } catch (e) {}
    };

    medirFio(true);
    window.addEventListener('resize', function () { medirFio(false); });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { medirFio(false); });
    }
  }

  /* --- 4. Barra de leitura ---------------------------------
     A barrinha embaixo do cabeçalho mostra quanto da página
     já foi lido.
     -------------------------------------------------------- */
  var barra = document.querySelector('.progresso__barra');

  if (barra) {
    var agendado = false;

    var atualizarBarra = function () {
      agendado = false;
      var total = document.documentElement.scrollHeight - window.innerHeight;
      var parte = total > 0 ? Math.min(1, window.scrollY / total) : 0;
      barra.style.transform = 'scaleX(' + parte + ')';
    };

    window.addEventListener('scroll', function () {
      if (agendado) return;
      agendado = true;
      requestAnimationFrame(atualizarBarra);
    }, { passive: true });
    window.addEventListener('resize', atualizarBarra);
    atualizarBarra();
  }

  /* --- 5. Blocos que aparecem ao rolar ---------------------
     Cada bloco entra subindo quando chega na tela, um pouco
     depois do vizinho anterior.
     -------------------------------------------------------- */
  var ANIMADOS = [
    '.pagina__corpo .card', '.pessoa', '.roteiro__item', '.csd__lista li', '.postit',
    '.concorrente', '.grafico', '.mapa__quadrante', '.hmw', '.foto', '.doc',
    '.pagina__corpo .arquivo', '.referencias'
  ].join(', ');

  if (!poucoMovimento && 'IntersectionObserver' in window) {
    var observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) return;
        entrada.target.classList.add('visivel');
        observador.unobserve(entrada.target);
      });
    }, { rootMargin: '0px 0px -6% 0px' });

    document.querySelectorAll(ANIMADOS).forEach(function (bloco) {
      var posicao = Array.prototype.indexOf.call(bloco.parentNode.children, bloco);
      bloco.style.setProperty('--atraso', Math.min(posicao, 8) * 0.06 + 's');
      bloco.classList.add('revelar');
      observador.observe(bloco);
    });
  }

})();
