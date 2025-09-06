const generateProjects = async () => {
    const projectsContainer = document.querySelector(".proyectos__container");

    const res = await fetch("/assets/js/projects/resumed.json");
    const resumed = await res.json();

    resumed.forEach((project, i) => {

        // Crear el artículo
        const article = document.createElement('article');
        article.className = "project lg:h-[85vh] bg-white transition-shadow duration-300 shadow-2xl shadow-[--black] rounded-xl";
        article.setAttribute("data-aos", `fade-${i % 2 == 0 ? "right" : "left"}`);

        // Crear el enlace dentro del artículo
        const a = document.createElement('a');
        a.href = `proyecto/${project.name}`;
        a.className = `
            project__link w-full h-full flex flex-col-reverse items-center
            ${i % 2 == 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}
        `;
        
        const sideText = document.createElement('div');
        sideText.className = "lg:w-1/4 lg:h-full lg:p-16 p-4 flex flex-col lg:gap-8 gap-3 items-center justify-center";

        // Crear el título y la descripción dentro del enlace
        const h3 = document.createElement('h3');
        h3.className = "lg:text-4xl text-xl"
        h3.textContent = project.title;
        
        const p = document.createElement('p');
        p.className = "lg:text-[1.7rem] text-xl leading-[1.5]";
        p.textContent = project.description;

        const span = document.createElement('span');
        span.className = "transition-color duration-300 text-[--light-gray] hidden lg:inline";
        span.innerHTML = `Ver el proyecto <i class="fa-solid fa-chevron-right"></i>`;
        
        // Crear la imagen dentro del artículo
        const img = document.createElement('img');
        img.className = `
            lg:w-3/4 lg:h-full w-full h-96 object-cover rounded-t-xl
            ${i % 2 == 0 ? 'lg:rounded-r-xl lg:rounded-tl-none' : 'lg:rounded-l-xl lg:rounded-tr-none'}
        `;
        img.src = `/assets/img/proyectos/${project.name}/${project.img}`;
        img.alt = `Imagen del proyecto ${project.title}`;
        img.loading = "lazy";
        
        sideText.appendChild(h3);
        sideText.appendChild(p);
        sideText.appendChild(span);
        
        a.appendChild(sideText);
        a.appendChild(img);
        
        // Agregar el enlace con todo al articulo.
        article.appendChild(a);
        
        // Agregar el artículo a la sección
        projectsContainer.appendChild(article);
    });
}

generateProjects();