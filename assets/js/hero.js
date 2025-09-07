const init = async () => {
    const hero = document.querySelector('#hero');
    let images;
    let links;

    const res = await fetch("/assets/js/projects/resumed.json");
    const resumed = await res.json();

    const fadeDuration = 1500;
    const visibleDuration = 5000;
    let current = 0;

    // Cargar imágenes en el DOM
    resumed.filter(project => project.show).forEach(project => {

        const link = document.createElement("a");
        link.className = `
            hero__link w-full h-full absolute top-0 left-0
            transition-all duration-[${fadeDuration}ms] opacity-0
        `;
        link.href = `proyecto/${project.name}`;

        const img = document.createElement("img");
        img.className = "hero__img absolute top-0 left-0 w-full h-full object-cover";
        img.src = `/assets/img/proyectos/${project.name}/${project.carousel[0]}`;
        img.alt = `Imagen del proyecto ${project.title}`;
        img.loading = "lazy";

        const titleContainer = document.createElement("div");
        titleContainer.className = "flex flex-col w-full h-full justify-end bg-[#0004] gap-8 absolute bottom-0 p-7 pb-48 lg:p-24 z-[100] text-white";

        const title = document.createElement("h3");
        title.className = "text-5xl";
        title.innerHTML = project.title;

        const span = document.createElement("span");
        span.className = "ml-2";
        span.innerHTML = `Ver el proyecto <i class="fa-solid fa-chevron-right"></i>`;

        titleContainer.appendChild(title);
        titleContainer.appendChild(span);
        link.appendChild(titleContainer);
        link.appendChild(img);
        hero.appendChild(link);
    });

    images = document.querySelectorAll(".hero__img");
    links = document.querySelectorAll(".hero__link");

    const showImage = (index) => {
        links.forEach((link, i) => {
            if (i === index) {
                // mostrar link activo
                link.classList.add("z-10", "pointer-events-auto");
                link.classList.remove("pointer-events-none");
                link.classList.remove("opacity-0");
            } else {
                // ocultar links inactivos
                link.classList.remove("z-10");
                link.classList.add("pointer-events-none");
                link.classList.add("opacity-0");
            }
        });
    }

    const startSlideshow = () => {
        showImage(current);

        setInterval(() => {
            let nextIndex = (current + 1) % links.length;
            let tries = 0;

            // Si la siguiente imagen no está cargada, buscar la próxima
            while (tries < links.length && !images[nextIndex].complete) {
                nextIndex = (nextIndex + 1) % links.length;
                tries++;
            }

            // Si no hay ninguna cargada, quedarse en la actual
            if (tries < links.length) {
                current = nextIndex;
                showImage(current);
            }
        }, visibleDuration + fadeDuration);
    }

    // --- Arrancar apenas la primera esté lista ---
    if (images.length > 0) {
        const firstImg = images[0];
        if (firstImg.complete) {
            startSlideshow();
        } else {
            firstImg.onload = startSlideshow;
            firstImg.onerror = () => {
                console.warn("La primera imagen no cargó, arrancando igual");
                startSlideshow();
            };
        }
    }
};

init();