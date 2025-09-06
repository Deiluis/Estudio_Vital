const banner = document.querySelector("#hero img");
const blueprint = document.querySelector("#principal img");
const title = document.querySelector("#principal h2");
const subtitle = document.querySelector("#principal h3");
const credits = document.querySelector("#principal ul");
const description = document.querySelector("#descripcion");
const gallery = document.querySelector("#galeria div");
const carousel1Container = document.querySelector("#carrusel-imagenes");
const carousel2Container = document.querySelector("#carrusel-planos");
const carousel1 = document.querySelector("#carrusel-imagenes .carrusel__images");
const carousel2 = document.querySelector("#carrusel-planos .carrusel__images");

const getDetailedProject = async (projectName) => {

    let detailedProject;

    try {
        const res = await fetch("/assets/js/projects/detailed.json");
        const projects = await res.json();
        detailedProject = projects.find(p => p.name == projectName);
    } catch (err) {
        console.error("Error al cargar projects/resumed.json:", err);
    }
    
    return detailedProject;
};

const renderProject = (project) => {
    banner.src = project.banner;
    blueprint.src = project.blueprint;
    title.innerHTML = project.title;
    subtitle.innerHTML = project.subtitle;
    
    const surface = document.createElement("li");
    surface.innerHTML = project?.surface;
    credits.appendChild(surface);

    project.credits.forEach(credit => {
        const item = document.createElement("li");
        item.innerHTML = credit;
        credits.appendChild(item);
    });

    project.description.forEach(desc => {
        const p = document.createElement("p");
        p.innerHTML = desc;
        description.appendChild(p);
    });

    project.gallery.forEach((src, i) => {
        const img = document.createElement("img");
        img.src = src;
        img.alt = "Foto de la obra";
        img.classList = "lg:h-[85vh] object-contain";
        img.loading = "lazy";

        if ((i + 1) % 2 == 0)
            img.classList.add((i + 1) % 4 == 0 ? "self-end" : "self-start");

        gallery.appendChild(img);
    });              

    project.carousel1.forEach(src => addSlide(src, carousel1));
    project.carousel2.forEach(src => addSlide(src, carousel2));

    // Espera a que se hayan cargado los elementos para calcular el tamaño de los slides.
    Promise
    .all(
        Array.from(carousel1.querySelectorAll("img")).map(img =>
            img.complete ? Promise.resolve() : new Promise(res => img.onload = res)
        )
    )
    .then(() => carousel1Container.updateVisibleSlides());

    Promise.all(
        Array.from(carousel2.querySelectorAll("img")).map(img =>
            img.complete ? Promise.resolve() : new Promise(res => img.onload = res)
        )
    )
    .then(() => carousel2Container.updateVisibleSlides());
};

const addSlide = (src, container) => {
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
    img.src = src;
    img.alt = "Foto de la obra";
    img.classList = "w-full h-full object-cover rounded-xl";
    img.loading = "lazy";

    article.appendChild(img);
    article.appendChild(overlay);
    container.appendChild(article);
};

const init = async () => {
    const pathParts = window.location.pathname.split("/");
    const projectName = pathParts[2]; // undefined si es solo /proyecto

    const project = await getDetailedProject(projectName);

    if (project)
        renderProject(project);
    else
        window.location.href = "/proyectos"
};

init();