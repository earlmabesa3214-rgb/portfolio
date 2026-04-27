
// Typing effect
(function(){
  const el = document.getElementById('typed');
  const words = ['full-stack web apps', '3D web experiences', 'UI/UX', 'clean, fast UIs', 'application development'];
  let wi=0, ci=0, deleting=false;
  function tick(){
    const w = words[wi];
    el.textContent = deleting ? w.substring(0, ci--) : w.substring(0, ci++);
    if(!deleting && ci === w.length+1){ deleting=true; setTimeout(tick, 1400); return; }
    if(deleting && ci === 0){ deleting=false; wi=(wi+1)%words.length; }
    setTimeout(tick, deleting ? 40 : 70);
  }
  tick();
})();

// Reveal on scroll
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('visible'); obs.unobserve(e.target); } });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// Nav scroll effect
window.addEventListener('scroll', () => {
  const nav = document.querySelector('nav');
  nav.style.background = scrollY > 50 ? 'rgba(10,14,20,.92)' : 'rgba(10,14,20,.75)';
});

// Tech category filter
document.querySelectorAll('.tech-cat-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tech-cat-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.cat;
    document.querySelectorAll('.tech-card').forEach(card => {
      card.style.display = (cat === 'all' || card.dataset.cat === cat) ? '' : 'none';
    });
  });
});
// Code Rain background
(function(){
  const canvas = document.getElementById('canvas3d');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize(){
    canvas.width  = innerWidth;
    canvas.height = innerHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); init(); });

  // Dev-flavored symbols — real code tokens
  const chars = [
    'const','let','var','function','return','import','export','default',
    'async','await','class','extends','=>','{}','[]','()','&&','||','??',
    '===','!==','...','true','false','null','undefined','void','typeof',
    'if','else','for','while','try','catch','new','this','super',
    'React','Laravel','Django','Three','MySQL','Git',
    'npm','tsx','jsx','php','py','sql','css','html',
    '</>','{ }','[ ]','#!/','@','#','//','/*','*/',
    '0x','px','rem','vh','vw','%','::','->',
    '01','10','11','00','ff','aa','7e','3d',
  ];

  const COLS    = Math.floor(innerWidth / 22);
  const FONTSIZE = 13;

  let drops = [];
  let speeds = [];
  let opacities = [];
  let charSets = []; // each column has its own char sequence

  // Column color palette — accent colors from your CSS vars
  const colors = [
    '#58a6ff','#58a6ff','#58a6ff', // blue — dominant
    '#7ee787',                      // green
    '#d2a8ff',                      // purple
    '#79c0ff',                      // lighter blue
    '#8b949e',                      // muted — rare
  ];

  function randomColor(){
    return colors[Math.floor(Math.random() * colors.length)];
  }

  function init(){
    drops    = [];
    speeds   = [];
    opacities = [];
    charSets = [];
    const cols = Math.floor(canvas.width / 22);
    for(let i = 0; i < cols; i++){
      drops[i]    = -(Math.random() * canvas.height / FONTSIZE);
  speeds[i]   = 0.06 + Math.random() * 0.09;
   opacities[i] = 0.06 + Math.random() * 0.10;
      charSets[i]  = {
        color: randomColor(),
        tokens: Array.from({ length: 40 }, () => chars[Math.floor(Math.random() * chars.length)]),
        idx: 0,
        tickRate: 4 + Math.floor(Math.random() * 8), // how many frames before next char
        tick: 0,
      };
    }
  }
  init();

  let frame = 0;
  function draw(){
    requestAnimationFrame(draw);
    frame++;

ctx.fillStyle = 'rgba(10,14,20,0.12)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const cols = Math.floor(canvas.width / 22);

    for(let i = 0; i < cols; i++){
      const cs   = charSets[i];
      const drop = drops[i];
      const y    = Math.floor(drop) * FONTSIZE;

      // Advance character on this column's tick
      cs.tick++;
      if(cs.tick >= cs.tickRate){
        cs.tick = 0;
        cs.idx  = (cs.idx + 1) % cs.tokens.length;
      }

      const token = cs.tokens[cs.idx];

      // Head char — bright white/accent glow
      ctx.font        = `500 ${FONTSIZE}px 'Fira Code', monospace`;
      ctx.fillStyle   = '#e6edf3';
ctx.globalAlpha = Math.min(opacities[i] * 2.2, 0.45);
      ctx.shadowColor = cs.color;
      ctx.shadowBlur  = 4;
      ctx.fillText(token, i * 22, y);

      // Body — column color, fading
      ctx.fillStyle   = cs.color;
      ctx.shadowBlur  = 0;
      ctx.globalAlpha = opacities[i];
      for(let j = 1; j <= 18; j++){
        const fadedAlpha = opacities[i] * (1 - j / 20);
        if(fadedAlpha < 0.01) continue;
        ctx.globalAlpha = fadedAlpha;
        const pastToken = cs.tokens[(cs.idx - j * 2 + cs.tokens.length) % cs.tokens.length];
        ctx.fillText(pastToken, i * 22, y - j * FONTSIZE);
      }

      ctx.globalAlpha = 1;
      ctx.shadowBlur  = 0;

      // Advance drop
      drops[i] += speeds[i];
      if(drops[i] * FONTSIZE > canvas.height + 100){
        drops[i]     = -(5 + Math.random() * 25);
speeds[i]    = 0.06 + Math.random() * 0.09;
        opacities[i] = 0.06 + Math.random() * 0.10;
        // Occasionally change color and token set on reset
        if(Math.random() > 0.6){
          cs.color  = randomColor();
          cs.tokens = Array.from({ length: 40 }, () => chars[Math.floor(Math.random() * chars.length)]);
          cs.tickRate = 4 + Math.floor(Math.random() * 8);
        }
      }
    }
  }
  draw();
})();
