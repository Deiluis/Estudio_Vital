class Carousel extends HTMLElement {
    constructor() {
        super();
        this.currentIndex = 0;
        this.visibleSlides = 1;
        this.slideWidth = 0;
        this.gap = 0;

        // Swipe / mouse
        this.mouseDown = false;
        this.startX = 0;
        this.isDragging = false;
        this.currentTranslate = 0;
        this.prevTranslate = 0;
        this.SWIPE_THRESHOLD = 20;
    }

    connectedCallback() {
        this.carousel = this.querySelector(".carrusel__images");
        this.carouselContainer = this.querySelector(".carrusel__container") || this;
        this.prevBtn = this.querySelector(".carrusel__button--left");
        this.nextBtn = this.querySelector(".carrusel__button--right");

        // Botones
        this.prevBtn?.addEventListener("click", () => this.prevSlide());
        this.nextBtn?.addEventListener("click", () => this.nextSlide());

        // Swipe / mouse
        this.carouselContainer.addEventListener("touchstart", this.touchStart.bind(this), { passive: true });
        this.carouselContainer.addEventListener("touchmove", this.touchMove.bind(this), { passive: true });
        this.carouselContainer.addEventListener("touchend", this.touchEnd.bind(this));
        this.carouselContainer.addEventListener("mousedown", this.touchStart.bind(this));
        this.carouselContainer.addEventListener("mousemove", this.touchMove.bind(this));
        this.carouselContainer.addEventListener("mouseup", this.touchEnd.bind(this));
        this.carouselContainer.addEventListener("mouseleave", this.touchEnd.bind(this));

        window.addEventListener("resize", this.updateVisibleSlides.bind(this));

        // Observador para slides dinámicos
        this.observer = new MutationObserver(() => this.updateVisibleSlides());
        this.observer.observe(this.carousel, { childList: true });

        // Inicializar
        this.updateVisibleSlides();
    }

    // Getter dinámico para siempre obtener los slides actuales
    get imgs() {
        return Array.from(this.carousel.querySelectorAll("article"));
    }

    updateVisibleSlides() {
        const width = window.innerWidth;

        if (width < 640) this.visibleSlides = 1;
        else if (width < 1024) this.visibleSlides = 3;
        else this.visibleSlides = 4;

        this.gap = parseInt(getComputedStyle(this.carousel).gap) || 0;
        this.slideWidth =
            this.carousel.clientWidth / this.visibleSlides -
            (this.gap * (this.visibleSlides - 1)) / this.visibleSlides;

        // Asignar ancho a cada slide
        this.imgs.forEach(img => img.style.minWidth = `${this.slideWidth}px`);

        // Ajustar posición si es necesario
        const maxIndex = Math.max(0, this.imgs.length - this.visibleSlides);
        if (this.currentIndex > maxIndex) this.currentIndex = maxIndex;

        this.moveToSlide(this.currentIndex);
    }

    moveToSlide(index) {
        const offset = -(index * (this.slideWidth + this.gap));
        this.carousel.style.transition = "transform 0.3s ease";
        this.carousel.style.transform = `translateX(${offset}px)`;
        this.prevTranslate = offset;

        this.updateButtons();
    }

    updateButtons() {
        const maxIndex = this.imgs.length - this.visibleSlides;

        if (this.prevBtn) {
            this.prevBtn.style.opacity = this.currentIndex <= 0 ? "0.3" : "1";
            this.prevBtn.style.pointerEvents = this.currentIndex <= 0 ? "none" : "auto";
        }

        if (this.nextBtn) {
            this.nextBtn.style.opacity = this.currentIndex >= maxIndex ? "0.3" : "1";
            this.nextBtn.style.pointerEvents = this.currentIndex >= maxIndex ? "none" : "auto";
        }
    }

    prevSlide() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.moveToSlide(this.currentIndex);
        }
    }

    nextSlide() {
        if (this.currentIndex < this.imgs.length - this.visibleSlides) {
            this.currentIndex++;
            this.moveToSlide(this.currentIndex);
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

// Registrar custom element
customElements.define("custom-carousel", Carousel);