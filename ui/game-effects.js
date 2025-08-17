
// ui/game-effects.js — robust backgrounds + stars; safe with shop modal
(function(){
  function $(s, r=document){ return r.querySelector(s); }
  function $all(s, r=document){ return Array.from(r.querySelectorAll(s)); }

  // Create two BG layers always
  let bgColor, bgMascot;
  function ensureBg(){
    if (!bgColor){
      bgColor = document.createElement('div'); bgColor.id='kp-bg-color'; bgColor.className='kp-bg-layer';
      document.body.appendChild(bgColor);
    }
    if (!bgMascot){
      bgMascot = document.createElement('div'); bgMascot.id='kp-bg-mascot'; bgMascot.className='kp-bg-layer';
      document.body.appendChild(bgMascot);
    }
  }

  function setMode(mode){
    ensureBg();
    bgColor.classList.remove('show');
    bgMascot.classList.remove('show');
    if (mode === 'color') bgColor.classList.add('show');
    else if (mode === 'mascot') bgMascot.classList.add('show');
  }

  function starBurst(x, y, n=3){
    for (let i=0;i<n;i++){
      const s = document.createElement('div');
      s.className = 'kp-star'; s.textContent = '⭐';
      s.style.left = (x + (Math.random()*24-12)) + 'px';
      s.style.top  = (y + (Math.random()*10-5)) + 'px';
      document.body.appendChild(s);
      setTimeout(()=> s.remove(), 1300);
    }
  }

  // Stars on correct clicks
  function bindCorrect(){
    document.addEventListener('click', (e)=>{
      const btn = e.target.closest('[data-correct]');
      if (!btn) return;
      if (btn.getAttribute('data-correct') !== '1') return;
      const r = btn.getBoundingClientRect();
      starBurst(r.left + r.width/2, r.top + r.height/2, 3);
    }, true);
  }

  // Detect mode by containers visibility or button text/ids
  function detectByContainers(){
    const colorSel = '#color-game, #colorGame, .color-game';
    const mascotSel = '#mascot-game, #mascotGame, .mascot-game';
    const check = ()=>{
      const hasColor = !!$(colorSel);
      const hasMascot = !!$(mascotSel);
      if (hasColor && !hasMascot) setMode('color');
      else if (hasMascot && !hasColor) setMode('mascot');
    };
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.body, {childList:true, subtree:true});
  }

  function detectByButtons(){
    const sel = ['#colorBtn','.btn-color','[data-action=\"start-color\"]',
                 '#mascotBtn','.btn-mascot','[data-action=\"start-mascot\"]',
                 'button','.btn','.menu button'];
    document.addEventListener('click', (e)=>{
      const b = e.target.closest(sel.join(','));
      if (!b) return;
      const t = (b.getAttribute('data-action') || b.id || b.className || b.textContent || '').toLowerCase();
      if (t.includes('color')) setMode('color');
      else if (t.includes('mascot')) setMode('mascot');
    }, true);
  }

  // Expose API
  window.KPEffects = { setMode, starBurst };

  function init(){
    ensureBg();
    bindCorrect();
    detectByContainers();
    detectByButtons();
  }
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
