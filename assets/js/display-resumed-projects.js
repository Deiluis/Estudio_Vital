// Guardar scroll al salir o navegar
window.addEventListener("beforeunload", () => {
    try {
        if (window.sessionStorage) {
            sessionStorage.setItem("scrollY", window.scrollY);
        }
    } catch (e) {
        console.log("SessionStorage no accesible para el bot");
    }
});

// Función para restaurar scroll guardado
const restoreScroll = () => {
    try {
        // Verificamos si existe sessionStorage y si tiene el dato
        const scrollY = (window.sessionStorage) ? sessionStorage.getItem("scrollY") : null;
        
        if (scrollY !== null) {
            setTimeout(() => {
                window.scrollTo(0, parseInt(scrollY, 10));
            }, 300);
        }
    } catch (e) {
        console.log("SessionStorage no accesible para el bot");
    }
};

const generateProjects = async () => {
    const projectsContainer = document.querySelector(".obras__container");

    try {
        const res = await fetch("/assets/js/projects/resumed.json");
        const resumed = await res.json();

        resumed
            .filter(project => project.show)
            .forEach((project, i) => {
                const article = document.createElement("article");
                article.className =
                    "project w-full lg:h-[85vh] bg-white transition-shadow duration-300 shadow-2xl shadow-[--black] select-none";

                const a = document.createElement("a");
                a.href = `obra/${project.name}`;
                a.className = `
                    project__link w-full h-full flex flex-col-reverse items-center
                    ${i % 2 == 0 ? "lg:flex-row" : "lg:flex-row-reverse"}
                `;

                const sideText = document.createElement("div");
                sideText.className =
                    "lg:w-1/4 lg:h-full lg:p-16 p-4 flex flex-col lg:gap-8 gap-3 items-center justify-center";

                const h3 = document.createElement("h3");
                h3.className = "lg:text-4xl text-xl";
                h3.textContent = project.title;

                const p = document.createElement("p");
                p.className = "lg:text-[1.7rem] text-xl leading-[1.5]";
                p.textContent = project.description;

                const span = document.createElement("span");
                span.className =
                    "transition-color duration-300 text-[--light-gray] hidden lg:inline";
                span.innerHTML = `Ver la obra <i class="fa-solid fa-chevron-right"></i>`;

                sideText.appendChild(h3);
                sideText.appendChild(p);
                sideText.appendChild(span);

                a.appendChild(sideText);
                addCarousel(project.name, project.title, project.carousel, a);

                article.appendChild(a);
                projectsContainer.appendChild(article);
            });

        window.prerenderReady = true;
        restoreScroll();
        
    } catch (error) {
        window.prerenderReady = true;
        console.error("Error cargando proyectos");
    }
};

const addCarousel = (projectName, projectTitle, imagesSrc, link) => {
    const carousel = document.createElement("custom-carousel");
    carousel.classList =
        "flex items-center w-full lg:w-3/4 h-full relative";
    carousel.setAttribute("data-slides-mobile", "1");
    carousel.setAttribute("data-slides-tablet", "1");
    carousel.setAttribute("data-slides-laptop", "1");
    carousel.setAttribute("data-slides-desktop", "1");
    carousel.setAttribute("mouse-draggable", "false");

    const prevBtn = document.createElement("div");
    prevBtn.classList =
        "carrusel__button--left bg-[#2229] hover:bg-black transition-colors flex items-center justify-center rounded-full text-3xl px-5 py-4 mx-2 lg:mx-6 text-white cursor-pointer absolute left-0 translate-y-[5%] z-10 opacity-90 lg:opacity-100";
    prevBtn.innerHTML = `<i class="fas fa-chevron-left"></i>`;

    const nextBtn = document.createElement("div");
    nextBtn.classList =
        "carrusel__button--right bg-[#2229] hover:bg-black transition-colors flex items-center justify-center rounded-full text-3xl px-5 py-4 mx-2 lg:mx-6 text-white cursor-pointer absolute right-0 translate-y-[5%] z-10 opacity-90 lg:opacity-100";
    nextBtn.innerHTML = `<i class="fas fa-chevron-right"></i>`;

    prevBtn.addEventListener("click", e => {
        e.preventDefault();
        e.stopPropagation();
    });

    nextBtn.addEventListener("click", e => {
        e.preventDefault();
        e.stopPropagation();
    });

    const container = document.createElement("div");
    container.classList =
        "carrusel__container overflow-x-hidden w-full h-[35vh] lg:h-[85vh]";

    const images = document.createElement("div");
    images.classList =
        "carrusel__images flex transition-transform duration-500 w-full h-full";

    imagesSrc.forEach(src => {
        const img = document.createElement("img");
        img.className = "w-full h-full object-cover";
        img.src = `/assets/img/proyectos/${projectName}/${src}`;
        img.alt = `Imagen de la obra ${projectTitle}`;
        img.loading = "lazy";

        images.appendChild(img);
    });

    container.appendChild(images);

    carousel.appendChild(prevBtn);
    carousel.appendChild(container);
    carousel.appendChild(nextBtn);

    Promise.all(
        Array.from(carousel.querySelectorAll("img")).map(img =>
            img.complete
                ? Promise.resolve()
                : new Promise(res => (img.onload = res))
        )
    ).then(() => carousel.updateVisibleSlides());

    link.appendChild(carousel);
};

generateProjects();