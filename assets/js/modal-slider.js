const modal = document.querySelector(".modal-slider");
const modalContainer = document.querySelector(".modal-slider__container");
const modalBackground = document.querySelector(".modal-slider__background");
const modalImg = document.querySelector(".modal-slider__img");
const modalCloseButton = document.querySelector(".modal-slider__button");

const prevButton = document.querySelector(".slider__button--left");
const nextButton = document.querySelector(".slider__button--right");

const carouselImages = document.querySelectorAll(".carrusel__images");

let images = [];
let currentIndex = 0;
const preloaded = new Set(); // guarda src de imágenes ya precargadas

const toggleView = () => {
    modal.classList.toggle("opacity-0");
    modal.classList.toggle("pointer-events-none");
    modalContainer.classList.toggle("-translate-y-[100vh]");
    modalContainer.classList.toggle("opacity-0");
};

// Precarga una sola imagen si no está en cache
function preloadImage(src) {
    if (preloaded.has(src)) return;
    const img = new Image();
    img.src = src;
    preloaded.add(src);
}

// Precarga la actual + vecinas
function preloadNeighbors(index) {
    const prevIndex = (index - 1 + images.length) % images.length;
    const nextIndex = (index + 1) % images.length;

    [index, prevIndex, nextIndex].forEach(i => {
        preloadImage(images[i].src);
    });
}

// Evento click sobre carruseles
carouselImages.forEach(carousel => {
    carousel.addEventListener("click", e => {
        const button = e.target.closest(".slider__show-button");
        if (!button) return;

        images = Array.from(carousel.querySelectorAll("img"));

        const articles = Array.from(carousel.querySelectorAll("article"));
        const index = articles.findIndex(article => article.contains(button));

        currentIndex = index;
        modalImg.src = images[currentIndex].src;

        preloadNeighbors(currentIndex); // 🔥 precargar vecinos
        toggleView();
    });
});

// Botones prev/next
prevButton.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    modalImg.src = images[currentIndex].src;
    preloadNeighbors(currentIndex);
});

nextButton.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % images.length;
    modalImg.src = images[currentIndex].src;
    preloadNeighbors(currentIndex);
});

// Cerrar modal
modalContainer.addEventListener("click", (e) => {
    if (e.target == modalContainer) toggleView();
});
modalCloseButton.addEventListener("click", toggleView);
modalBackground.addEventListener("click", toggleView);

// Soporte teclado
document.addEventListener("keydown", (e) => {
    if (modal.classList.contains("opacity-0")) return;

    if (e.key === "ArrowLeft") {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        modalImg.src = images[currentIndex].src;
        preloadNeighbors(currentIndex);
    } else if (e.key === "ArrowRight") {
        currentIndex = (currentIndex + 1) % images.length;
        modalImg.src = images[currentIndex].src;
        preloadNeighbors(currentIndex);
    } else if (e.key === "Escape") {
        toggleView();
    }
});