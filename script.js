/* ============================================
   tyroow — behavior
   (video data lives in videos.js, loaded before this file)
   ============================================ */

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/* ---------------- i18n ---------------- */
const i18n = {
  en:{
    nav_home:"Home", nav_work:"Work", nav_about:"About", nav_contact:"Contact",
    hero_title:"tyroow<span class=\"accent\">.</span>",
    hero_sub:"Video editor. Shorts and long-form cuts built to hold attention, not lose it.",
    cta_work:"SEE MY WORK", cta_contact:"GET IN TOUCH",
    scroll:"SCROLL",
    work_label:"Selected Work", work_title:"Edits",
    about_label:"About",
    about_text:"I spend more time on a timeline than most people spend at a desk. <span>Every cut has a purpose,</span> from the first second to the last.",
    stat1_val:"3+", stat1_label:"YEARS EDITING",
    stat2_val:"100%", stat2_label:"HANDCODED SITE",
    stat3_val:"SHORT+LONG", stat3_label:"FORMAT",
    contact_label:"Contact",
    contact_title:"let's make <span class=\"accent\">something.</span>",
    contact_sub:"Hit me up on whichever platform's easiest, I check all of them.",
    footer:"© 2026 tyroow. Built from scratch, hosted on GitHub Pages.",
    modal_placeholder:"YouTube player appears here",
    tap_watch:"TAP TO WATCH", video_label:"Video", add_id:"Add your YouTube ID",
    discord_copied:"copied!",
    marquee:["PREMIERE PRO","COLOR GRADING","SOUND DESIGN","MOTION GRAPHICS","FAST CUTS","STORYTELLING"]
  },
  pt:{
    nav_home:"Início", nav_work:"Trabalhos", nav_about:"Sobre", nav_contact:"Contato",
    hero_title:"tyroow<span class=\"accent\">.</span>",
    hero_sub:"Editor de vídeo. Shorts e cortes longos feitos pra prender a atenção, não perder ela.",
    cta_work:"VER TRABALHOS", cta_contact:"FALAR COMIGO",
    scroll:"ROLE",
    work_label:"Trabalhos", work_title:"Edições",
    about_label:"Sobre",
    about_text:"Passo mais tempo numa timeline do que a maioria passa numa mesa. <span>Cada corte tem um propósito,</span> do primeiro segundo ao último.",
    stat1_val:"3+", stat1_label:"ANOS EDITANDO",
    stat2_val:"100%", stat2_label:"SITE FEITO DO ZERO",
    stat3_val:"SHORTS+LONGOS", stat3_label:"FORMATO",
    contact_label:"Contato",
    contact_title:"vamos criar <span class=\"accent\">algo.</span>",
    contact_sub:"Chama na plataforma que for mais fácil, eu acompanho todas.",
    footer:"© 2026 tyroow. Feito do zero, hospedado no GitHub Pages.",
    modal_placeholder:"Player do YouTube aparece aqui",
    tap_watch:"TOQUE PRA ASSISTIR", video_label:"Vídeo", add_id:"Adicione o ID do YouTube",
    discord_copied:"copiado!",
    marquee:["PREMIERE PRO","COLOR GRADING","SOM","MOTION GRAPHICS","CORTES DINÂMICOS","STORYTELLING"]
  }
};
let currentLang = 'en';

function renderMarquee(){
  const words = i18n[currentLang].marquee;
  const html = words.map(w => `<span>${w}</span>`).join('') ;
  document.getElementById('marqueeTrack').innerHTML = html + html; // duplicated for seamless loop
}

function applyLang(lang){
  currentLang = lang;
  document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if(i18n[lang][key] !== undefined) el.innerHTML = i18n[lang][key];
  });
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
  renderGrid();
  renderMarquee();
}
document.querySelectorAll('.lang-btn').forEach(btn => btn.addEventListener('click', () => applyLang(btn.dataset.lang)));

/* ---------------- video grid ---------------- */
function thumbUrl(id){ return `https://img.youtube.com/vi/${id}/hqdefault.jpg`; }

function renderGrid(){
  const el = document.getElementById('workGrid');
  const t = i18n[currentLang];
  el.innerHTML = videos.map((v, i) => {
    const label = (v.title && v.title.trim()) ? v.title : `${t.video_label} ${i+1}`;
    const bg = v.youtubeId ? `background-image:url('${thumbUrl(v.youtubeId)}');` : `background:linear-gradient(145deg,#1a1414,#000);`;
    return `
    <div class="card ${v.wide ? 'wide' : ''}" data-index="${i}">
      <div class="thumb" style="${bg}"><div class="play-icon"></div></div>
      <div class="meta"><h4>${label}</h4><p>${v.youtubeId ? t.tap_watch : t.add_id}</p></div>
    </div>`;
  }).join('');
  if(isDesktop && !reducedMotion) attachTilt();
}
renderGrid();
renderMarquee();

/* ---------------- modal ---------------- */
const overlay = document.getElementById('modalOverlay');
const modalTitle = document.getElementById('modalTitle');
const modalVideo = document.getElementById('modalVideo');

/* YouTube IFrame API — loaded once, on demand, so the first
   video played always jumps straight to the highest quality
   the connection allows instead of YouTube's slow-start default. */
let ytApiReady = false;
let ytApiLoading = false;
let ytPlayer = null;

function loadYouTubeAPI(cb){
  if(ytApiReady){ cb(); return; }
  const prevCb = window.onYouTubeIframeAPIReady;
  window.onYouTubeIframeAPIReady = () => { ytApiReady = true; if(prevCb) prevCb(); cb(); };
  if(!ytApiLoading){
    ytApiLoading = true;
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);
  } else if(ytApiReady){
    cb();
  }
}

