class Carousel extends HTMLElement {
    constructor() {
        super();
        this.currentIndex = 0;
        this.visibleSlides = 1;
        this.slideWidth = 0;
        this.gap = 0;

        // swipe/mouse vars
        this.mouseDown = false;
        this.startX = 0;
        this.isDragging = false;
        this.currentTranslate = 0;
        this.prevTranslate = 0;
        this.SWIPE_THRESHOLD = 20; // px para considerar swipe
    }

    connectedCallback() {
        // Buscar elementos dentro del carrusel
        this.carousel = this.querySelector(".carrusel__images");
        this.carouselContainer = this.querySelector(".carrusel__container") || this;
        this.imgs = this.querySelectorAll(".carrusel__images article");
        this.prevBtn = this.querySelector(".carrusel__button--left");
        this.nextBtn = this.querySelector(".carrusel__button--right");

        // Inicializar
        this.updateVisibleSlides();
        window.addEventListener("resize", this.updateVisibleSlides.bind(this));

        // Botones
        this.nextBtn?.addEventListener("click", () => {
            if (this.currentIndex < this.imgs.length - this.visibleSlides) {
                this.currentIndex++;
                this.moveToSlide(this.currentIndex);
            }
        });

        this.prevBtn?.addEventListener("click", () => {
            if (this.currentIndex > 0) {
                this.currentIndex--;
                this.moveToSlide(this.currentIndex);
            }
        });

        // Eventos touch/mouse
        this.carouselContainer.addEventListener("touchstart", this.touchStart.bind(this));
        this.carouselContainer.addEventListener("touchmove", this.touchMove.bind(this));
        this.carouselContainer.addEventListener("touchend", this.touchEnd.bind(this));

        this.carouselContainer.addEventListener("mousedown", this.touchStart.bind(this));
        this.carouselContainer.addEventListener("mousemove", this.touchMove.bind(this));
        this.carouselContainer.addEventListener("mouseup", this.touchEnd.bind(this));
        this.carouselContainer.addEventListener("mouseleave", this.touchEnd.bind(this));
    }

    // Calcular slides visibles
    updateVisibleSlides() {
        const width = window.innerWidth;

        if (width < 640) this.visibleSlides = 1;
        else if (width < 1024) this.visibleSlides = 3;
        else this.visibleSlides = 4;

        this.gap = parseInt(getComputedStyle(this.carousel).gap) || 0;
        this.slideWidth =
            this.carousel.clientWidth / this.visibleSlides -
            (this.gap * (this.visibleSlides - 1)) / this.visibleSlides;

        this.imgs.forEach((img) => {
            img.style.minWidth = `${this.slideWidth}px`;
        });

        const maxIndex = Math.max(0, this.imgs.length - this.visibleSlides);
        if (this.currentIndex > maxIndex) this.currentIndex = maxIndex;

        this.moveToSlide(this.currentIndex);
    }

    // Mover carrusel
    moveToSlide(index) {
        const offset = -(index * (this.slideWidth + this.gap));
        this.carousel.style.transition = "transform 0.3s ease";
        this.carousel.style.transform = `translateX(${offset}px)`;
        this.prevTranslate = offset;

        // 🔥 Actualizar estado de los botones
        const maxIndex = this.imgs.length - this.visibleSlides;

        if (this.prevBtn) {
            this.prevBtn.style.opacity = index <= 0 ? "0.3" : "1";
            this.prevBtn.style.pointerEvents = index <= 0 ? "none" : "auto";
        }

        if (this.nextBtn) {
            this.nextBtn.style.opacity = index >= maxIndex ? "0.3" : "1";
            this.nextBtn.style.pointerEvents = index >= maxIndex ? "none" : "auto";
        }
    }

    // Swipe handlers
    touchStart(e) {
        this.startX = e.type.includes("mouse") ? e.pageX : e.touches[0].clientX;
        this.isDragging = false;
        this.mouseDown = e.type.includes("mouse");
        this.carousel.style.transition = "none";
    }

    touchMove(e) {
        const currentX = e.type.includes("mouse") ? e.pageX : e.touches[0].clientX;
        const diff = currentX - this.startX;

        if (e.type.includes("mouse") && !this.mouseDown) return;

        if (Math.abs(diff) > 5) {
            this.isDragging = true;
            this.currentTranslate = this.prevTranslate + diff;
            this.carousel.style.transform = `translateX(${this.currentTranslate}px)`;
        }
    }

    touchEnd() {
        if (!this.isDragging) {
            this.mouseDown = false;
            return;
        }

        const movedBy = this.currentTranslate - this.prevTranslate;

        if (Math.abs(movedBy) < this.SWIPE_THRESHOLD) {
            this.moveToSlide(this.currentIndex);
            this.isDragging = false;
            this.mouseDown = false;
            return;
        }

        const totalSlideWidth = this.slideWidth + this.gap;
        let rawIndex = -this.currentTranslate / totalSlideWidth;
        this.currentIndex = Math.round(rawIndex);

        if (this.currentIndex < 0) this.currentIndex = 0;
        if (this.currentIndex > this.imgs.length - this.visibleSlides)
            this.currentIndex = this.imgs.length - this.visibleSlides;

        this.moveToSlide(this.currentIndex);

        this.isDragging = false;
        this.mouseDown = false;
    }
}

// Registrar el custom element
customElements.define("custom-carousel", Carousel);