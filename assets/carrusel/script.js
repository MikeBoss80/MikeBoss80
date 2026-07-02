/* ============================================================
   CONFIGURACIÓN DE TUS PROYECTOS
   Edita este array para añadir/quitar proyectos.
   Las imágenes van en: /assets/carrusel/images/
   ============================================================ */
const PROJECTS = [
  {
    title: "Proyecto 1",
    desc: "Descripción breve de tu primer proyecto.",
    img: "images/proyecto1.png",
    link: "https://github.com/MikeBoss80/proyecto1"
  },
  {
    title: "Proyecto 2",
    desc: "Otro proyecto increíble que quieres mostrar.",
    img: "images/proyecto2.png",
    link: "https://github.com/MikeBoss80/proyecto2"
  },
  {
    title: "Proyecto 3",
    desc: "Una app web con diseño moderno.",
    img: "images/proyecto3.png",
    link: "https://github.com/MikeBoss80/proyecto3"
  },
  {
    title: "Proyecto 4",
    desc: "Librería open-source en JavaScript.",
    img: "images/proyecto4.png",
    link: "https://github.com/MikeBoss80/proyecto4"
  },
  {
    title: "Proyecto 5",
    desc: "Dashboard con analíticas en tiempo real.",
    img: "images/proyecto5.png",
    link: "https://github.com/MikeBoss80/proyecto5"
  },
  {
    title: "Proyecto 6",
    desc: "API REST con Node.js y MongoDB.",
    img: "images/proyecto6.png",
    link: "https://github.com/MikeBoss80/proyecto6"
  },
  {
    title: "Proyecto 7",
    desc: "Juego 2D hecho con Canvas.",
    img: "images/proyecto7.png",
    link: "https://github.com/MikeBoss80/proyecto7"
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
const radius      = Math.max(320, N * 55); // radio del círculo 3D
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
        <span>${p.desc}</span>
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
  autoplayId = setInterval(next, 3500);
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

/* ---------- Inicializar ---------- */
buildCards();
buildDots();
layout();
goTo(0);
startAutoplay();
