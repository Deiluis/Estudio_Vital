const desktopCreditsContainer = document.querySelector("#principal div");
const mobileCreditsContainer = document.querySelector("#creditos");

const renderProject = (projects, idx, creditsList) => {
    
    const project = projects[idx];

    const banner = document.querySelector("#hero img");
    const blueprint = document.querySelector("#principal img");
    const title = document.querySelector("#principal h2");
    const subtitle = document.querySelector("#principal h3");
    const surfaceContainer = document.querySelector("#principal span");
    const description = document.querySelector("#descripcion");
    const gallery = document.querySelector("#galeria div");
    const mainContainer = document.querySelector("main");
    const carouselsSection = document.querySelector("#carruseles");
    const carousel1Container = document.querySelector("#carrusel-imagenes");
    const carousel2Container = document.querySelector("#carrusel-planos");
    const carousel1 = document.querySelector("#carrusel-imagenes .carrusel__images");
    const carousel2 = document.querySelector("#carrusel-planos .carrusel__images");
    const selectorObra = document.querySelector("#selector-obra");

    let prevProject;
    let nextProject;

    let imgCounter = 0;
    let links = 0;
    let i;

    creditsList.className = "flex flex-col gap-4";

    banner.src = `/assets/img/proyectos/${project.name}/${project.banner}`;

    if (project["banner-obj-position"])
        banner.classList.add(`object-${project["banner-obj-position"]}`);

    blueprint.src = `/assets/img/proyectos/${project.name}/${project.blueprint}`;
    title.innerHTML = project.title;
    subtitle.innerHTML = project.subtitle;

    if (project?.surface)
        surfaceContainer.innerHTML = project.surface;

    project.credits.forEach(credit => {
        const item = document.createElement("li");
        item.innerHTML = credit;
        creditsList.appendChild(item);
    });

    if (window.innerWidth < 640)
        mobileCreditsContainer.appendChild(creditsList);
    else
        desktopCreditsContainer.appendChild(creditsList);

    project.description.forEach(desc => {
        const p = document.createElement("p");
        p.innerHTML = desc;
        description.appendChild(p);
    });

    project.gallery.forEach((src, i) => {
        const img = document.createElement("img");
        img.src = `/assets/img/proyectos/${project.name}/${src}`;
        img.alt = "Foto de la obra";
        img.classList = "object-contain w-full lg:w-3/4";
        img.loading = "lazy";

        imgCounter++;

        if (imgCounter == 1)
            img.classList.add("lg:w-full"); 
        else if (imgCounter == 2)
            img.classList.add("self-start");
        else {
            img.classList.add("self-end");
            imgCounter = 0;
        }
            
        gallery.appendChild(img);
    });              

    if (project.carousel1.length > 0) {
        project.carousel1.forEach(src => addSlide(project.name, src, carousel1));

        // Espera a que se hayan cargado los elementos para calcular el tamaño de los slides.
        Promise
        .all(
            Array.from(carousel1.querySelectorAll("img")).map(img =>
                img.complete ? Promise.resolve() : new Promise(res => img.onload = res)
            )
        )
        .then(() => carousel1Container.updateVisibleSlides());
    } else
        carouselsSection.removeChild(carousel1Container);
        
    if (project.carousel2.length > 0) {
        project.carousel2.forEach(src => addSlide(project.name, src, carousel2));

        Promise.all(
            Array.from(carousel2.querySelectorAll("img")).map(img =>
                img.complete ? Promise.resolve() : new Promise(res => img.onload = res)
            )
        )
        .then(() => carousel2Container.updateVisibleSlides());
    } else
        carouselsSection.removeChild(carousel2Container);

    if (carouselsSection.children.length == 0)
        mainContainer.removeChild(carouselsSection);

    // Obtiene el proyecto anterior que pueda mostrarse.
    i = idx -1; 

    while (i >= 0 && !projects[i]?.show)
        i--;

    prevProject = projects[i];

    // Obtiene el proyecto proximo que pueda mostrarse.
    i = idx +1; 

    while (i < projects.length && !projects[i]?.show)
        i++;

    nextProject = projects[i];

    if (prevProject) {
        const btn = document.createElement("a");
        btn.className = "flex items-center text-3xl text-[--black] gap-6";
        btn.href = `/obra/${prevProject.name}`;

        btn.innerHTML = `
            <i class="fa-solid fa-chevron-left gap-4"></i>
            <div class="flex flex-col items-center">
                <h4>${prevProject.title}</h4>
                <span>Obra anterior</span>
            </div>
        `;

        selectorObra.appendChild(btn);
        links++;
    }

    if (nextProject) {
        const btn = document.createElement("a");
        btn.className = "flex items-center text-3xl text-[--black] gap-6";
        btn.href = `/obra/${nextProject.name}`;

        btn.innerHTML = `
            <div class="flex flex-col items-center">
                <h4>${nextProject.title}</h4>
                <span>Obra siguiente</span>
            </div>
            <i class="fa-solid fa-chevron-right"></i>
        `;

        selectorObra.appendChild(btn);
        links++;
    }

    if (links === 1)
        selectorObra.classList.add("justify-center");
    else
        selectorObra.classList.add("justify-between");
};

const addSlide = (name, src, container) => {
    const article = document.createElement("article");
    article.classList = "relative rounded-xl";

    const overlay = document.createElement("div");
    overlay.classList = `
    slider__show-button bg-[--black] opacity-0 hover:opacity-70 transition-opacity 
    duration-500 absolute bottom-0 left-0 z-[1000] w-full h-full flex flex-col 
    items-center justify-center cursor-pointer rounded-xl
    `;
    overlay.innerHTML = `<i class="text-white fas fa-magnifying-glass-plus text-5xl"></i>`;

    const img = document.createElement("img");
    img.src = `/assets/img/proyectos/${name}/${src}`;
    img.alt = "Foto de la obra";
    img.classList = "w-full h-full object-cover rounded-xl";
    img.loading = "lazy";

    article.appendChild(img);
    article.appendChild(overlay);
    container.appendChild(article);
};

const init = async () => {
    const pathParts = window.location.pathname.split("/");
    const projectName = pathParts[2];

    let idx;
    let projects = [];

    try {
        const res = await fetch("/assets/js/projects/detailed.json");
        projects = await res.json();
    } catch (err) {
        console.error("Error al cargar:", err);
    }

    idx = projects.findIndex(p => p.name == projectName);

    if (projects[idx]) {

        const creditsList = document.createElement("ul");
        renderProject(projects, idx, creditsList);

        window.addEventListener("resize", () => {
            if (window.innerWidth < 640)
                mobileCreditsContainer.appendChild(creditsList);
            else
                desktopCreditsContainer.appendChild(creditsList);
        });

        window.prerenderReady = true;
    }
        
    else
        window.location.href = "/"
};

init();