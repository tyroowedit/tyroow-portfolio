/* ============================================
   tyroow's portfolio — behavior
   (video data lives in videos.js, loaded before this file)
   ============================================ */

const i18n = {
  pt:{
    nav_home:"Início", nav_edits:"Edições", nav_about:"Sobre", nav_contact:"Contato",
    hero_title:"tyroow<span>'s</span> portfolio",
    hero_sub:"Editor de vídeo criando shorts e cortes longos que prendem a atenção do início ao fim.",
    scroll:"role",
    channel_label:"Canal",
    dark_tag:"// CANAL DARK //",
    watch_yt:"@DexLore &nbsp;→&nbsp; assistir no YouTube",
    archive_label:"Arquivo",
    edits_title:"Edições Gerais",
    about_label:"Sobre",
    about_title:"Feito para o corte que prende quem assiste.",
    about_p1:"Passo mais tempo numa timeline do que a maioria passa numa mesa de trabalho, e isso mostra no resultado. Meu estilo é feito pra prender rápido e manter: ritmo certeiro, som bem trabalhado e cortes que respeitam quem está assistindo.",
    about_p2:"Seja um short de 30 segundos sobre lore de Pokémon ou uma edição longa, o objetivo é sempre o mesmo: ser impossível de rolar pra frente.",
    stat1_val:"2+", stat1_label:"ANOS EDITANDO",
    stat2_label:"CANAL PRÓPRIO",
    stat3_val:"SHORTS + LONGOS", stat3_label:"FORMATO",
    about_visual:"[ seu clipe de tela editando, borrado, pode ficar aqui também ]",
    contact_label:"Contato",
    contact_title:"<span>o SEU</span> novo editor, só chamar!",
    contact_sub:"Chama na plataforma que for mais fácil pra você, eu acompanho todas.",
    footer:"© 2026 tyroow. Feito do zero, hospedado no GitHub Pages.",
    modal_placeholder:"Player do YouTube aparece aqui",
    tap_watch:"TOQUE PRA ASSISTIR",
    video_label:"Vídeo",
    add_id:"Adicione o ID do YouTube",
    discord_copied:"copiado!"
  },
  en:{
    nav_home:"Home", nav_edits:"Edits", nav_about:"About", nav_contact:"Contact",
    hero_title:"tyroow<span>'s</span> portfolio",
    hero_sub:"Video editor crafting shorts and long form cuts that hold attention start to finish.",
    scroll:"scroll",
    channel_label:"Channel",
    dark_tag:"// DARK CHANNEL //",
    watch_yt:"@DexLore &nbsp;→&nbsp; watch on YouTube",
    archive_label:"Archive",
    edits_title:"General Edits",
    about_label:"About",
    about_title:"Built for the cut that keeps people watching.",
    about_p1:"I spend more time on a timeline than most people spend at a desk, and it shows in the result. My style is built to hook fast and hold: sharp pacing, deliberate sound design, and cuts that respect the viewer's attention.",
    about_p2:"Whether it's a 30 second Pokémon lore short or a long form breakdown, the goal is the same: make it impossible to scroll past.",
    stat1_val:"2+", stat1_label:"YEARS EDITING",
    stat2_label:"OWN CHANNEL",
    stat3_val:"SHORTS + LONG", stat3_label:"FORMAT",
    about_visual:"[ your blurred editing desk clip could live here too ]",
    contact_label:"Contact",
    contact_title:"<span>your new</span> editor, just call!",
    contact_sub:"Reach out on whichever platform is easiest for you, I check all of them.",
    footer:"© 2026 tyroow. Built from scratch, hosted on GitHub Pages.",
    modal_placeholder:"YouTube player appears here",
    tap_watch:"TAP TO WATCH",
    video_label:"Video",
    add_id:"Add your YouTube ID",
    discord_copied:"copied!"
  }
};
let currentLang = 'pt';

function applyLang(lang){
  currentLang = lang;
  document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if(i18n[lang][key] !== undefined) el.innerHTML = i18n[lang][key];
  });
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
  renderGrid('dexloreGrid', dexloreVideos);
  renderGrid('editsGrid', generalEdits);
}
document.querySelectorAll('.lang-btn').forEach(btn=>{
  btn.addEventListener('click', ()=> applyLang(btn.dataset.lang));
});

