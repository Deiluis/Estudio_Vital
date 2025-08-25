import { resumed as projects } from "./projects.js";

const hero = document.querySelector('#hero');

// Tiempos configurables
const fadeDuration = 1500;  // en ms → velocidad de fade in/out
const visibleDuration = 5000; // en ms → cuanto tiempo visible ANTES del fadeout

// Carga la imagenes en el html
projects.forEach(project => {
    const img = document.createElement("img");
    img.className = `hero__img absolute top-0 left-0 w-full h-full object-cover transition-all duration-[${fadeDuration}ms]`;
    img.src = project.img;
    img.alt = `Imagen del proyecto ${project.title}`;
    hero.appendChild(img);
});

document.addEventListener("DOMContentLoaded", () => {
    const images = document.querySelectorAll(".hero__img");
    let current = 0;

    function showImage(index) {
        // ocultar todas
        images.forEach(img => img.classList.add("opacity-0"));
        // mostrar la actual
        images[index].classList.remove("opacity-0");
    }

    const startSlideshow = () => {
        showImage(current);

        setInterval(() => {
            // pasar a la siguiente
            current = (current + 1) % images.length;
            showImage(current);
        }, visibleDuration); 
        // total de ciclo = visible + transición
    }

    startSlideshow();
});