const carousel = document.querySelector(".carrusel__images");
const carouselContainer = document.querySelector(".carrusel__container");
const imgs = document.querySelectorAll(".carrusel__images article");
const prevBtn = document.querySelector(".carrusel__button--left");
const nextBtn = document.querySelector(".carrusel__button--right");

let currentIndex = 0;
let visibleSlides = 1;
let slideWidth = 0;
let gap = 0;

// Mouse vars
let mouseDown = false;

// Swipe vars
let startX = 0;
let isDragging = false;
let currentTranslate = 0;
let prevTranslate = 0;

// Calcular cuántos slides mostrar según pantalla
function updateVisibleSlides() {
	const width = window.innerWidth;

	if (width < 640)
		visibleSlides = 1; // móviles
	else if (width < 1024)
		visibleSlides = 3; // tablets
	else
		visibleSlides = 4; // desktops

	// Calcular gap (12 = 3rem por Tailwind → 48px en la mayoría de navegadores)
	gap = parseInt(getComputedStyle(carousel).gap) || 0;

	// Ancho de cada slide
	slideWidth = carousel.clientWidth / visibleSlides - (gap * (visibleSlides - 1)) / visibleSlides;

	// Aplicar ancho fijo a cada imagen
	imgs.forEach(img => {
		img.style.minWidth = `${slideWidth}px`;
	});

	const maxIndex = Math.max(0, imgs.length - visibleSlides);
	if (currentIndex > maxIndex) {
		currentIndex = maxIndex;
	}

	moveToSlide(currentIndex);
}

// Mover carrusel
function moveToSlide(index) {
	const offset = -(index * (slideWidth + gap));
	carousel.style.transition = "transform 0.3s ease";
	carousel.style.transform = `translateX(${offset}px)`;
	prevTranslate = offset;
}

// Botones
nextBtn.addEventListener("click", () => {
	if (currentIndex < imgs.length - visibleSlides) {
		currentIndex++;
		moveToSlide(currentIndex);
	}
});

prevBtn.addEventListener("click", () => {
	if (currentIndex > 0) {
		currentIndex--;
		moveToSlide(currentIndex);
	}
});

// ---- SWIPE ----
function touchStart(e) {
	startX = e.type.includes("mouse") ? e.pageX : e.touches[0].clientX;
	isDragging = false; // por ahora no estamos arrastrando
	mouseDown = e.type.includes("mouse");
	carousel.style.transition = "none";
}

function touchMove(e) {
    const currentX = e.type.includes("mouse") ? e.pageX : e.touches[0].clientX;
    const diff = currentX - startX;

    if (e.type.includes("mouse") && !mouseDown) return; // si no está presionado, no arrastramos

    if (Math.abs(diff) > 5) {
        isDragging = true;
        currentTranslate = prevTranslate + diff;
        carousel.style.transform = `translateX(${currentTranslate}px)`;
    }
}

function touchEnd() {
    if (!isDragging) {
        mouseDown = false;
        return; // solo clic, no arrastrar
    }

    // Calcular índice más cercano según desplazamiento
    const totalSlideWidth = slideWidth + gap;
    let rawIndex = -currentTranslate / totalSlideWidth;
    currentIndex = Math.round(rawIndex); // redondear al índice más cercano

    // Limitar índice
    if (currentIndex < 0) 
		currentIndex = 0;

    if (currentIndex > imgs.length - visibleSlides) 
		currentIndex = imgs.length - visibleSlides;

    moveToSlide(currentIndex);
	
    isDragging = false;
    mouseDown = false;
}

// Eventos touch y mouse
carouselContainer.addEventListener("touchstart", touchStart);
carouselContainer.addEventListener("touchmove", touchMove);
carouselContainer.addEventListener("touchend", touchEnd);

carouselContainer.addEventListener("mousedown", touchStart);
carouselContainer.addEventListener("mousemove", touchMove);
carouselContainer.addEventListener("mouseup", touchEnd);
carouselContainer.addEventListener("mouseleave", touchEnd); // por si se sale del carrusel

// Inicializar
window.addEventListener("resize", updateVisibleSlides);
updateVisibleSlides();