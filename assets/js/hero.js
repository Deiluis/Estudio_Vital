const hero = document.querySelector('#hero');

const fadeDuration = 1500;
const visibleDuration = 5000;

const init = async () => {
    const res = await fetch("/assets/js/projects/resumed.json");
    const resumed = await res.json();

    // Cargar imágenes en el DOM
    resumed.forEach(project => {
        const img = document.createElement("img");
        img.className = `
      hero__img absolute top-0 left-0 w-full h-full object-cover
      transition-all duration-[${fadeDuration}ms] opacity-0
    `;
        img.src = project.img;
        img.alt = `Imagen del proyecto ${project.title}`;
        img.loading = "lazy";
        hero.appendChild(img);
    });

    const images = document.querySelectorAll(".hero__img");
    let current = 0;

    function showImage(index) {
        images.forEach((img, i) => {
            if (i === index) {
                img.classList.remove("opacity-0");
            } else {
                img.classList.add("opacity-0");
            }
        });
    }

    const startSlideshow = () => {
        showImage(current);

        setInterval(() => {
            current = (current + 1) % images.length;
            showImage(current);
        }, visibleDuration + fadeDuration); // tiempo visible + transición
    };

    // Esperar que carguen las imágenes antes de iniciar
    Promise.all(
        Array.from(images).map(img =>
            img.complete ? Promise.resolve() : new Promise(res => (img.onload = res))
        )
    ).then(startSlideshow);
};

init();