function thumbUrl(id){
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

function renderGrid(containerId, data){
  const el = document.getElementById(containerId);
  const t = i18n[currentLang];
  el.innerHTML = data.map((v, i) => {
    const label = (v.title && v.title.trim()) ? v.title : `${t.video_label} ${i+1}`;
    const bg = v.youtubeId
      ? `background-image:url('${thumbUrl(v.youtubeId)}');`
      : `background:linear-gradient(145deg,#1a1622,#000);`;
    return `
    <div class="card ${v.wide ? 'wide' : ''}" data-container="${containerId}" data-index="${i}">
      <div class="thumb" style="${bg}">
        <div class="play-icon"></div>
      </div>
      <div class="meta">
        <h4>${label}</h4>
        <p>${v.youtubeId ? t.tap_watch : t.add_id}</p>
      </div>
    </div>
  `;}).join('');
}
renderGrid('dexloreGrid', dexloreVideos);
renderGrid('editsGrid', generalEdits);

const overlay = document.getElementById('modalOverlay');
const modalTitle = document.getElementById('modalTitle');
const modalVideo = document.getElementById('modalVideo');

document.body.addEventListener('click', (e) => {
  const card = e.target.closest('.card');
  if(!card) return;
  const source = card.dataset.container === 'dexloreGrid' ? dexloreVideos : generalEdits;
  const v = source[card.dataset.index];
  const t = i18n[currentLang];
  modalTitle.textContent = (v.title && v.title.trim()) ? v.title : `${t.video_label} ${parseInt(card.dataset.index)+1}`;
  modalVideo.innerHTML = v.youtubeId
    ? `<iframe src="https://www.youtube.com/embed/${v.youtubeId}" allow="autoplay; encrypted-media" allowfullscreen></iframe>`
    : t.modal_placeholder;
  overlay.classList.add('open');
});
document.getElementById('modalClose').addEventListener('click', () => overlay.classList.remove('open'));
overlay.addEventListener('click', (e) => { if(e.target === overlay) overlay.classList.remove('open'); });

/* ---- discord: no public link possible, so copy the username instead ---- */
const discordBtn = document.getElementById('discordCopy');
const discordLabel = document.getElementById('discordLabel');
if(discordBtn){
  discordBtn.addEventListener('click', () => {
    const username = 'tyroow';
    navigator.clipboard.writeText(username).catch(()=>{});
    const original = discordLabel.textContent;
    discordLabel.textContent = i18n[currentLang].discord_copied;
    setTimeout(() => { discordLabel.textContent = original; }, 1500);
  });
}

/* ---- mobile hamburger menu ---- */
const hamburgerBtn = document.getElementById('hamburgerBtn');
const navLinks = document.querySelector('.nav-links');
if(hamburgerBtn){
  hamburgerBtn.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));
}

/* ---- fade-in reveal on scroll ---- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ---- network canvas, global fixed background ---- */
const canvas = document.getElementById('netCanvas');
const ctx = canvas.getContext('2d');
let w, h, nodes;
function resize(){
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
function initNodes(){
  nodes = Array.from({length:44}, () => ({
    x: Math.random()*w, y: Math.random()*h,
    vx: (Math.random()-.5)*.2, vy: (Math.random()-.5)*.2
  }));
}
window.addEventListener('resize', () => { resize(); });
resize(); initNodes();

function tick(){
  ctx.clearRect(0,0,w,h);
  nodes.forEach(n => {
    n.x += n.vx; n.y += n.vy;
    if(n.x < 0 || n.x > w) n.vx *= -1;
    if(n.y < 0 || n.y > h) n.vy *= -1;
  });
  for(let i=0;i<nodes.length;i++){
    for(let j=i+1;j<nodes.length;j++){
      const dx = nodes[i].x-nodes[j].x, dy = nodes[i].y-nodes[j].y;
      const dist = Math.sqrt(dx*dx+dy*dy);
      if(dist < 150){
        ctx.strokeStyle = `rgba(220,38,38,${(1-dist/150)*0.22})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.stroke();
      }
    }
    ctx.fillStyle = 'rgba(220,38,38,0.85)';
    ctx.beginPath();
    ctx.arc(nodes[i].x, nodes[i].y, 1.5, 0, Math.PI*2);
    ctx.fill();
  }
  requestAnimationFrame(tick);
}
tick();
