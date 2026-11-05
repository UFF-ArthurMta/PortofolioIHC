/* ============================================================
   PIX para todos — scripts do site
   Tema claro/escuro, fio condutor (menu lateral), barra de
   leitura, animação dos blocos ao rolar a página, modo de
   leitura dos PDFs e vídeos das entrevistas.
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
    '.pagina__corpo .arquivo', '.referencias', '.documento', '.videoteca'
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

  /* --- 6. Modo de leitura dos PDFs -------------------------
     Links com data-leitor abrem o PDF numa janela de leitura do
     próprio site. As páginas são desenhadas pelo PDF.js, que só
     é carregado quando alguém abre (ou aponta para) um documento.
     Sem JavaScript, o link abre o PDF no navegador.
     -------------------------------------------------------- */
  var PDFJS = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/';
  var documentos = document.querySelectorAll('a[data-leitor]');

  var ICONE_MENOS = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.5 12h13"></path></svg>';
  var ICONE_MAIS = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.5 12h13M12 5.5v13"></path></svg>';
  var ICONE_FECHAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 6.5l11 11M17.5 6.5l-11 11"></path></svg>';

  if (documentos.length && window.HTMLDialogElement) {
    var pdfjsCarregando = null;
    var carregarPdfjs = function () {
      if (!pdfjsCarregando) {
        pdfjsCarregando = import(PDFJS + 'pdf.min.mjs').then(function (lib) {
          lib.GlobalWorkerOptions.workerSrc = PDFJS + 'pdf.worker.min.mjs';
          return lib;
        });
        pdfjsCarregando.catch(function () { pdfjsCarregando = null; });
      }
      return pdfjsCarregando;
    };

    var dialogo = document.createElement('dialog');
    dialogo.className = 'leitura';
    dialogo.setAttribute('aria-labelledby', 'leitura-titulo');
    dialogo.innerHTML =
      '<div class="leitura__barra">' +
        '<div class="leitura__info">' +
          '<p class="leitura__rotulo">Modo de leitura</p>' +
          '<h2 class="leitura__titulo" id="leitura-titulo"></h2>' +
        '</div>' +
        '<div class="leitura__controles">' +
          '<span class="leitura__pagina" aria-live="polite"></span>' +
          '<span class="leitura__zoom">' +
            '<button type="button" class="leitura__botao" data-zoom="-1" aria-label="Diminuir o zoom">' + ICONE_MENOS + '</button>' +
            '<span class="leitura__escala"></span>' +
            '<button type="button" class="leitura__botao" data-zoom="1" aria-label="Aumentar o zoom">' + ICONE_MAIS + '</button>' +
          '</span>' +
          '<button type="button" class="leitura__botao leitura__fechar" aria-label="Fechar o modo de leitura">' + ICONE_FECHAR + '</button>' +
        '</div>' +
      '</div>' +
      '<div class="leitura__folhas" tabindex="0" aria-label="Páginas do documento"></div>';
    document.body.appendChild(dialogo);

    var tituloLeitura = dialogo.querySelector('.leitura__titulo');
    var folhas = dialogo.querySelector('.leitura__folhas');
    var indicador = dialogo.querySelector('.leitura__pagina');
    var mostradorEscala = dialogo.querySelector('.leitura__escala');
    var botoesZoom = dialogo.querySelectorAll('[data-zoom]');

    // Zoom em relação à página ajustada na largura da janela
    var NIVEIS = [0.5, 0.67, 0.8, 1, 1.25, 1.5, 2, 2.5];
    var nivel = 3;
    var escalaBase = 1;
    var escala = 1;
    var lib = null;
    var pdfAberto = null;
    var paginas = [];
    var abertura = 0;

    var avisar = function (html) {
      var p = document.createElement('p');
      p.className = 'leitura__aviso';
      p.innerHTML = html;
      folhas.replaceChildren(p);
    };

    var calcularEscala = function () {
      if (!paginas.length) return;
      var estilo = getComputedStyle(folhas);
      var livre = folhas.clientWidth - parseFloat(estilo.paddingLeft) - parseFloat(estilo.paddingRight);
      var maior = Math.max.apply(null, paginas.map(function (p) { return p.largura; }));
      escalaBase = Math.min(livre / maior, 1.8);
      escala = escalaBase * NIVEIS[nivel];
      paginas.forEach(function (p) {
        p.folha.style.width = Math.floor(p.largura * escala) + 'px';
        p.folha.style.height = Math.floor(p.altura * escala) + 'px';
      });
      // 100% = tamanho real da página na tela (96 pontos por polegada)
      mostradorEscala.textContent = Math.round(escala / (96 / 72) * 100) + '%';
      botoesZoom[0].disabled = nivel === 0;
      botoesZoom[1].disabled = nivel === NIVEIS.length - 1;
    };

    var desenhar = function (p) {
      var alvo = escala;
      p.desenhada = alvo;
      if (p.tarefa) p.tarefa.cancel();
      var vista = p.pagina.getViewport({ scale: alvo });
      var densidade = Math.min(window.devicePixelRatio || 1, 2);
      var tela = document.createElement('canvas');
      tela.width = Math.floor(vista.width * densidade);
      tela.height = Math.floor(vista.height * densidade);
      var tarefa = p.pagina.render({
        canvasContext: tela.getContext('2d'),
        viewport: vista,
        transform: densidade !== 1 ? [densidade, 0, 0, densidade, 0, 0] : null
      });
      p.tarefa = tarefa;
      tarefa.promise.then(function () {
        if (p.desenhada !== alvo) return;
        p.tarefa = null;
        // A camada de texto deixa selecionar e copiar o conteúdo
        var camada = document.createElement('div');
        camada.className = 'textLayer';
        p.folha.style.setProperty('--scale-factor', alvo);
        p.folha.replaceChildren(tela, camada);
        p.folha.classList.add('folha--pronta');
        new lib.TextLayer({
          textContentSource: p.pagina.streamTextContent(),
          container: camada,
          viewport: vista
        }).render().catch(function () {});
      }).catch(function () {});  // cancelada por outro zoom
    };

    var paginaAtual = function () {
      var caixa = folhas.getBoundingClientRect();
      var linha = caixa.top + caixa.height / 3;
      var atual = 1;
      paginas.forEach(function (p, i) {
        if (p.folha.getBoundingClientRect().top <= linha) atual = i + 1;
      });
      return atual;
    };

    var agendadoLeitura = false;
    var atualizarLeitura = function () {
      agendadoLeitura = false;
      if (!paginas.length) return;
      var caixa = folhas.getBoundingClientRect();
      paginas.forEach(function (p) {
        var r = p.folha.getBoundingClientRect();
        var perto = r.bottom > caixa.top - caixa.height && r.top < caixa.bottom + caixa.height;
        if (perto && p.desenhada !== escala) desenhar(p);
      });
      indicador.textContent = 'Página ' + paginaAtual() + ' de ' + paginas.length;
    };
    var agendarLeitura = function () {
      if (agendadoLeitura) return;
      agendadoLeitura = true;
      requestAnimationFrame(atualizarLeitura);
    };

    var mudarZoom = function (passo) {
      var novo = Math.max(0, Math.min(NIVEIS.length - 1, nivel + passo));
      if (novo === nivel || !paginas.length) return;
      var proporcao = folhas.scrollTop / Math.max(1, folhas.scrollHeight);
      nivel = novo;
      calcularEscala();
      folhas.scrollTop = proporcao * folhas.scrollHeight;
      atualizarLeitura();
    };

    var abrirDocumento = function (link) {
      var endereco = link.getAttribute('href');
      var titulo = link.querySelector('.documento__titulo');
      tituloLeitura.textContent = titulo ? titulo.textContent : 'Documento';
      indicador.textContent = '';
      mostradorEscala.textContent = '';
      nivel = 3;
      paginas = [];
      avisar('Abrindo o documento...');
      dialogo.showModal();
      document.documentElement.classList.add('lendo');
      folhas.focus();

      var minha = ++abertura;
      carregarPdfjs().then(function (carregada) {
        lib = carregada;
        return lib.getDocument(endereco).promise;
      }).then(function (pdf) {
        if (minha !== abertura) { pdf.destroy(); return; }
        pdfAberto = pdf;
        var pedidos = [];
        for (var n = 1; n <= pdf.numPages; n++) pedidos.push(pdf.getPage(n));
        return Promise.all(pedidos).then(function (lista) {
          if (minha !== abertura) return;
          folhas.replaceChildren();
          paginas = lista.map(function (pagina, i) {
            var base = pagina.getViewport({ scale: 1 });
            var folha = document.createElement('div');
            folha.className = 'folha';
            folha.setAttribute('role', 'img');
            folha.setAttribute('aria-label', 'Página ' + (i + 1));
            folhas.appendChild(folha);
            return { pagina: pagina, folha: folha, largura: base.width, altura: base.height, desenhada: 0, tarefa: null };
          });
          calcularEscala();
          atualizarLeitura();
        });
      }).catch(function () {
        if (minha !== abertura) return;
        avisar('Não foi possível mostrar o documento aqui. <a href="' + endereco +
               '" target="_blank" rel="noopener">Abrir o PDF em outra aba</a>.');
      });
    };

    documentos.forEach(function (link) {
      // Começa a carregar o leitor assim que a pessoa aponta para o documento
      link.addEventListener('pointerenter', function () { carregarPdfjs().catch(function () {}); }, { once: true });
      link.addEventListener('click', function (e) {
        if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button) return;
        e.preventDefault();
        abrirDocumento(link);
      });
    });

    folhas.addEventListener('scroll', agendarLeitura, { passive: true });
    window.addEventListener('resize', function () {
      if (!dialogo.open) return;
      calcularEscala();
      atualizarLeitura();
    });
    botoesZoom.forEach(function (b) {
      b.addEventListener('click', function () { mudarZoom(parseInt(b.getAttribute('data-zoom'), 10)); });
    });
    // Limpa tudo ao fechar (pelo botão, clicando fora ou com Esc)
    var limparLeitura = function () {
      if (!document.documentElement.classList.contains('lendo')) return;
      abertura++;
      document.documentElement.classList.remove('lendo');
      paginas.forEach(function (p) { if (p.tarefa) p.tarefa.cancel(); });
      paginas = [];
      folhas.replaceChildren();
      if (pdfAberto) { pdfAberto.destroy(); pdfAberto = null; }
    };
    var fecharLeitura = function () {
      dialogo.close();
      limparLeitura();
    };

    dialogo.querySelector('.leitura__fechar').addEventListener('click', fecharLeitura);

    // Clique fora da janela fecha; + e - mudam o zoom
    dialogo.addEventListener('click', function (e) {
      if (e.target !== dialogo) return;
      var r = dialogo.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) fecharLeitura();
    });
    dialogo.addEventListener('keydown', function (e) {
      if (e.key === '+' || e.key === '=') { e.preventDefault(); mudarZoom(1); }
      if (e.key === '-') { e.preventDefault(); mudarZoom(-1); }
    });

    dialogo.addEventListener('close', limparLeitura);
  }

  /* --- 7. Vídeos das entrevistas ---------------------------
     A lista de vídeos ganha uma tela no topo. O player do
     YouTube só carrega quando a pessoa escolhe assistir.
     Vídeos com data-incorporar="nao" não deixam ser exibidos
     fora do YouTube; para esses a tela abre o YouTube.
     -------------------------------------------------------- */
  var ICONE_PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z"></path></svg>';

  document.querySelectorAll('[data-videoteca]').forEach(function (videoteca) {
    var itens = videoteca.querySelectorAll('.videoteca__item');
    if (!itens.length) return;

    var tela = document.createElement('div');
    tela.className = 'video';
    videoteca.insertBefore(tela, videoteca.firstChild);

    var texto = function (item, seletor) {
      var el = item.querySelector(seletor);
      return el ? el.textContent.trim() : '';
    };

    var mostrar = function (item, tocar) {
      itens.forEach(function (i) { i.removeAttribute('aria-current'); });
      item.setAttribute('aria-current', 'true');

      var codigo = texto(item, '.doc__codigo');
      var nome = texto(item, '.videoteca__nome');
      var noSite = item.getAttribute('data-incorporar') !== 'nao';

      if (tocar && noSite) {
        var player = document.createElement('iframe');
        player.src = 'https://www.youtube-nocookie.com/embed/' + item.getAttribute('data-youtube') +
                     '?autoplay=1&rel=0&playsinline=1';
        player.title = nome + ' ' + codigo;
        player.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
        player.allowFullscreen = true;
        player.referrerPolicy = 'strict-origin-when-cross-origin';
        tela.replaceChildren(player);
        tela.classList.add('video--tocando');
        return;
      }

      tela.classList.remove('video--tocando');
      var capa = document.createElement(noSite ? 'button' : 'a');
      capa.className = 'video__capa';
      if (noSite) {
        capa.type = 'button';
        capa.setAttribute('aria-label', 'Assistir: ' + nome + ' ' + codigo);
        capa.addEventListener('click', function () { mostrar(item, true); });
      } else {
        capa.href = item.href;
        capa.target = '_blank';
        capa.rel = 'noopener noreferrer';
        capa.setAttribute('aria-label', nome + ' ' + codigo + ', abre no YouTube');
      }
      capa.innerHTML =
        '<span class="video__codigo">' + codigo + '</span>' +
        '<span class="video__play" aria-hidden="true">' + ICONE_PLAY + '</span>' +
        '<span class="video__titulo">' + nome + '</span>' +
        '<span class="video__meta">' + (noSite ? texto(item, '.videoteca__duracao') : 'Abre no YouTube') + '</span>';
      tela.replaceChildren(capa);
    };

    itens.forEach(function (item) {
      item.addEventListener('click', function (e) {
        if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button) return;
        e.preventDefault();
        mostrar(item, true);
        tela.scrollIntoView({ block: 'nearest', behavior: poucoMovimento ? 'auto' : 'smooth' });
      });
    });

    // Começa mostrando o primeiro vídeo que pode ser visto no site
    var primeiro = Array.prototype.filter.call(itens, function (i) {
      return i.getAttribute('data-incorporar') !== 'nao';
    })[0] || itens[0];
    mostrar(primeiro, false);
  });

})();
