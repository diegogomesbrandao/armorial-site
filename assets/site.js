// Busca da documentação: filtra o índice gerado em /busca.json. Sem dependências.
(function () {
  var campos = document.querySelectorAll('input[data-busca-url]');
  if (!campos.length) return;
  var indice = null;
  var carregando = null;

  function carregar(url) {
    if (indice) return Promise.resolve(indice);
    if (!carregando) {
      carregando = fetch(url).then(function (r) { return r.json(); }).then(function (dados) {
        indice = dados;
        return dados;
      });
    }
    return carregando;
  }

  function normalizar(s) {
    return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  }

  function textoSeguro(s) {
    var d = document.createElement('span');
    d.textContent = s;
    return d.innerHTML;
  }

  campos.forEach(function (campo) {
    var lista = document.getElementById('resultados');
    if (!lista) return;
    campo.addEventListener('input', function () {
      var termo = normalizar(campo.value.trim());
      if (termo.length < 2) {
        lista.hidden = true;
        lista.innerHTML = '';
        return;
      }
      carregar(campo.getAttribute('data-busca-url')).then(function (dados) {
        var achados = dados.filter(function (i) {
          return normalizar(i.t + ' ' + i.d).indexOf(termo) !== -1;
        }).slice(0, 30);
        if (!achados.length) {
          lista.innerHTML = '<li class="vazio-busca">Nada encontrado para “' + textoSeguro(campo.value) + '”.</li>';
        } else {
          lista.innerHTML = achados.map(function (i) {
            return '<li><a href="' + i.u + '"><span>' + textoSeguro(i.t) + '</span><small>' + textoSeguro(i.d) + '</small></a></li>';
          }).join('');
        }
        lista.hidden = false;
      });
    });
    campo.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { campo.value = ''; lista.hidden = true; }
    });
  });
})();

// Vídeos em loop: pausa para quem pediu menos movimento no sistema
(function () {
  if (!window.matchMedia || !window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.querySelectorAll('video[autoplay]').forEach(function (v) {
    v.removeAttribute('autoplay');
    v.pause();
  });
})();
