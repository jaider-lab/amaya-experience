/* ══════════════════════════════════════════════
   AMAYA — script.js
   Interactividad, partículas y carrusel adaptativo
   ══════════════════════════════════════════════ */

'use strict';

// ── 1. REFERENCIAS AL DOM ──
const titleEl       = document.getElementById('amaya-title');
const welcomeScreen = document.getElementById('welcome-screen');
const galleryScreen = document.getElementById('gallery-screen');
const backButton    = document.getElementById('back-button');
const carousel      = document.getElementById('carousel');
const scene         = document.getElementById('carousel-scene');
const dots          = document.querySelectorAll('.dot');
const canvas        = document.getElementById('background-canvas');
const ctx           = canvas.getContext('2d');

// ── 2. ESTADO DE LA APLICACIÓN ──
const state = {
    currentFace: 0,
    totalFaces: 4,
    autoRotating: true,
    cardWidth: 0,
    cardHeight: 0,
    radius: 0,
    angle: 0,           // Ángulo actual del carrusel (grados)
    raf: null,          // requestAnimationFrame ID
    touchStartX: 0,
    touchStartY: 0,
    isDragging: false,
    lastAngle: 0,
};

// ── 3. CARRUSEL 3D ADAPTATIVO ──
// Calcula las dimensiones óptimas según el tamaño de pantalla
function calcCarouselDimensions() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const isLandscape = vw > vh;

    let cardWidth, cardHeight;

    if (vw < 380) {
        // Galaxy Fold, iPhone SE
        cardWidth  = Math.min(vw * 0.72, 240);
        cardHeight = isLandscape ? vh * 0.65 : vh * 0.45;
    } else if (vw < 768) {
        // Móviles estándar
        cardWidth  = Math.min(vw * 0.7, 300);
        cardHeight = isLandscape ? vh * 0.7 : vh * 0.48;
    } else if (vw < 1024) {
        // Tablets
        cardWidth  = Math.min(vw * 0.4, 340);
        cardHeight = vh * 0.52;
    } else {
        // Escritorio
        cardWidth  = Math.min(vw * 0.22, 360);
        cardHeight = Math.min(vh * 0.58, 500);
    }

    // El radio del círculo en el que orbitan las caras
    // (aprox: cardWidth * 0.65 da una separación visual agradable)
    const radius = Math.round(cardWidth * 0.68);

    state.cardWidth  = Math.round(cardWidth);
    state.cardHeight = Math.round(cardHeight);
    state.radius     = radius;
}

// Aplica las dimensiones calculadas al DOM y reposiciona las caras
function applyCarouselLayout() {
    const { cardWidth, cardHeight, radius, totalFaces } = state;
    const angleStep = 360 / totalFaces; // 90° para 4 caras

    // Actualiza las variables CSS
    document.documentElement.style.setProperty('--card-width',  `${cardWidth}px`);
    document.documentElement.style.setProperty('--card-height', `${cardHeight}px`);

    // Dimensiona la escena
    scene.style.width  = `${cardWidth}px`;
    scene.style.height = `${cardHeight}px`;

    // Posiciona cada celda del carrusel
    const cells = carousel.querySelectorAll('.carousel__cell');
    cells.forEach((cell, i) => {
        cell.style.width   = `${cardWidth}px`;
        cell.style.height  = `${cardHeight}px`;
        cell.style.transform = `rotateY(${i * angleStep}deg) translateZ(${radius}px)`;
    });

    // Ajusta la perspectiva de la escena para que siempre se vea bien
    scene.style.perspective = `${radius * 4.5}px`;
}

// ── 4. ANIMACIÓN DEL CARRUSEL ──
let lastTimestamp = 0;
const ROTATION_SPEED = 22; // Grados por segundo

function animateCarousel(timestamp) {
    if (state.autoRotating) {
        const delta = timestamp - lastTimestamp;
        lastTimestamp = timestamp;
        // Movimiento suave, independiente del framerate (delta time)
        state.angle = (state.angle + (ROTATION_SPEED * delta) / 1000) % 360;
        carousel.style.transform = `rotateY(${state.angle}deg)`;

        // Actualizar el dot activo según el ángulo
        updateActiveDot();
    }
    state.raf = requestAnimationFrame(animateCarousel);
}