function forceMaxQuality(player){
  try{
    const levels = player.getAvailableQualityLevels();
    if(levels && levels.length){ player.setPlaybackQuality(levels[0]); } // levels[0] = best available
    else { player.setPlaybackQuality('hd2160'); }
  }catch(e){ /* no-op, just falls back to YouTube default */ }
}

function openModal(index){
  const v = videos[index];
  const t = i18n[currentLang];
  modalTitle.textContent = (v.title && v.title.trim()) ? v.title : `${t.video_label} ${index+1}`;

  if(v.youtubeId){
    modalVideo.innerHTML = `<div id="ytPlayer"></div>`;
    loadYouTubeAPI(() => {
      ytPlayer = new YT.Player('ytPlayer', {
        videoId: v.youtubeId,
        playerVars: { autoplay: 1, rel: 0, modestbranding: 1, playsinline: 1, vq: 'hd1080' },
        events: {
          onReady: (e) => { forceMaxQuality(e.target); e.target.playVideo(); },
          onPlaybackQualityChange: (e) => { forceMaxQuality(e.target); }
        }
      });
    });
  } else {
    modalVideo.innerHTML = t.modal_placeholder;
  }
  overlay.classList.add('open');
}
document.body.addEventListener('click', (e) => {
  const card = e.target.closest('.card');
  if(!card) return;
  openModal(parseInt(card.dataset.index));
});
function closeModal(){
  overlay.classList.remove('open');
  if(ytPlayer && ytPlayer.destroy){ ytPlayer.destroy(); ytPlayer = null; }
  modalVideo.innerHTML = '';
}
document.getElementById('modalClose').addEventListener('click', closeModal);
overlay.addEventListener('click', (e) => { if(e.target === overlay) closeModal(); });
document.addEventListener('keydown', (e) => { if(e.key === 'Escape'){ closeModal(); } });

/* ---------------- discord copy ---------------- */
const discordBtn = document.getElementById('discordCopy');
const discordLabel = document.getElementById('discordLabel');
if(discordBtn){
  discordBtn.addEventListener('click', () => {
    navigator.clipboard.writeText('tyroow').catch(()=>{});
    const original = discordLabel.textContent;
    discordLabel.textContent = i18n[currentLang].discord_copied;
    setTimeout(() => { discordLabel.textContent = original; }, 1500);
  });
}

/* ---------------- mobile hamburger ---------------- */
const hamburgerBtn = document.getElementById('hamburgerBtn');
const navLinks = document.querySelector('.nav-links');
if(hamburgerBtn){
  hamburgerBtn.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));
}

/* ---------------- scroll progress bar ---------------- */
const scrollProgress = document.getElementById('scrollProgress');
function updateScrollProgress(){
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  scrollProgress.style.width = pct + '%';
}
window.addEventListener('scroll', updateScrollProgress, { passive: true });
updateScrollProgress();

/* ---------------- active nav link on scroll ---------------- */
const navAnchors = document.querySelectorAll('.nav-links a');
const sectionsForNav = [...navAnchors].map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      const id = '#' + entry.target.id;
      navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === id));
    }
  });
}, { threshold: 0.4, rootMargin: '-80px 0px -40% 0px' });
sectionsForNav.forEach(sec => navObserver.observe(sec));

/* ---------------- reveal on scroll ---------------- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){ entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ---------------- hero presentation video: sound toggle ---------------- */
const heroVideo = document.getElementById('heroVideo');
const soundToggle = document.getElementById('soundToggle');
const soundIcon = document.getElementById('soundIcon');
if(heroVideo && soundToggle){
  soundToggle.addEventListener('click', () => {
    heroVideo.muted = !heroVideo.muted;
    if(!heroVideo.muted){ heroVideo.play().catch(() => {}); }
    soundIcon.classList.toggle('fa-volume-xmark', heroVideo.muted);
    soundIcon.classList.toggle('fa-volume-high', !heroVideo.muted);
  });
  // assets/intro.mp4 not added yet (or failed to load) -> fall back gracefully, no broken player
  heroVideo.addEventListener('error', () => {
    document.getElementById('heroVideoWrap').classList.add('video-fallback');
  });
}

/* ---------------- spotlight (ambient, smoothed) + magnetic buttons ---------------- */
if(isDesktop && !reducedMotion){
  const spotlight = document.getElementById('spotlight');
  let targetX = window.innerWidth / 2, targetY = window.innerHeight * 0.4;
  let curX = targetX, curY = targetY;

  window.addEventListener('mousemove', (e) => { targetX = e.clientX; targetY = e.clientY; });

  function spotlightLoop(){
    curX += (targetX - curX) * 0.06;
    curY += (targetY - curY) * 0.06;
    spotlight.style.setProperty('--x', curX + 'px');
    spotlight.style.setProperty('--y', curY + 'px');
    requestAnimationFrame(spotlightLoop);
  }
  spotlightLoop();

  /* magnetic buttons — subtle pull, not a full drag */
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      const relX = e.clientX - r.left - r.width/2;
      const relY = e.clientY - r.top - r.height/2;
      btn.style.transform = `translate(${relX*0.12}px, ${relY*0.16}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = 'translate(0,0)'; });
  });
}

/* 3D tilt on video cards — subtle, instant while tracking the cursor,
   smooth only on the way back out. Re-attached whenever the grid re-renders. */
function attachTilt(){
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      card.style.transition = 'box-shadow .3s';
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(700px) rotateX(${py * -5}deg) rotateY(${px * 5}deg) scale(1.015)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'box-shadow .3s, transform .4s cubic-bezier(.2,.8,.2,1)';
      card.style.transform = '';
    });
  });
}
