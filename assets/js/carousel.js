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
        this.startY = 0;   // 👈 Nuevo
        this.isDragging = false;
        this.isScrolling = false; // 👈 Nuevo
        this.currentTranslate = 0;
        this.prevTranslate = 0;

        this.SLIDES_MOBILE = 1;
        this.SLIDES_TABLET = 3;
        this.SLIDES_LAPTOP = 4;
        this.SLIDES_DESKTOP = 5;

        this.SWIPE_MARGIN = 0.45;
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
        this.carouselContainer.addEventListener("touchmove", this.touchMove.bind(this), { passive: false });
        this.carouselContainer.addEventListener("touchend", this.touchEnd.bind(this));
        this.carouselContainer.addEventListener("mousedown", this.touchStart.bind(this));
        this.carouselContainer.addEventListener("mousemove", this.touchMove.bind(this));
        this.carouselContainer.addEventListener("mouseup", this.touchEnd.bind(this));
        this.carouselContainer.addEventListener("mouseleave", this.touchEnd.bind(this));

        this.canMouseDrag = (this.getAttribute("mouse-draggable") ?? "true") == "true";
        
        window.addEventListener("resize", this.updateVisibleSlides.bind(this));

        this.observer = new MutationObserver(() => this.updateVisibleSlides());
        this.observer.observe(this.carousel, { childList: true });

        this.updateVisibleSlides();
    }

    get imgs() {
        return Array.from(this.carousel.children);
    }

    updateVisibleSlides() {
        const width = window.innerWidth;

        const slidesMobile = parseInt(this.getAttribute("data-slides-mobile")) || this.SLIDES_MOBILE;
        const slidesTablet = parseInt(this.getAttribute("data-slides-tablet")) || this.SLIDES_TABLET;
        const slidesLaptop = parseInt(this.getAttribute("data-slides-laptop")) || this.SLIDES_LAPTOP;
        const slidesDesktop = parseInt(this.getAttribute("data-slides-desktop")) || this.SLIDES_DESKTOP;

        if (slidesMobile == slidesTablet == slidesLaptop == slidesDesktop)
            this.visibleSlides = slidesMobile;
        else if (width < 640) 
            this.visibleSlides = slidesMobile;
        else if (width < 1024) 
            this.visibleSlides = slidesTablet;
        else if (width < 1440) 
            this.visibleSlides = slidesLaptop;
        else 
            this.visibleSlides = slidesDesktop;

        this.gap = parseInt(getComputedStyle(this.carousel).gap) || 0;
        this.slideWidth =
            this.carousel.clientWidth / this.visibleSlides -
            (this.gap * (this.visibleSlides - 1)) / this.visibleSlides;

        this.imgs.forEach(img => img.style.minWidth = `${this.slideWidth}px`);

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
        }

        if (this.nextBtn) {
            this.nextBtn.style.opacity = this.currentIndex >= maxIndex ? "0.3" : "1";
        }

        this.disableDragging = this.imgs.length <= this.visibleSlides;
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

    // Swipe handlers con detección vertical
    touchStart(e) {
        if (this.disableDragging) return; 
        if (e.type.includes("mouse") && !this.canMouseDrag) return; 

        this.startX = e.type.includes("mouse") ? e.pageX : e.touches[0].clientX;
        this.startY = e.type.includes("mouse") ? e.pageY : e.touches[0].clientY;

        this.isDragging = false;
        this.isScrolling = false;
        this.mouseDown = e.type.includes("mouse");
        this.carousel.style.transition = "none";
    }

    touchMove(e) {
        if (this.disableDragging) return; 
        if (e.type.includes("mouse") && !this.canMouseDrag) return; 
        if (e.type.includes("mouse") && !this.mouseDown) return;

        const currentX = e.type.includes("mouse") ? e.pageX : e.touches[0].clientX;
        const currentY = e.type.includes("mouse") ? e.pageY : e.touches[0].clientY;
        const diffX = currentX - this.startX;
        const diffY = currentY - this.startY;

        // Detectar dirección del gesto
        if (!this.isDragging && !this.isScrolling) {
            if (Math.abs(diffY) > Math.abs(diffX)) {
                this.isScrolling = true; // gesto vertical → dejar que haga scroll
                return;
            } else {
                this.isDragging = true; // gesto horizontal → activar drag
            }
        }

        if (this.isDragging) {
            this.currentTranslate = this.prevTranslate + diffX;
            this.carousel.style.transform = `translateX(${this.currentTranslate}px)`;
            e.preventDefault(); // 👈 evita que también scrollee la página en horizontal
        }
    }

    touchEnd(e) {
        if (this.disableDragging) return; 
        if (e.type.includes("mouse") && !this.canMouseDrag) return; 

        if (!this.isDragging) {
            this.mouseDown = false;
            return;
        }

        const totalSlideWidth = this.slideWidth + this.gap;
        let rawIndex = -this.currentTranslate / totalSlideWidth;

        rawIndex += this.currentIndex > Math.abs(rawIndex) 
            ? -this.SWIPE_MARGIN 
            : this.SWIPE_MARGIN;

        this.currentIndex = Math.round(rawIndex);

        if (this.currentIndex < 0) this.currentIndex = 0;
        if (this.currentIndex > this.imgs.length - this.visibleSlides)
            this.currentIndex = this.imgs.length - this.visibleSlides;

        this.moveToSlide(this.currentIndex);

        this.isDragging = false;
        this.mouseDown = false;
    }
}

customElements.define("custom-carousel", Carousel);