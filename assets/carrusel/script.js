/* ============================================================
   CONFIGURACIÓN DE TUS PROYECTOS
   Edita este array para añadir/quitar proyectos.
   Las imágenes van en: /assets/carrusel/images/
   ============================================================ */
const PROJECTS = [
  {
    title: "BarberB",
    desc: "ERP modular para barberías y PYMEs: citas, inventario, usuarios, reportes y dashboard en tiempo real.",
    img: "images/barberb.png",
    link: "https://github.com/MikeBoss80/web_barberb",
    tech: "Django · MySQL · GCP"
  },
  {
    title: "Portafolio Web",
    desc: "Sitio web personal con experiencia profesional, proyectos destacados y sección de contacto.",
    img: "images/portafolio.png",
    link: "https://github.com/MikeBoss80/Portafolio",
    tech: "HTML · CSS · JavaScript"
  },
  {
    title: "Análisis COVID-19",
    desc: "Limpieza, análisis exploratorio y dashboard Power BI de datos de hospitalización del CDC.",
    img: "images/covid19.png",
    link: "https://github.com/MikeBoss80/covid_hospitalization_analysis",
    tech: "Python · Power BI"
  },
  {
    title: "Análisis de Reciclaje",
    desc: "Análisis de datos ambientales para visualización y apoyo a la toma de decisiones estratégicas.",
    img: "images/reciclaje.png",
    link: "https://github.com/MikeBoss80/prueba_data_analyst_cempre",
    tech: "Python · SQL"
  },
  {
    title: "Dashboard Transporte",
    desc: "Dashboard interactivo en Power BI para monitoreo y análisis de incidentes de transporte.",
    img: "images/dashboard-transporte.png",
    link: "https://github.com/MikeBoss80/power_bi_transport_incident_dashboard",
    tech: "Power BI"
  },
  {
    title: "Mattech",
    desc: "Proyecto de desarrollo y análisis orientado a soluciones tecnológicas con Python.",
    img: "images/mattech.png",
    link: "https://github.com/MikeBoss80/Mattech",
    tech: "Python"
  },
  {
    title: "Perfil README",
    desc: "Profile README interactivo con estadísticas, timeline y stack tecnológico completo.",
    img: "images/perfil-readme.png",
    link: "https://github.com/MikeBoss80/MikeBoss80",
    tech: "Markdown · SVG · JS"
  }
];

/* ============================================================
   MOTOR DEL CARRUSEL
   ============================================================ */
const track       = document.getElementById("track");
const reflection  = document.getElementById("reflection");
const dotsWrap    = document.getElementById("dots");
const prevBtn     = document.getElementById("prev");
const nextBtn     = document.getElementById("next");
const infoTitle   = document.getElementById("infoTitle");
const infoDesc    = document.getElementById("infoDesc");
const infoLink    = document.getElementById("infoLink");
const carousel    = document.getElementById("carousel");

const N           = PROJECTS.length;
const angleStep   = 360 / N;           // grados entre tarjetas
const radius      = Math.max(380, N * 58); // radio del círculo 3D
let   currentIndex = 0;
let   rotation     = 0;
let   autoplayId   = null;

/* ---------- Crear tarjetas ---------- */
function buildCards() {
  PROJECTS.forEach((p, i) => {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.index = i;
    card.innerHTML = `
      <img src="${p.img}" alt="${p.title}" loading="lazy" />
      <div class="card__overlay">
        <h3>${p.title}</h3>
      </div>
    `;
    track.appendChild(card);

    // Reflejo (copia)
    const ref = card.cloneNode(true);
    reflection.appendChild(ref);
  });
}

/* ---------- Crear dots ---------- */
function buildDots() {
  PROJECTS.forEach((_, i) => {
    const d = document.createElement("span");
    d.className = "dot";
    d.addEventListener("click", () => goTo(i));
    dotsWrap.appendChild(d);
  });
}

/* ---------- Posicionar tarjetas en círculo 3D ---------- */
function layout() {
  const cards = track.querySelectorAll(".card");
  const refs  = reflection.querySelectorAll(".card");

  cards.forEach((card, i) => {
    const angle = angleStep * i;
    card.style.transform = `rotateY(${angle}deg) translateZ(${radius}px)`;
  });
  refs.forEach((card, i) => {
    const angle = angleStep * i;
    card.style.transform = `rotateY(${angle}deg) translateZ(${radius}px)`;
  });
}

