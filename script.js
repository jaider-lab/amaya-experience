// DOM Elements
const titleElement = document.getElementById('amaya-title');
const welcomeScreen = document.getElementById('welcome-screen');
const galleryScreen = document.getElementById('gallery-screen');
const backButton = document.getElementById('back-button');

// --- Lógica de Interacción ---

// Evento: Clic en el título "Amaya"
titleElement.addEventListener('click', () => {
    // 1. Transición de salida fluida de la pantalla de bienvenida
    welcomeScreen.classList.remove('active');
    welcomeScreen.classList.add('fade-out');

    // 2. Transición de entrada de la galería 3D tras un breve retraso
    setTimeout(() => {
        galleryScreen.classList.add('active');
    }, 900); // 900ms sincronizado con la animación CSS
});

// Evento: Botón para volver a la pantalla inicial
backButton.addEventListener('click', () => {
    galleryScreen.classList.remove('active');
    setTimeout(() => {
        welcomeScreen.classList.remove('fade-out');
        welcomeScreen.classList.add('active');
    }, 800);
});

// --- Motor de Partículas (Fondo Mágico Rosado) ---
const canvas = document.getElementById('background-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];

// Ajustar el canvas al tamaño de la ventana
function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas(); // Inicializar dimensiones

// Clase Partícula
class Particle {
    constructor() {
        this.reset(true);
    }

    reset(initial = false) {
        this.x = Math.random() * width;
        // Si es inicial, aparecen en cualquier lugar. Si no, nacen abajo
        this.y = initial ? Math.random() * height : height + 10;
        
        // Tamaños variados (estrellas finas y destellos más grandes)
        this.size = Math.random() * 2.5 + 0.5; 
        
        // Movimiento: flotando hacia arriba y oscilando horizontalmente
        this.speedX = (Math.random() - 0.5) * 0.8;
        this.speedY = (Math.random() * -1.5) - 0.5;
        
        // Paleta de tonos fucsia, rosa cromado y blanco cristalino
        const colors = [
            'rgba(255, 51, 102, 1)',   // Fucsia vibrante
            'rgba(255, 153, 204, 1)',  // Rosa suave
            'rgba(230, 0, 92, 1)',     // Rosa oscuro cromado
            'rgba(255, 255, 255, 1)'   // Blanco puro
        ];
        this.baseColor = colors[Math.floor(Math.random() * colors.length)];
        
        // Control de opacidad para el parpadeo
        this.opacity = Math.random() * 0.5;
        this.fadeSpeed = (Math.random() * 0.015) + 0.005;
        this.fadeDirection = Math.random() > 0.5 ? 1 : -1;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Movimiento senoidal suave en el eje X para imitar seda al viento
        this.x += Math.sin(this.y * 0.01) * 0.5;

        // Reciclar partícula si sale de la pantalla
        if (this.y < -10 || this.x < -10 || this.x > width + 10) {
            this.reset();
        }

        // Efecto de parpadeo (Blinking)
        this.opacity += this.fadeSpeed * this.fadeDirection;
        if (this.opacity >= 0.8) {
            this.fadeDirection = -1;
        } else if (this.opacity <= 0.1) {
            this.fadeDirection = 1;
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        
        // Extraer color RGB y aplicar la opacidad actual
        const colorParts = this.baseColor.replace('rgba(', '').replace('1)', '').split(',');
        ctx.fillStyle = `rgba(${colorParts[0]}, ${colorParts[1]}, ${colorParts[2]}, ${this.opacity})`;
        
        // Resplandor (Glow) para partículas más brillantes
        if (this.size > 1.5) {
            ctx.shadowBlur = 10;
            ctx.shadowColor = `rgba(${colorParts[0]}, ${colorParts[1]}, ${colorParts[2]}, 0.8)`;
        } else {
            ctx.shadowBlur = 0;
        }

        ctx.fill();
    }
}

// Inicializar el arreglo de partículas
function initParticles() {
    particles = [];
    // Densidad dependiente del ancho de pantalla para rendimiento
    const numParticles = Math.min(Math.floor(window.innerWidth / 8), 150); 
    for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle());
    }
}

// Bucle de animación principal
function animate() {
    // 1. Dibujar el fondo fluido (Satén animado por gradiente)
    const time = Date.now() * 0.0002;
    
    // Tonos oscilantes para simular el movimiento de la seda
    const colorStop1 = `hsl(335, 100%, ${10 + Math.sin(time) * 5}%)`; // Rosa profundo oscuro
    const colorStop2 = `hsl(340, 100%, ${5 + Math.cos(time * 0.8) * 3}%)`; // Casi negro con toque guinda
    
    // Gradiente dinámico radial que sigue un movimiento sutil
    const gradX = width / 2 + Math.sin(time) * 200;
    const gradY = height / 2 + Math.cos(time) * 100;
    
    const gradient = ctx.createRadialGradient(gradX, gradY, 0, width / 2, height / 2, Math.max(width, height));
    gradient.addColorStop(0, colorStop1);
    gradient.addColorStop(1, colorStop2);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // 2. Actualizar y dibujar partículas
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    
    requestAnimationFrame(animate);
}

// Arrancar la magia
initParticles();
animate();
