/* ============================================================
   SCRIPT DA LANDING PAGE — Planner de Casamento
   Contador regressivo até a meia-noite (efeito de urgência).
   ============================================================ */

(function () {
  var el = document.getElementById('count');
  if (!el) return;

  function tick() {
    var now = new Date();
    var end = new Date(now);
    end.setHours(23, 59, 59, 999);
    var diff = Math.max(0, end - now);
    var h = String(Math.floor(diff / 3.6e6)).padStart(2, '0');
    var m = String(Math.floor((diff % 3.6e6) / 6e4)).padStart(2, '0');
    var s = String(Math.floor((diff % 6e4) / 1e3)).padStart(2, '0');
    el.textContent = h + ':' + m + ':' + s;
  }

  tick();
  setInterval(tick, 1000);
})();


/* ============================================================
   POPUP DE PROVA SOCIAL — "fulana acabou de comprar"
   Aparece no canto inferior esquerdo, some, e volta com outra
   pessoa após um intervalo aleatório. Para ajustar a frequência,
   edite as 4 constantes de TEMPO logo abaixo.
   ============================================================ */
(function () {
  var container = document.getElementById('social-proof');
  if (!container) return;

  var compradoras = [
    "Ana Beatriz", "Mariana Costa", "Juliana Almeida", "Camila Ferreira",
    "Larissa Souza", "Fernanda Lima", "Patrícia Gomes", "Amanda Ribeiro",
    "Bruna Carvalho", "Gabriela Martins", "Letícia Rocha", "Vanessa Oliveira",
    "Carolina Dias", "Aline Barbosa", "Débora Nunes", "Renata Cardoso",
    "Tatiane Freitas", "Priscila Ramos", "Jéssica Teixeira", "Michele Araújo",
    "Sabrina Pinto", "Isabela Moraes", "Natália Correia", "Bianca Fernandes",
    "Raquel Mendes", "Cristiane Vieira", "Simone Cardozo", "Daniela Batista",
    "Adriana Moreira", "Elaine Cunha", "Tamires Farias", "Kelly Nascimento",
    "Viviane Antunes", "Rafaela Duarte", "Luana Machado", "Carla Siqueira",
    "Andressa Lopes", "Beatriz Monteiro", "Emanuelle Castro", "Thaís Guimarães",
    "Marcela Pires", "Rebeca Fonseca", "Priscilla Tavares", "Vitória Nogueira",
    "Yasmin Cavalcanti", "Lorena Sampaio", "Nathália Brito", "Fabiana Reis",
    "Sara Andrade", "Milena Xavier"
  ];

  /* ---- TEMPOS (edite aqui) — valores em milissegundos ---- */
  var TEMPO_VISIVEL  = 5000;   // quanto tempo cada popup fica visível (5s)
  var INTERVALO_MIN  = 8000;   // espera mínima entre um popup e o próximo (8s)
  var INTERVALO_MAX  = 20000;  // espera máxima entre um popup e o próximo (20s)
  var ATRASO_INICIAL = 4000;   // espera antes do primeiro popup (4s)

  var heartSVG = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';
  var checkSVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';

  var dismissed = false;
  var queue = [];
  var lastName = null;
  var hideTimer, nextTimer;

  var card = document.createElement('div');
  card.className = 'sp-card';
  card.setAttribute('role', 'status');
  card.innerHTML =
    '<span class="sp-icon">' + heartSVG + '</span>' +
    '<div class="sp-body">' +
      '<p class="sp-name"><span class="sp-nm"></span>' +
        '<span class="sp-verified" role="img" aria-label="compra verificada">' + checkSVG + '</span></p>' +
      '<p class="sp-text">acabou de comprar a <b>Central da Noiva</b></p>' +
    '</div>' +
    '<button class="sp-close" type="button" aria-label="Fechar aviso">&times;</button>';
  container.appendChild(card);

  var nameEl = card.querySelector('.sp-nm');

  card.querySelector('.sp-close').addEventListener('click', function () {
    dismissed = true;
    clearTimeout(hideTimer);
    clearTimeout(nextTimer);
    hide();
  });

  // Embaralha uma cópia da lista (Fisher–Yates)
  function shuffle(list) {
    var a = list.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  // Próximo nome sem repetir o anterior; ao esgotar, reembaralha
  function nextName() {
    if (queue.length === 0) {
      queue = shuffle(compradoras);
      if (lastName && queue[0] === lastName && queue.length > 1) {
        queue.push(queue.shift());
      }
    }
    lastName = queue.shift();
    return lastName;
  }

  function rand(min, max) { return min + Math.random() * (max - min); }

  function show() {
    if (dismissed) return;
    nameEl.textContent = nextName();
    void card.offsetWidth;            // reinicia a animação de entrada
    card.classList.add('sp-show');
    hideTimer = setTimeout(hide, TEMPO_VISIVEL);
  }

  function hide() {
    card.classList.remove('sp-show');
    if (dismissed) return;
    nextTimer = setTimeout(show, rand(INTERVALO_MIN, INTERVALO_MAX));
  }

  nextTimer = setTimeout(show, ATRASO_INICIAL);
})();


/* ============================================================
   CARROSSEL DE DEPOIMENTOS — esteira contínua, em movimento o
   tempo todo (loop infinito e sem emenda). Ajuste a velocidade
   em VELOCIDADE (pixels por segundo).
   ============================================================ */
(function () {
  var track = document.getElementById('testiTrack');
  if (!track) return;

  var VELOCIDADE = 55; // pixels por segundo (maior = mais rápido)

  var originais = Array.prototype.slice.call(track.children);
  if (originais.length < 1) return;

  // Respeita quem prefere menos movimento: sem animação, rolagem manual
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    track.classList.add('is-static');
    return;
  }

  // Duplica os cards para o loop parecer infinito e sem cortes
  originais.forEach(function (card) {
    track.appendChild(card.cloneNode(true));
  });

  function ajustar() {
    var primeiroClone = track.children[originais.length];
    if (!primeiroClone) return;
    var distancia = primeiroClone.offsetLeft; // largura de um conjunto de cards
    if (!distancia) return;
    track.style.setProperty('--shift', distancia + 'px');
    track.style.animationDuration = (distancia / VELOCIDADE) + 's';
  }

  ajustar();
  window.addEventListener('load', ajustar); // recalcula após carregar as fontes

  var t;
  window.addEventListener('resize', function () {
    clearTimeout(t);
    t = setTimeout(ajustar, 200);
  });
})();


