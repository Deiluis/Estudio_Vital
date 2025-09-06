const modal = document.querySelector(".modal-slider");
const modalContainer = document.querySelector(".modal-slider__container");
const modalBackground = document.querySelector(".modal-slider__background");
const modalImg = document.querySelector(".modal-slider__img");
const modalCloseButton = document.querySelector(".modal-slider__button");

const prevButton = document.querySelector(".slider__button--left");
const nextButton = document.querySelector(".slider__button--right");

const carouselImages = document.querySelectorAll(".carrusel__images");

let images;
let currentIndex = 0;

const toggleView = () => {
    modal.classList.toggle("opacity-0");
    modal.classList.toggle("pointer-events-none");
    modalContainer.classList.toggle("-translate-y-[100vh]");
    modalContainer.classList.toggle("opacity-0");
}

carouselImages.forEach(carousel => {
    carousel.addEventListener("click", e => {
        const button = e.target.closest(".slider__show-button");
        if (!button) return; // no es botón, ignoro

        // Asignar las imagenes correpondientes
        images = carousel.querySelectorAll("img");

        // Determinar el índice del artículo donde está el botón
        const articles = Array.from(carousel.querySelectorAll("article"));
        const index = articles.findIndex(article => article.contains(button));

        currentIndex = index;
        modalImg.src = images[currentIndex].src;
        toggleView();
    });
});

prevButton.addEventListener("click", () => {
    currentIndex--;

    // Si estamos en el inicio, vamos al final
    if (currentIndex < 0)
        currentIndex = images.length - 1;

    modalImg.src = images[currentIndex].src;
});

nextButton.addEventListener("click", () => {
    currentIndex++;

    // Si llegamos al final, volvemos al inicio
    if (currentIndex >= images.length)
        currentIndex = 0;
    
    modalImg.src = images[currentIndex].src;
});

modalContainer.addEventListener("click", (e) => {
    if (e.target == modalContainer) 
        toggleView();
});

modalCloseButton.addEventListener("click", toggleView);
modalBackground.addEventListener("click", toggleView);