// ── 5. INDICADORES (DOTS) ──
function updateActiveDot() {
    const angleStep = 360 / state.totalFaces;
    // Normaliza el ángulo y calcula qué cara está al frente
    const normalized = ((360 - (state.angle % 360)) + 45) % 360;
    const faceIndex  = Math.floor(normalized / angleStep) % state.totalFaces;

    if (faceIndex !== state.currentFace) {
        state.currentFace = faceIndex;
        dots.forEach((dot, i) => dot.classList.toggle('active', i === faceIndex));
    }
}

// ── 6. INTERACCIÓN TÁCTIL (SWIPE EN MÓVILES) ──
carousel.addEventListener('touchstart', (e) => {
    state.touchStartX  = e.touches[0].clientX;
    state.touchStartY  = e.touches[0].clientY;
    state.isDragging   = true;
    state.lastAngle    = state.angle;
    state.autoRotating = false;
}, { passive: true });

carousel.addEventListener('touchmove', (e) => {
    if (!state.isDragging) return;
    const dx = e.touches[0].clientX - state.touchStartX;
    const dy = e.touches[0].clientY - state.touchStartY;

    // Si el movimiento es más horizontal que vertical, es un swipe lateral
    if (Math.abs(dx) > Math.abs(dy)) {
        state.angle = state.lastAngle + dx * 0.4;
        carousel.style.transform = `rotateY(${state.angle}deg)`;
        e.preventDefault(); // Evita scroll de la página al hacer swipe en el carrusel
    }
}, { passive: false });

carousel.addEventListener('touchend', () => {
    state.isDragging = false;
    // Snap al ángulo más cercano a una cara
    const angleStep = 360 / state.totalFaces;
    const snapped   = Math.round(state.angle / angleStep) * angleStep;
    state.angle     = snapped;
    carousel.style.transform = `rotateY(${snapped}deg)`;

    // Reanuda la rotación automática tras 3 segundos de inactividad
    setTimeout(() => {
        state.autoRotating = true;
        lastTimestamp = performance.now();
    }, 3000);
});

// Soporte para arrastrar con ratón (escritorio)
carousel.addEventListener('mousedown', (e) => {
    state.touchStartX  = e.clientX;
    state.isDragging   = true;
    state.lastAngle    = state.angle;
    state.autoRotating = false;
    carousel.style.cursor = 'grabbing';
});

document.addEventListener('mousemove', (e) => {
    if (!state.isDragging) return;
    const dx = e.clientX - state.touchStartX;
    state.angle = state.lastAngle + dx * 0.35;
    carousel.style.transform = `rotateY(${state.angle}deg)`;
});

document.addEventListener('mouseup', () => {
    if (!state.isDragging) return;
    state.isDragging  = false;
    carousel.style.cursor = 'grab';

    const angleStep = 360 / state.totalFaces;
    const snapped   = Math.round(state.angle / angleStep) * angleStep;
    state.angle     = snapped;
    carousel.style.transform = `rotateY(${snapped}deg)`;

    setTimeout(() => {
        state.autoRotating = true;
        lastTimestamp = performance.now();
    }, 3000);
});

// ── 7. TRANSICIONES ENTRE PANTALLAS ──
function showGallery() {
    welcomeScreen.classList.remove('active');
    welcomeScreen.classList.add('fade-out');

    setTimeout(() => {
        galleryScreen.classList.add('active');
        // Inicia la animación del carrusel
        lastTimestamp = performance.now();
        state.raf = requestAnimationFrame(animateCarousel);
    }, 950);
}

function showWelcome() {
    galleryScreen.classList.remove('active');
    cancelAnimationFrame(state.raf);

    setTimeout(() => {
        welcomeScreen.classList.remove('fade-out');
        welcomeScreen.classList.add('active');
        state.angle = 0;
        state.autoRotating = true;
    }, 800);
}

// Click en el título
titleEl.addEventListener('click', showGallery);
// Teclado (accesibilidad)
titleEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') showGallery();
});

// Botón volver
backButton.addEventListener('click', showWelcome);