/* ============================================================
   PASSAGEM DE PARÂMETROS PARA O CHECKOUT (UTM, fbclid, gclid...)
   Leva os parâmetros da URL atual para o checkout da Kiwify,
   para o rastreamento (UTMify/Meta) funcionar do clique à venda.
   ============================================================ */

// Função global: redireciona mantendo os parâmetros atuais da URL
function redirectWithParams(destination) {
  var currentParams = window.location.search;
  if (!currentParams) {
    window.location.href = destination;
    return;
  }
  if (destination.indexOf("?") !== -1) {
    window.location.href = destination + "&" + currentParams.substring(1);
  } else {
    window.location.href = destination + currentParams;
  }
}
window.redirectWithParams = redirectWithParams;

// Aplica os parâmetros atuais em TODOS os links de checkout (cobre clique,
// abrir em nova aba e copiar link — sem redirecionamento fora da função).
(function () {
  function aplicarParams() {
    var search = window.location.search;
    if (!search) return; // sem parâmetros na URL, nada a fazer
    var extra = search.substring(1); // remove o "?"
    var links = document.querySelectorAll('a[href*="pay.kiwify.com.br"]');
    for (var i = 0; i < links.length; i++) {
      var href = links[i].getAttribute('href');
      if (!href || href.indexOf('utm_') !== -1) continue; // evita duplicar
      links[i].setAttribute('href', href + (href.indexOf('?') !== -1 ? '&' : '?') + extra);
    }
  }
  if (document.readyState !== 'loading') aplicarParams();
  else document.addEventListener('DOMContentLoaded', aplicarParams);
})();
