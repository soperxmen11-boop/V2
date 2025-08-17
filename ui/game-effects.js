
// ui/game-effects.js — detect game mode, show BG, stars on correct
(function(){
  function $(s, r=document){ return r.querySelector(s); }
  function $all(s, r=document){ return Array.from(r.querySelectorAll(s)); }

  // create bg layer once
  let bg = document.createElement('div');
  bg.className = 'kp-game-bg';
  document.addEventListener('DOMContentLoaded', ()=> document.body.appendChild(bg));

  function setMode(mode){
    // mode: 'color' | 'mascot' | null
    bg.classList.remove('color','mascot');
    if (mode) {
      bg.classList.add(mode, 'show');
    } else {
      bg.classList.remove('show');
    }
  }

  // Try to infer mode from clicks on obvious buttons
  function bindModeButtons(){
    const sels = [
      '#colorBtn', '.btn-color', '[data-action="start-color"]',
      '#mascotBtn', '.btn-mascot', '[data-action="start-mascot"]',
      // generic fallbacks by text
      'button', '.btn', '.menu button'
    ];
    document.addEventListener('click', (e)=>{
      const b = e.target.closest(sels.join(','));
      if (!b) return;
      const t = (b.getAttribute('data-action') || b.id || b.className || b.textContent || '').toLowerCase();
      if (t.includes('color')) setMode('color');
      else if (t.includes('mascot')) setMode('mascot');
    }, true);
  }

  // Stars when correct
  function starsOnCorrect(){
    document.addEventListener('click', (e)=>{
      const target = e.target.closest('[data-correct]');
      if (!target) return;
      const ok = target.getAttribute('data-correct') === '1';
      if (!ok) return;
      // spawn a few stars from click position
      const rect = target.getBoundingClientRect();
      const x = rect.left + rect.width/2;
      const y = rect.top + rect.height/2;
      for (let i=0;i<3;i++){
        const s = document.createElement('div');
        s.className = 'kp-star';
        s.textContent = '⭐';
        s.style.left = (x + (Math.random()*24-12)) + 'px';
        s.style.top  = (y + (Math.random()*10-5)) + 'px';
        document.body.appendChild(s);
        setTimeout(()=> s.remove(), 1300);
      }
    }, true);
  }

  // Optional: if containers exist, set mode automatically when they become visible
  function autoDetectByContainers(){
    const colorSel = '#color-game, #colorGame, .color-game';
    const mascotSel = '#mascot-game, #mascotGame, .mascot-game';
    function check(){
      const colorVisible = !!$(colorSel);
      const mascotVisible = !!$(mascotSel);
      if (colorVisible && !mascotVisible) setMode('color');
      else if (mascotVisible && !colorVisible) setMode('mascot');
    }
    document.addEventListener('DOMContentLoaded', check);
    const obs = new MutationObserver(check);
    obs.observe(document.body, {childList:true, subtree:true});
  }

  function init(){
    bindModeButtons();
    starsOnCorrect();
    autoDetectByContainers();
  }
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
