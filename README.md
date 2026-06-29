# AMAYA - Experiencia Interactiva 3D

Este repositorio contiene un proyecto frontend conceptualizado en torno a una estética premium: texturas de satén fluido, cristales anatómicos, caligrafía fina y elementos enjoyados (diamantes y oro rosa). 

El proyecto consta de una pantalla de bienvenida interactiva que, al hacer clic, revela una galería 3D rotativa en el espacio tridimensional.

## 🚀 Tecnologías Utilizadas

- **HTML5**: Estructura semántica del documento y contenedores.
- **CSS3 Vanilla**: 
  - Variables nativas de color (Tonos fucsia, rosa cromado).
  - Animaciones avanzadas (`@keyframes`) para pulsos y giros automáticos.
  - Renderizado tridimensional (`transform-style: preserve-3d`, `perspective`, `rotateY`, `translateZ`).
  - Efectos visuales de tipo *Glassmorphism* (`backdrop-filter: blur`, `box-shadow` interiores).
- **JavaScript (Vanilla ES6)**: 
  - Motor de físicas simples renderizado en `<canvas>` para simular el fondo de polvo de estrellas/satén en movimiento (Partículas con parpadeo senoidal).
  - Lógica de transición de estados en el DOM (manejo de clases para fade-in/fade-out).

## 📁 Estructura del Código

El proyecto está diseñado de forma modular en 4 archivos principales:

1. `index.html`: La vista. Contiene el lienzo del fondo y los dos contenedores principales (Bienvenida y Galería).
2. `styles.css`: La estética. Contiene todo el diseño responsivo, la tipografía (Google Fonts) y los cálculos tridimensionales del carrusel.
3. `script.js`: La lógica. Contiene el sistema de partículas POO y los *Event Listeners* de interacción.
4. `README.md`: Este documento.

## 🛠️ Cómo Configurar y Desplegar en GitHub Pages

Para ver este proyecto en vivo a través de un link interactivo, sigue estos pasos:

### 1. Preparar las Imágenes (IMPORTANTE)
El diseño asume la existencia de 4 imágenes conceptuales. Debes:
1. Crear una carpeta llamada `assets` en la raíz de este directorio.
2. Colocar dentro tus 4 imágenes y asegurarte de que los nombres coincidan exactamente con estos:
   - `amaya-calligraphy.jpg`
   - `satin-texture.jpg`
   - `glass-heart.jpg`
   - `cupid-card.jpg`
*(Nota: Si no agregas las imágenes, el CSS tiene un "fallback" que mostrará un contenedor rosa semitransparente que dice "Imagen no disponible").*

### 2. Subir a GitHub
1. Entra a tu cuenta de GitHub y haz clic en **New Repository**.
2. Dale un nombre, por ejemplo: `amaya-experience`.
3. Sube los archivos (`index.html`, `styles.css`, `script.js`, `README.md`) y tu carpeta `assets` al repositorio.

### 3. Activar GitHub Pages
1. Dentro de tu repositorio en GitHub, ve a la pestaña **Settings** (Configuración).
2. En el menú lateral izquierdo, busca y haz clic en **Pages**.
3. Bajo el apartado **Build and deployment** > **Source**, asegúrate de que diga "Deploy from a branch".
4. En **Branch**, selecciona tu rama principal (usualmente `main` o `master`) y la carpeta `/ (root)`.
5. Haz clic en **Save**.
6. ¡Listo! En un par de minutos, GitHub generará tu enlace interactivo en la parte superior de esa misma página de configuración.
