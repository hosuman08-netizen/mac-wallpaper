
/* LEGION_WAVE_85_session_counter */
try{if(!sessionStorage.getItem('lw_p45_mac_wall_session_counter')){sessionStorage.setItem('lw_p45_mac_wall_session_counter','1');localStorage.setItem('lw_p45_mac_wall_session_counter',String((+(localStorage.getItem('lw_p45_mac_wall_session_counter')||0))+1));}}catch(e){}
(function () {
  'use strict';
  var SIZES = [
    { id: 'mac13', label: '13\" Air', w: 2560, h: 1664 },
    { id: 'mac14', label: '14\" Retina', w: 3024, h: 1964 },
    { id: 'mac16', label: '16\" Retina', w: 3456, h: 2234 },
    { id: 'mbp15', label: '2880×1800', w: 2880, h: 1800 },
    { id: '2k', label: '2560×1600', w: 2560, h: 1600 },
    { id: 'fhd', label: '1920×1080', w: 1920, h: 1080 },
    { id: 'sq', label: '1080×1080', w: 1080, h: 1080 },
    { id: 'imac24', label: 'iMac 24"', w: 4480, h: 2520 }
  ];
  var STYLES = [
    { id: 'legion', label: 'Legion Gold' },
    { id: 'aurora', label: 'Aurora' },
    { id: 'mesh', label: 'Soft Mesh' },
    { id: 'minimal', label: 'Minimal Dark' },
    { id: 'ocean', label: 'Deep Ocean' },
    { id: 'ember', label: 'Ember' },
    { id: 'neon', label: 'Neon Grid' },
    { id: 'sakura', label: 'Sakura Dusk' },
    { id: 'mist', label: 'Fog Mist' },
    { id: 'cyber', label: 'Cyber Violet' }
  ];
  var state = {
    size: SIZES[0],
    style: STYLES[0].id,
    seed: 42,
    bright: 100
  };
  var seedStack = []; // undo last seed/style
  var FKEY = 'macWallFavs_v1';
  var canvas = document.getElementById('c');
  var ctx = canvas.getContext('2d');
  function pushSeedSnap() {
    try {
      seedStack.push({ seed: state.seed, style: state.style, bright: state.bright, sizeId: state.size.id });
      if (seedStack.length > 12) seedStack.shift();
    } catch (e) {}
  }
  function undoSeed() {
    if (!seedStack.length) return false;
    var prev = seedStack.pop();
    state.seed = prev.seed;
    state.style = prev.style;
    state.bright = prev.bright || 100;
    var sz = SIZES.find(function (x) { return x.id === prev.sizeId; });
    if (sz) state.size = sz;
    var se = document.getElementById('seed'); if (se) se.value = state.seed;
    var br = document.getElementById('bright'); if (br) br.value = state.bright;
    renderChips(); paintPreview();
    try { legionTrack('undo', { seed: state.seed }); } catch (e) {}
    return true;
  }

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

    } else if (style === 'mist') {
      var mgg = ctx.createLinearGradient(0, 0, 0, h);
      mgg.addColorStop(0, col(210, 12, 22));
      mgg.addColorStop(1, col(220, 8, 8));
      ctx.fillStyle = mgg; ctx.fillRect(0,0,w,h);
      for (var mi = 0; mi < 10; mi++) {
        var mgr = ctx.createRadialGradient(rnd()*w, rnd()*h, 0, rnd()*w, rnd()*h, w*(0.25+rnd()*0.3));
        mgr.addColorStop(0, col(200, 8, 55, 0.12));
        mgr.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = mgr; ctx.fillRect(0,0,w,h);
      }
    } else if (style === 'cyber') {
      ctx.fillStyle = col(265, 50, 6);
      ctx.fillRect(0,0,w,h);
      for (var cy = 0; cy < 18; cy++) {
        ctx.strokeStyle = col(280+cy*3, 90, 55, 0.12+rnd()*0.1);
        ctx.lineWidth = 1+rnd()*2;
        ctx.beginPath();
        var yb = rnd()*h;
        ctx.moveTo(0, yb);
        for (var cx = 0; cx <= w; cx += w/30) ctx.lineTo(cx, yb + Math.sin(cx*0.01+cy)*h*0.04);
        ctx.stroke();
      }
      var cg = ctx.createRadialGradient(w*0.2, h*0.8, 0, w*0.2, h*0.8, w*0.55);
      cg.addColorStop(0, col(300, 90, 50, 0.3));
      cg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = cg; ctx.fillRect(0,0,w,h);
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

  function styleOfDay(){
    var styles=['nebula','ember','aurora','grid','mist','ocean','paper','noir'];
    try{
      // use existing STYLES if present
      if(typeof STYLES!=='undefined' && STYLES.length) styles=STYLES.map(function(s){return s.id||s;});
    }catch(e){}
    var t=dayKey(); var h=0; for(var i=0;i<t.length;i++) h=(h*31+t.charCodeAt(i))>>>0;
    return styles[h%styles.length];
  }

  function paintPreview() {
    try{var dk=new Date().toDateString();if(localStorage.getItem('mw_dayseed')!==dk){localStorage.setItem('mw_dayseed',dk);state.seed=(state.seed|0)+7;var se=document.getElementById('seed');if(se)se.value=state.seed;}}catch(e){}
    var pw = 1280, ph = Math.round(1280 * state.size.h / state.size.w);
    canvas.width = pw;
    canvas.height = ph;
    drawStyle(ctx, pw, ph, state.style, state.seed, state.bright);
    var dl=0,sc=0,tdl=0;try{dl=+(localStorage.getItem('mw_dl')||0);sc=(JSON.parse(localStorage.getItem('mw_streak')||'{}').count||0);tdl=+(localStorage.getItem('mw_day_dl_'+dayKey())||0)}catch(e){}
    var sod=styleOfDay(); var sodOk=state.style===sod;
    document.getElementById('hint').textContent =
      '미리보기 ' + pw + '×' + ph + ' · 다운로드 ' + state.size.w + '×' + state.size.h + ' · ' + state.style + (dl?' · 다운 '+dl:'') + (tdl?' · 오늘 '+tdl:'') + (sc?' · 🔥'+sc+'일':'') + ' · 오늘 스타일 ' + sod + (sodOk?' ✓':'') + ' · 시드';
    try{ pushStyleHist(); styleCollection(); weekDlSpark(); }catch(e){}
  }

  function downloadFull() {
    try{var n=+(localStorage.getItem('mw_dl')||0)+1;localStorage.setItem('mw_dl',n); var dk='mw_day_dl_'+dayKey(); localStorage.setItem(dk,String((+(localStorage.getItem(dk)||0))+1));}catch(e){}
    var st=bumpDlStreak();
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
      // auto-fav on 3rd+ dl same style
      try{
        var sk='mw_style_dl_'+state.style;
        var c=+(localStorage.getItem(sk)||0)+1; localStorage.setItem(sk,String(c));
        if(c===3){
          var favs=loadFavs();
          favs.unshift({ style: state.style, seed: state.seed, bright: state.bright, sizeId: state.size.id, t: Date.now() });
          saveFavs(favs); renderFavs();
        }
      }catch(e){}
      paintPreview();
      pushDlHist();
      try{if(state.style===styleOfDay()){localStorage.setItem('mw_sod_'+dayKey(),'1'); legionTrack && legionTrack('style_day',{style:state.style});}}catch(e){}
      try { if (window.legionTrack) legionTrack('activate', { dl: 1, style: state.style, w: state.size.w, streak: st.count||0 }); } catch (e) {}
      try { if (window.legionTrack) legionTrack('share_peak_shown', { style: state.style }); } catch (e) {}
      // soft share nudge
      var n=document.getElementById('hint');
      if(n) n.textContent='다운로드 완료 · 🔥'+(st.count||1)+'일 · 링크 공유로 같은 시드 전달';
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
    var fc=document.getElementById('favCount'); if(fc) fc.textContent=favs.length?'· '+favs.length:'';
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
    pushSeedSnap();
    state.seed = +this.value || 0;
    try{localStorage.setItem('mw_seed_touched','1');}catch(e){}
    paintPreview();
  };
  document.getElementById('bright').oninput = function () {
    state.bright = +this.value || 100;
    paintPreview();
  };
  document.getElementById('regen').onclick = function () { paintPreview(); try { legionTrack('activate', { regen: 1 }); } catch (e) {} };
  if(!document.getElementById('undoSeed')){
    var ub=document.createElement('button'); ub.id='undoSeed'; ub.className='sec'; ub.textContent='↩ 직전 시드';
    ub.onclick=function(){ if(!undoSeed()){ var n=document.getElementById('hint'); if(n) n.textContent='되돌릴 시드 없음'; } };
    document.getElementById('rand').parentNode.appendChild(ub);
  }
  if(!document.getElementById('brightPresets')){
    var bp=document.createElement('div'); bp.id='brightPresets'; bp.className='row'; bp.style.cssText='gap:6px;margin-top:8px;flex-wrap:wrap';
    [{l:'어둡게',v:75},{l:'기본',v:100},{l:'밝게',v:120},{l:'하이키',v:135}].forEach(function(p){
      var b=document.createElement('button'); b.type='button'; b.className='sec'; b.textContent=p.l;
      b.onclick=function(){ pushSeedSnap(); state.bright=p.v; var br=document.getElementById('bright'); if(br) br.value=p.v; paintPreview(); try{legionTrack('bright',{v:p.v})}catch(e){} };
      bp.appendChild(b);
    });
    var brightEl=document.getElementById('bright');
    if(brightEl&&brightEl.parentNode) brightEl.parentNode.appendChild(bp);
  }
  if(!document.getElementById('randStyle')){
    var rs=document.createElement('button'); rs.id='randStyle'; rs.className='sec'; rs.textContent='스타일 랜덤';
    rs.onclick=function(){ pushSeedSnap(); state.style=STYLES[Math.floor(Math.random()*STYLES.length)].id; renderChips(); paintPreview(); };
    document.getElementById('rand').parentNode.appendChild(rs);
  }
  if(!document.getElementById('prevStyle')){
    function styleIdx(){ for(var i=0;i<STYLES.length;i++) if(STYLES[i].id===state.style) return i; return 0; }
    var ps=document.createElement('button'); ps.id='prevStyle'; ps.className='sec'; ps.textContent='◀ 스타일';
    ps.onclick=function(){ pushSeedSnap(); state.style=STYLES[(styleIdx()-1+STYLES.length)%STYLES.length].id; renderChips(); paintPreview(); try{legionTrack('style_nav',{d:-1})}catch(e){} };
    var ns=document.createElement('button'); ns.id='nextStyle'; ns.className='sec'; ns.textContent='스타일 ▶';
    ns.onclick=function(){ pushSeedSnap(); state.style=STYLES[(styleIdx()+1)%STYLES.length].id; renderChips(); paintPreview(); try{legionTrack('style_nav',{d:1})}catch(e){} };
    document.getElementById('rand').parentNode.appendChild(ps);
    document.getElementById('rand').parentNode.appendChild(ns);
  }
  if(!document.getElementById('styleOfDay')){
    var sd=document.createElement('button'); sd.id='styleOfDay'; sd.className='sec'; sd.textContent='오늘의 스타일';
    sd.onclick=function(){
      var t=dayKey(); var h=0; for(var i=0;i<t.length;i++) h=(h*31+t.charCodeAt(i))>>>0;
      state.style=STYLES[h%STYLES.length].id;
      if(!localStorage.getItem('mw_seed_touched')){
        state.seed=(h%900000)+42;
        document.getElementById('seed').value=state.seed;
      }
      renderChips(); paintPreview();
      try{legionTrack('activate',{sod:1,style:state.style})}catch(e){}
    };
    document.getElementById('rand').parentNode.appendChild(sd);
  }
  // collection progress: unique styles downloaded
  function weekDlSpark(){
    try{
      var box=document.getElementById('weekDl');
      if(!box){
        box=document.createElement('div'); box.id='weekDl';
        box.style.cssText='display:flex;align-items:flex-end;gap:3px;height:28px;margin-top:8px';
        var h=document.getElementById('hint'); if(h&&h.parentNode) h.parentNode.appendChild(box);
      }
      var vals=[], max=1;
      for(var i=6;i>=0;i--){
        var d=new Date(); d.setDate(d.getDate()-i);
        var k=d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
        var n=+(localStorage.getItem('mw_day_dl_'+k)||0);
        vals.push(n); if(n>max)max=n;
      }
      box.innerHTML=vals.map(function(n){var h=Math.max(3,Math.round(n/max*24));return '<div style="flex:1;height:'+h+'px;background:'+(n>0?'#e0b552':'#2a2438')+';border-radius:2px" title="'+n+'"></div>';}).join('');
    }catch(e){}
  }
  function styleCollection(){
    try{
      var set={};
      STYLES.forEach(function(s){ var c=+(localStorage.getItem('mw_style_dl_'+s.id)||0); if(c>0) set[s.id]=1; });
      var n=Object.keys(set).length;
      var el=document.getElementById('styleColl');
      if(!el){
        el=document.createElement('p'); el.id='styleColl'; el.className='hint';
        var hint=document.getElementById('hint'); if(hint&&hint.parentNode) hint.parentNode.appendChild(el);
      }
      el.textContent='컬렉션 '+n+'/'+STYLES.length+' 스타일 수집'+(n>=STYLES.length?' · 완료!':' · 다운으로 채우기');
      // recent style+seed re-roll (loop)
      var hist=[];
      try{ hist=JSON.parse(localStorage.getItem('mw_style_hist')||'[]'); }catch(e){}
      var strip=document.getElementById('styleHist');
      if(!strip){
        strip=document.createElement('div'); strip.id='styleHist';
        strip.style.cssText='display:flex;flex-wrap:wrap;gap:6px;margin-top:6px';
        if(el.parentNode) el.parentNode.appendChild(strip);
      }
      strip.innerHTML=hist.slice(0,5).map(function(h,i){
        return '<button type="button" class="sec" data-rh="'+i+'" style="padding:6px 10px;font-size:11px">'+(h.style||'?')+' #'+String(h.seed).slice(0,4)+'</button>';
      }).join('')||'<span class="hint">생성하면 최근 시드가 여기 쌓입니다</span>';
      Array.prototype.forEach.call(strip.querySelectorAll('[data-rh]'),function(b){
        b.onclick=function(){
          var h=hist[+b.getAttribute('data-rh')]; if(!h)return;
          pushSeedSnap();
          state.style=h.style; state.seed=h.seed; state.bright=h.bright!=null?h.bright:state.bright;
          document.getElementById('seed').value=state.seed;
          if(document.getElementById('bright')) document.getElementById('bright').value=state.bright;
          renderChips(); paintPreview();
          try{legionTrack('activate',{reroll:1,style:h.style})}catch(e){}
        };
      });
    }catch(e){}
  }
  function pushStyleHist(){
    try{
      var hist=JSON.parse(localStorage.getItem('mw_style_hist')||'[]');
      hist.unshift({style:state.style,seed:state.seed,bright:state.bright,t:Date.now()});
      // dedupe consecutive same
      if(hist[1]&&hist[1].style===hist[0].style&&hist[1].seed===hist[0].seed) hist.splice(1,1);
      localStorage.setItem('mw_style_hist',JSON.stringify(hist.slice(0,12)));
    }catch(e){}
  }
  document.getElementById('rand').onclick = function () {
    pushSeedSnap();
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
  if(!document.getElementById('exportFavs')){
    var ef=document.createElement('button'); ef.id='exportFavs'; ef.className='sec'; ef.textContent='⬇ 즐겨찾기';
    ef.onclick=function(){
      try{
        var payload={app:'mac-wallpaper',exportedAt:new Date().toISOString(),favs:loadFavs()};
        var blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
        var a=document.createElement('a'); a.href=URL.createObjectURL(blob);
        a.download='mac-favs-'+dayKey().replace(/\//g,'-')+'.json'; a.click();
        setTimeout(function(){URL.revokeObjectURL(a.href);},1500);
        try{legionTrack('export',{n:loadFavs().length})}catch(e){}
      }catch(e){}
    };
    document.getElementById('fav').parentNode.appendChild(ef);
    var il=document.createElement('label'); il.className='sec'; il.style.cssText='display:inline-block;padding:11px 14px;border-radius:10px;cursor:pointer;font-weight:700';
    il.textContent='⬆ 즐겨찾기 복원';
    var fi=document.createElement('input'); fi.type='file'; fi.accept='application/json,.json'; fi.style.display='none';
    fi.onchange=function(){
      if(!fi.files||!fi.files[0])return;
      var r=new FileReader();
      r.onload=function(){
        try{
          var p=JSON.parse(r.result);
          var arr=Array.isArray(p)?p:(p&&p.favs)||[];
          if(!arr.length) throw new Error('empty');
          var cur=loadFavs();
          arr.forEach(function(f){ if(f&&f.style!=null) cur.unshift(f); });
          saveFavs(cur); renderFavs();
          try{legionTrack('import',{n:arr.length})}catch(e){}
        }catch(e){ alert('즐겨찾기 JSON을 확인해 주세요'); }
      };
      r.readAsText(fi.files[0]); fi.value='';
    };
    il.appendChild(fi);
    document.getElementById('fav').parentNode.appendChild(il);
  }
  document.getElementById('fav').onclick = function () {
    var favs = loadFavs();
    favs.unshift({ style: state.style, seed: state.seed, bright: state.bright, sizeId: state.size.id, t: Date.now() });
    saveFavs(favs);
    renderFavs();
    try { legionTrack('activate', { fav: 1 }); } catch (e) {}
  };
  if(!document.getElementById('copySeed')){
    var cs=document.createElement('button'); cs.id='copySeed'; cs.className='sec'; cs.textContent='시드 복사';
    cs.onclick=function(){ var text=state.style+' seed='+state.seed; if(navigator.clipboard)navigator.clipboard.writeText(text); };
    document.getElementById('share').parentNode.appendChild(cs);
  }
  document.getElementById('share').onclick = function () {
    var kid='';
    try{
      kid=localStorage.getItem('mw_k_id');
      if(!kid){kid='m'+Math.random().toString(36).slice(2,8);localStorage.setItem('mw_k_id',kid);}
    }catch(e){}
    var url = 'https://hosuman08-netizen.github.io/mac-wallpaper/?style=' + encodeURIComponent(state.style)
      + '&seed=' + state.seed
      + '&bright=' + encodeURIComponent(state.bright)
      + '&size=' + encodeURIComponent(state.size.id)
      + '&ref=' + encodeURIComponent(kid);
    var text = 'Mac Wallpaper · ' + state.style + ' seed ' + state.seed + ' · ' + state.size.w + '×' + state.size.h + '\n' + url;
    if (navigator.share) navigator.share({text:text,url:url}).catch(function(){ if(navigator.clipboard) navigator.clipboard.writeText(text); });
    else if (navigator.clipboard) navigator.clipboard.writeText(text);
    try { legionTrack('share_peak', { style: state.style, k: 1 }); } catch (e) {}
    var n=document.getElementById('hint'); if(n) n.textContent='공유 링크 복사 · K-ref ON';
  };
  // last downloads quick restore strip
  function pushDlHist(){
    try{
      var h=JSON.parse(localStorage.getItem('mw_dl_hist')||'[]');
      h.unshift({style:state.style,seed:state.seed,bright:state.bright,sizeId:state.size.id,t:Date.now()});
      localStorage.setItem('mw_dl_hist',JSON.stringify(h.slice(0,8)));
      renderDlHist();
    }catch(e){}
  }
  function renderDlHist(){
    try{
      var box=document.getElementById('dlHist');
      if(!box){
        box=document.createElement('div'); box.id='dlHist'; box.className='row'; box.style.cssText='gap:6px;flex-wrap:wrap;margin-top:8px';
        var fav=document.getElementById('favList'); if(fav&&fav.parentNode) fav.parentNode.appendChild(box);
        else (document.getElementById('app')||document.body).appendChild(box);
      }
      var h=JSON.parse(localStorage.getItem('mw_dl_hist')||'[]');
      if(!h.length){box.innerHTML='<span class="hint">최근 다운로드 없음</span>';return;}
      box.innerHTML='<span class="hint">최근 DL · </span>'+h.slice(0,5).map(function(f,i){
        return '<button type="button" class="chip" data-dlh="'+i+'">'+f.style+'·'+f.seed+'</button>';
      }).join('');
      Array.prototype.forEach.call(box.querySelectorAll('[data-dlh]'),function(b){
        b.onclick=function(){
          var f=h[+b.getAttribute('data-dlh')]; if(!f)return;
          state.style=f.style; state.seed=f.seed; state.bright=f.bright||100;
          var sz=SIZES.find(function(x){return x.id===f.sizeId;}); if(sz) state.size=sz;
          document.getElementById('seed').value=state.seed;
          document.getElementById('bright').value=state.bright;
          renderChips(); paintPreview();
        };
      });
    }catch(e){}
  }

  // daily seed of day + streak helpers
  function dayKey(){
    var d=new Date();
    return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
  }
  function bumpDlStreak(){
    try{
      var st=JSON.parse(localStorage.getItem('mw_streak')||'{}');
      var t=dayKey();
      if(st.last===t) return st;
      var y=new Date(); y.setDate(y.getDate()-1);
      var yk=y.getFullYear()+'-'+(y.getMonth()+1)+'-'+y.getDate();
      st.count=(st.last===yk)?(st.count||0)+1:1;
      st.last=t;
      localStorage.setItem('mw_streak',JSON.stringify(st));
      try{legionTrack('streak',{count:st.count})}catch(e){}
      return st;
    }catch(e){return {count:0};}
  }

  // URL params (full state restore: style/seed/bright/size)
  try {
    var q = new URLSearchParams(location.search);
    if (q.get('style')) state.style = q.get('style');
    if (q.get('seed')) { state.seed = +q.get('seed') || state.seed; try{localStorage.setItem('mw_seed_touched','1');}catch(e){} }
    else if (!localStorage.getItem('mw_seed_touched')) {
      // seed of day (deterministic)
      var t=dayKey();
      var h=0; for(var i=0;i<t.length;i++) h=(h*31+t.charCodeAt(i))>>>0;
      state.seed = (h % 900000) + 42;
    }
    if (q.get('bright')) {
      var br = +q.get('bright');
      if (br >= 60 && br <= 140) state.bright = br;
    }
    if (q.get('size')) {
      var sz = SIZES.find(function (x) { return x.id === q.get('size'); });
      if (sz) state.size = sz;
    }
    document.getElementById('seed').value = state.seed;
    var brightEl = document.getElementById('bright');
    if (brightEl) brightEl.value = state.bright;
  } catch (e) {}

  try{
    var qref=new URLSearchParams(location.search||'');
    var ref=qref.get('ref');
    if(ref && !localStorage.getItem('mw_k_from')){ localStorage.setItem('mw_k_from',ref); try{legionTrack('k_link',{from:ref})}catch(e){} }
  }catch(e){}
  renderChips();
  renderFavs();
  paintPreview();
  renderDlHist();
  try { legionTrack('session_start', { app: 'mac-wallpaper' }); } catch (e) {}

  (function(){try{
    if(document.getElementById('moneyPipe'))return;
    var d=document.createElement('div');
    d.innerHTML='\n<div id="moneyPipe" style="margin-top:12px;padding:10px;border:1px solid #c5a46e44;border-radius:12px;background:#16121c;text-align:center;font-size:12px">\n  <div style="color:#e0b552;font-weight:700;margin-bottom:4px">💎 후원 · 파이프 (엔터 18+)</div>\n  <p style="opacity:.75;margin:0 0 6px">가상 체험 · 실결제 백엔드 없음 · 문의만</p>\n  <a style="color:#ece8f1;margin:0 6px" href="mailto:hoyashi95@gmail.com?subject=%5BLegion%5D%20support">☕ 후원 문의</a>\n  <a style="color:#e0b552;margin:0 6px" href="https://hosuman08-netizen.github.io/legion-hub/?utm_source=pipe&utm_medium=app">🎮 Arcade</a>\n</div>\n';
    var app=document.getElementById('app')||document.body;
    app.appendChild(d.firstElementChild||d);
    try{legionTrack('money_pipe_shown',{app:'auto'})}catch(e){}
  }catch(e){}})();

})();
/* LEGION_WAVE_40_wave_stamp */ /* ship wave 40 2026-07-21T07:42:49 */