// ── 8. RESPONSIVE: RECALCULAR EN RESIZE ──
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        calcCarouselDimensions();
        applyCarouselLayout();
        resizeCanvas();
    }, 150);
});

// ── 9. MOTOR DE PARTÍCULAS (CANVAS — SATÉN ANIMADO) ──
let W, H;
let particles = [];

function resizeCanvas() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Clase Partícula
class Particle {
    constructor(initial = false) {
        this.reset(initial);
    }

    reset(initial = false) {
        this.x    = Math.random() * W;
        this.y    = initial ? Math.random() * H : H + 5;
        this.size = Math.random() * 2.2 + 0.4;
        this.vx   = (Math.random() - 0.5) * 0.6;
        this.vy   = -(Math.random() * 1.2 + 0.3);
        this.opacity      = Math.random() * 0.4 + 0.05;
        this.fadeDir      = Math.random() > 0.5 ? 1 : -1;
        this.fadeSpeed    = Math.random() * 0.012 + 0.004;
        this.sineOffset   = Math.random() * Math.PI * 2; // Fase inicial aleatoria
        this.sineAmp      = Math.random() * 0.6 + 0.2;  // Amplitud de oscilación
        this.sineFreq     = Math.random() * 0.008 + 0.003; // Frecuencia de oscilación

        // Paleta: fucsia, rosa suave, rosa cromado, blanco
        const palette = [
            [255,  51, 102],  // Fucsia
            [255, 153, 204],  // Rosa suave
            [230,   0,  92],  // Fuchsia oscuro
            [255, 200, 220],  // Rosa claro
            [255, 255, 255],  // Blanco
        ];
        this.rgb = palette[Math.floor(Math.random() * palette.length)];
    }

    update() {
        this.x  += this.vx + Math.sin(this.y * this.sineFreq + this.sineOffset) * this.sineAmp;
        this.y  += this.vy;

        // Parpadeo suave
        this.opacity += this.fadeSpeed * this.fadeDir;
        if (this.opacity >= 0.75) this.fadeDir = -1;
        else if (this.opacity <= 0.05) this.fadeDir = 1;

        // Reciclar si sale de pantalla
        if (this.y < -5 || this.x < -10 || this.x > W + 10) {
            this.reset(false);
        }
    }

    draw() {
        const [r, g, b] = this.rgb;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${this.opacity.toFixed(2)})`;

        // Efecto glow en partículas más grandes
        if (this.size > 1.4) {
            ctx.shadowBlur  = 8;
            ctx.shadowColor = `rgba(${r},${g},${b},0.7)`;
        } else {
            ctx.shadowBlur = 0;
        }
        ctx.fill();
    }
}

function initParticles() {
    // Densidad según tamaño de pantalla, máximo 140
    const count = Math.min(Math.floor((W * H) / 6000), 140);
    particles   = Array.from({ length: count }, () => new Particle(true));
}

// Tiempo de inicio para el gradiente animado
const startTime = performance.now();

function renderBackground() {
    const t = (performance.now() - startTime) * 0.0002;

    // Centro del gradiente oscila suavemente para simular luz sobre satén
    const cx = W / 2 + Math.sin(t * 0.9) * W * 0.18;
    const cy = H / 2 + Math.cos(t * 0.7) * H * 0.12;

    // Gradiente radial de fondo (satén oscuro a rojo-guinda profundo)
    const grad = ctx.createRadialGradient(cx, cy, 0, W / 2, H / 2, Math.max(W, H) * 0.85);
    grad.addColorStop(0,   `hsl(335, 100%, ${11 + Math.sin(t) * 4}%)`);
    grad.addColorStop(0.5, `hsl(330, 95%,  ${7  + Math.cos(t * 0.6) * 2}%)`);
    grad.addColorStop(1,   `hsl(320, 90%,  ${4  + Math.sin(t * 0.4) * 1.5}%)`);

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
}

// Bucle principal de renderizado
function mainLoop() {
    renderBackground();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(mainLoop);
}

// ── 10. INICIALIZACIÓN ──
function init() {
    calcCarouselDimensions();
    applyCarouselLayout();
    carousel.style.cursor = 'grab';
    initParticles();
    mainLoop();
}

init();
