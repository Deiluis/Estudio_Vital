const modal = document.querySelector(".modal-slider");
const modalContainer = document.querySelector(".modal-slider__container");
const modalBackground = document.querySelector(".modal-slider__background");
const modalImg = document.querySelector(".modal-slider__img");
const modalCloseButton = document.querySelector(".modal-slider__button");

const prevButton = document.querySelector(".slider__button--left");
const nextButton = document.querySelector(".slider__button--right");

const images = document.querySelectorAll(".gallery__img")
const showButtons = document.querySelectorAll(".slider__show-button");
let currentIndex = 0;

showButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
        currentIndex = index;
        modalImg.setAttribute("src", images[currentIndex].getAttribute("src"));
        modal.classList.add("modal-slider--show");
        modalContainer.classList.add("modal-slider__container--show");
    });
})

prevButton.addEventListener("click", () => {
    currentIndex--;

    // Si estamos en el inicio, vamos al final
    if (currentIndex < 0)
        currentIndex = images.length - 1;

    modalImg.setAttribute("src", images[currentIndex].getAttribute("src"));
});

nextButton.addEventListener("click", () => {
    currentIndex++;

    // Si llegamos al final, volvemos al inicio
    if (currentIndex >= images.length) {
        currentIndex = 0;
    }

    modalImg.setAttribute("src", images[currentIndex].getAttribute("src"));
});

modalContainer.addEventListener("click", (e) => {
    if (e.target == modalContainer) {
        modal.classList.remove("modal-slider--show");
        modalContainer.classList.remove("modal-slider__container--show");
    }
});

modalCloseButton.addEventListener("click", () => {
    modal.classList.remove("modal-slider--show");
    modalContainer.classList.remove("modal-slider__container--show");
});

modalBackground.addEventListener("click", () => {
    modal.classList.remove("modal-slider--show");
    modalContainer.classList.remove("modal-slider__container--show");
});