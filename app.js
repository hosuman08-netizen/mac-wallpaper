(function () {
  'use strict';
  var SIZES = [
    { id: 'mac14', label: '14\" Retina', w: 3024, h: 1964 },
    { id: 'mac16', label: '16\" Retina', w: 3456, h: 2234 },
    { id: 'mbp15', label: '2880×1800', w: 2880, h: 1800 },
    { id: '2k', label: '2560×1600', w: 2560, h: 1600 },
    { id: 'fhd', label: '1920×1080', w: 1920, h: 1080 },
    { id: 'sq', label: '1080×1080', w: 1080, h: 1080 }
  ];
  var STYLES = [
    { id: 'legion', label: 'Legion Gold' },
    { id: 'aurora', label: 'Aurora' },
    { id: 'mesh', label: 'Soft Mesh' },
    { id: 'minimal', label: 'Minimal Dark' },
    { id: 'ocean', label: 'Deep Ocean' },
    { id: 'ember', label: 'Ember' },
    { id: 'neon', label: 'Neon Grid' },
    { id: 'sakura', label: 'Sakura Dusk' }
  ];
  var state = {
    size: SIZES[0],
    style: STYLES[0].id,
    seed: 42,
    bright: 100
  };
  var FKEY = 'macWallFavs_v1';
  var canvas = document.getElementById('c');
  var ctx = canvas.getContext('2d');

  function mulberry32(a) {
    return function () {
      var t = (a += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }

  function drawStyle(ctx, w, h, style, seed, bright) {
    var rnd = mulberry32(seed >>> 0);
    var b = bright / 100;
    function col(h0, s0, l0, a) {
      var l = clamp(l0 * b, 4, 92);
      return 'hsla(' + h0 + ',' + s0 + '%,' + l + '%,' + (a == null ? 1 : a) + ')';
    }
    ctx.clearRect(0, 0, w, h);

    if (style === 'legion') {
      var g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, col(230, 18, 8));
      g.addColorStop(0.45, col(40, 55, 18));
      g.addColorStop(1, col(220, 30, 6));
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      for (var i = 0; i < 5; i++) {
        var rg = ctx.createRadialGradient(
          rnd() * w, rnd() * h, 0,
          rnd() * w, rnd() * h, w * (0.2 + rnd() * 0.35)
        );
        rg.addColorStop(0, col(42, 70, 42, 0.22));
        rg.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = rg;
        ctx.fillRect(0, 0, w, h);
      }
      // soft vignette
      var v = ctx.createRadialGradient(w / 2, h / 2, h * 0.2, w / 2, h / 2, h * 0.75);
      v.addColorStop(0, 'rgba(0,0,0,0)');
      v.addColorStop(1, 'rgba(0,0,0,0.55)');
      ctx.fillStyle = v;
      ctx.fillRect(0, 0, w, h);
    } else if (style === 'aurora') {
      ctx.fillStyle = col(230, 40, 6);
      ctx.fillRect(0, 0, w, h);
      for (var a = 0; a < 8; a++) {
        ctx.beginPath();
        var y0 = h * (0.15 + rnd() * 0.7);
        ctx.moveTo(0, y0);
        for (var x = 0; x <= w; x += w / 40) {
          ctx.lineTo(x, y0 + Math.sin(x * 0.004 + a + seed) * h * 0.08 + (rnd() - 0.5) * 20);
        }
        ctx.strokeStyle = col(140 + a * 20, 70, 50, 0.18);
        ctx.lineWidth = h * 0.08;
        ctx.stroke();
      }
    } else if (style === 'mesh') {
      ctx.fillStyle = col(240, 15, 10);
      ctx.fillRect(0, 0, w, h);
      for (var m = 0; m < 12; m++) {
        var mx = rnd() * w, my = rnd() * h, mr = w * (0.15 + rnd() * 0.35);
        var mg = ctx.createRadialGradient(mx, my, 0, mx, my, mr);
        mg.addColorStop(0, col(200 + rnd() * 80, 50, 40, 0.35));
        mg.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = mg;
        ctx.fillRect(0, 0, w, h);
      }
    } else if (style === 'minimal') {
      var g2 = ctx.createLinearGradient(0, 0, 0, h);
      g2.addColorStop(0, col(220, 8, 12));
      g2.addColorStop(1, col(220, 10, 5));
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = col(40, 20, 30, 0.25);
      ctx.lineWidth = 1;
      for (var k = 1; k < 6; k++) {
        ctx.beginPath();
        ctx.moveTo(w * 0.1, h * (k / 7));
        ctx.lineTo(w * 0.9, h * (k / 7));
        ctx.stroke();
      }
    } else if (style === 'ocean') {
      var og = ctx.createLinearGradient(0, 0, w * 0.2, h);
      og.addColorStop(0, col(210, 50, 8));
      og.addColorStop(0.5, col(195, 60, 18));
      og.addColorStop(1, col(170, 40, 10));
      ctx.fillStyle = og;
      ctx.fillRect(0, 0, w, h);
      for (var o = 0; o < 6; o++) {
        var org = ctx.createRadialGradient(rnd() * w, h * 0.8, 0, rnd() * w, h, w * 0.4);
        org.addColorStop(0, col(190, 60, 35, 0.2));
        org.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = org;
        ctx.fillRect(0, 0, w, h);
      }
    } else if (style === 'neon') {
      ctx.fillStyle = col(250, 40, 5);
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = col(170, 90, 55, 0.35);
      ctx.lineWidth = 1;
      var step = Math.max(40, w / 48);
      for (var nx = 0; nx < w; nx += step) { ctx.beginPath(); ctx.moveTo(nx, 0); ctx.lineTo(nx, h); ctx.stroke(); }
      for (var ny = 0; ny < h; ny += step) { ctx.beginPath(); ctx.moveTo(0, ny); ctx.lineTo(w, ny); ctx.stroke(); }
      var ng = ctx.createRadialGradient(w*0.7, h*0.3, 0, w*0.7, h*0.3, w*0.5);
      ng.addColorStop(0, col(300, 80, 50, 0.25));
      ng.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = ng; ctx.fillRect(0,0,w,h);
    } else if (style === 'sakura') {
      var sg = ctx.createLinearGradient(0, 0, w, h);
      sg.addColorStop(0, col(330, 35, 18));
      sg.addColorStop(0.5, col(20, 40, 22));
      sg.addColorStop(1, col(250, 25, 8));
      ctx.fillStyle = sg; ctx.fillRect(0,0,w,h);
      for (var s = 0; s < 40; s++) {
        ctx.beginPath();
        ctx.fillStyle = col(340, 50, 70, 0.08 + rnd()*0.1);
        ctx.arc(rnd()*w, rnd()*h, 8+rnd()*24, 0, Math.PI*2);
        ctx.fill();
      }
    } else if (style === 'ember') {
      var eg = ctx.createRadialGradient(w * 0.5, h * 0.85, 0, w * 0.5, h * 0.5, h);
      eg.addColorStop(0, col(25, 90, 48));
      eg.addColorStop(0.4, col(10, 80, 28));
      eg.addColorStop(1, col(240, 30, 5));
      ctx.fillStyle = eg;
      ctx.fillRect(0, 0, w, h);
    }

    // fine noise
    var n = Math.min(8000, Math.floor((w * h) / 900));
    ctx.fillStyle = 'rgba(255,255,255,0.015)';
    for (var z = 0; z < n; z++) {
      ctx.fillRect(rnd() * w, rnd() * h, 1.2, 1.2);
    }
  }

  function paintPreview() {
    var pw = 1280, ph = Math.round(1280 * state.size.h / state.size.w);
    canvas.width = pw;
    canvas.height = ph;
    drawStyle(ctx, pw, ph, state.style, state.seed, state.bright);
    document.getElementById('hint').textContent =
      '미리보기 ' + pw + '×' + ph + ' · 다운로드 ' + state.size.w + '×' + state.size.h + ' · ' + state.style;
  }

  function downloadFull() {
    var off = document.createElement('canvas');
    off.width = state.size.w;
    off.height = state.size.h;
    var octx = off.getContext('2d');
    drawStyle(octx, off.width, off.height, state.style, state.seed, state.bright);
    off.toBlob(function (blob) {
      if (!blob) return;
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'mac-wallpaper-' + state.style + '-' + state.size.w + 'x' + state.size.h + '-' + state.seed + '.png';
      a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
      try { if (window.legionTrack) legionTrack('activate', { dl: 1, style: state.style, w: state.size.w }); } catch (e) {}
    }, 'image/png');
  }

  function renderChips() {
    var sz = document.getElementById('sizes');
    sz.innerHTML = '';
    SIZES.forEach(function (s) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'chip' + (state.size.id === s.id ? ' on' : '');
      b.textContent = s.label;
      b.onclick = function () { state.size = s; renderChips(); paintPreview(); };
      sz.appendChild(b);
    });
    var st = document.getElementById('styles');
    st.innerHTML = '';
    STYLES.forEach(function (s) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'chip' + (state.style === s.id ? ' on' : '');
      b.textContent = s.label;
      b.onclick = function () { state.style = s.id; renderChips(); paintPreview(); };
      st.appendChild(b);
    });
  }

  function loadFavs() {
    try { return JSON.parse(localStorage.getItem(FKEY) || '[]'); } catch (e) { return []; }
  }
  function saveFavs(arr) { localStorage.setItem(FKEY, JSON.stringify(arr.slice(0, 24))); }
  function renderFavs() {
    var list = document.getElementById('favList');
    var favs = loadFavs();
    if (!favs.length) {
      list.innerHTML = '<span class="hint">없음 · 마음에 들면 즐겨찾기</span>';
      return;
    }
    list.innerHTML = '';
    favs.forEach(function (f, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = f.style + ' · ' + f.seed;
      b.onclick = function () {
        state.style = f.style;
        state.seed = f.seed;
        state.bright = f.bright || 100;
        var sz = SIZES.find(function (x) { return x.id === f.sizeId; });
        if (sz) state.size = sz;
        document.getElementById('seed').value = state.seed;
        document.getElementById('bright').value = state.bright;
        renderChips();
        paintPreview();
      };
      list.appendChild(b);
    });
  }

  document.getElementById('seed').onchange = function () {
    state.seed = +this.value || 0;
    paintPreview();
  };
  document.getElementById('bright').oninput = function () {
    state.bright = +this.value || 100;
    paintPreview();
  };
  document.getElementById('regen').onclick = function () { paintPreview(); try { legionTrack('activate', { regen: 1 }); } catch (e) {} };
  document.getElementById('rand').onclick = function () {
    state.seed = Math.floor(Math.random() * 999999);
    document.getElementById('seed').value = state.seed;
    paintPreview();
  };
  document.getElementById('dl').onclick = downloadFull;
  if(!document.getElementById('dlMac14')){
    var b=document.createElement('button'); b.id='dlMac14'; b.className='sec'; b.textContent='14" 바로 받기';
    b.onclick=function(){ state.size=SIZES[0]; renderChips(); paintPreview(); downloadFull(); };
    document.getElementById('dl').parentNode.appendChild(b);
  }
  document.getElementById('fav').onclick = function () {
    var favs = loadFavs();
    favs.unshift({ style: state.style, seed: state.seed, bright: state.bright, sizeId: state.size.id, t: Date.now() });
    saveFavs(favs);
    renderFavs();
    try { legionTrack('activate', { fav: 1 }); } catch (e) {}
  };
  document.getElementById('share').onclick = function () {
    var url = 'https://hosuman08-netizen.github.io/mac-wallpaper/?style=' + encodeURIComponent(state.style) + '&seed=' + state.seed;
    if (navigator.clipboard) navigator.clipboard.writeText(url);
    try { legionTrack('share_peak', { style: state.style }); } catch (e) {}
    alert('링크 복사됨');
  };

  // URL params
  try {
    var q = new URLSearchParams(location.search);
    if (q.get('style')) state.style = q.get('style');
    if (q.get('seed')) state.seed = +q.get('seed') || state.seed;
    document.getElementById('seed').value = state.seed;
  } catch (e) {}

  renderChips();
  renderFavs();
  paintPreview();
  try { legionTrack('session_start', { app: 'mac-wallpaper' }); } catch (e) {}
})();