/* ---------- Actualizar estado visual ---------- */
function updateActive() {
  const cards = track.querySelectorAll(".card");
  const dots  = dotsWrap.querySelectorAll(".dot");

  cards.forEach((c, i) => {
    const isActive = i === currentIndex;
    c.classList.toggle("is-active", isActive);

    // Blur + escala según distancia al índice activo
    const dist = shortestDistance(i, currentIndex);
    const blur = Math.min(dist * 3, 8);
    const scale = 1 - Math.min(dist * 0.08, 0.3);
    const opacity = 1 - Math.min(dist * 0.15, 0.6);

    c.style.filter = isActive
      ? "drop-shadow(0 20px 40px rgba(79,124,255,.35))"
      : `blur(${blur}px)`;
    c.style.opacity = opacity;
  });

  dots.forEach((d, i) => d.classList.toggle("is-active", i === currentIndex));

  // Info
  const p = PROJECTS[currentIndex];
  infoTitle.textContent = p.title;
  infoDesc.textContent  = p.desc;
  infoLink.href         = p.link;
  document.getElementById("infoTech").textContent = p.tech;
}

function shortestDistance(a, b) {
  const d = Math.abs(a - b);
  return Math.min(d, N - d);
}

/* ---------- Navegación ---------- */
function goTo(index) {
  currentIndex = (index + N) % N;
  rotation = -currentIndex * angleStep;
  track.style.transform = `rotateY(${rotation}deg)`;
  reflection.style.transform =
    `translateX(-50%) scaleY(-1) rotateY(${rotation}deg)`;
  updateActive();
}

function next() { goTo(currentIndex + 1); }
function prev() { goTo(currentIndex - 1); }

/* ---------- Autoplay ---------- */
function startAutoplay() {
  stopAutoplay();
  autoplayId = setInterval(next, 4000);
}
function stopAutoplay() {
  if (autoplayId) clearInterval(autoplayId);
}

/* ---------- Eventos ---------- */
prevBtn.addEventListener("click", () => { prev(); startAutoplay(); });
nextBtn.addEventListener("click", () => { next(); startAutoplay(); });

/* Drag con mouse */
let isDragging = false;
let startX = 0;
let startRotation = 0;

carousel.addEventListener("mousedown", (e) => {
  isDragging = true;
  startX = e.clientX;
  startRotation = rotation;
  carousel.classList.add("is-dragging");
  stopAutoplay();
});
window.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  const delta = e.clientX - startX;
  rotation = startRotation + delta * 0.3;
  track.style.transform = `rotateY(${rotation}deg)`;
  reflection.style.transform =
    `translateX(-50%) scaleY(-1) rotateY(${rotation}deg)`;
});
window.addEventListener("mouseup", () => {
  if (!isDragging) return;
  isDragging = false;
  carousel.classList.remove("is-dragging");
  snapToNearest();
  startAutoplay();
});

/* Touch */
carousel.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
  startRotation = rotation;
  stopAutoplay();
}, { passive: true });
carousel.addEventListener("touchmove", (e) => {
  const delta = e.touches[0].clientX - startX;
  rotation = startRotation + delta * 0.3;
  track.style.transform = `rotateY(${rotation}deg)`;
  reflection.style.transform =
    `translateX(-50%) scaleY(-1) rotateY(${rotation}deg)`;
}, { passive: true });
carousel.addEventListener("touchend", () => {
  snapToNearest();
  startAutoplay();
});

/* Teclado */
window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") { next(); startAutoplay(); }
  if (e.key === "ArrowLeft")  { prev(); startAutoplay(); }
});

/* Alinear al índice más cercano tras arrastrar */
function snapToNearest() {
  const normalized = ((rotation % 360) + 360) % 360;
  const idx = Math.round(normalized / angleStep) % N;
  goTo(idx);
}

/* Pausar al hacer hover */
carousel.addEventListener("mouseenter", stopAutoplay);
carousel.addEventListener("mouseleave", startAutoplay);
info.addEventListener("mouseenter", stopAutoplay);
info.addEventListener("mouseleave", startAutoplay);

/* ---------- Inicializar ---------- */
buildCards();
buildDots();
layout();
goTo(0);
startAutoplay();
