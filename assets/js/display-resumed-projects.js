import { resumed } from "./projects.js";

const generateProjects = () => {
    const projectsSection = document.querySelector("#proyectos");

    console.log(projectsSection);

    resumed.forEach(project => {
        // Crear el artículo
        const article = document.createElement('article');
        article.className = "card h-[30rem] text-white relative overflow-hidden rounded transition-shadow duration-500 hover:shadow-2xl hover:shadow-black";
        
        // Crear el enlace dentro del artículo
        const a = document.createElement('a');
        a.href = project.link;
        a.className = "bg-[#2227] opacity-100 md:opacity-0 hover:opacity-100 transition-opacity duration-500 absolute bottom-0 left-0 z-[1000] w-full h-full flex flex-col items-center justify-center";
        
        // Crear el título y la descripción dentro del enlace
        const h3 = document.createElement('h3');
        h3.className = "text-6xl";
        h3.textContent = project.title;
        
        const span = document.createElement('span');
        span.className = "text-3xl mt-8";
        span.innerHTML = `Ver el proyecto <i class="fa-solid fa-chevron-right"></i>`;
        
        // Crear la imagen dentro del artículo
        const img = document.createElement('img');
        img.className = "w-full h-full object-cover transition-transform duration-500";
        img.src = project.img;
        img.alt = `Imagen del proyecto ${project.title}`;
        
        // Agregar el título y la descripción al enlace
        a.appendChild(h3);
        a.appendChild(span);
        
        // Agregar el enlace y la imagen al artículo
        article.appendChild(a);
        article.appendChild(img);
        
        // Agregar el artículo a la sección
        projectsSection.appendChild(article);
    });
}

generateProjects();