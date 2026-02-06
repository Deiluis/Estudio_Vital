import { HTMLRewriter } from "https://ghuc.cc/worker-tools/html-rewriter/index.ts";

export default async (request, context) => {
	const url = new URL(request.url);

	// Solo actuar si la ruta es /obra/nombre-de-obra
	if (!url.pathname.startsWith("/obra/")) {
		return;
	}

	const projectName = url.pathname.split("/")[2];
	if (!projectName) return;

	try {
		// 1. Obtenemos los datos de tus proyectos (usamos tu JSON actual)
		const responseData = await fetch("https://estudiovital.com/assets/js/projects/detailed.json");
		const projects = await responseData.json();
		const project = projects.find(p => p.name === projectName);

		if (!project) return;

		// 2. Definimos las variables (igual que en tu función original)
		const title = `${project.title} | Estudio Vital`;
		const description = project.description;
		const image = `https://estudiovital.com/assets/img/proyectos/${project.name}/${project.banner}`;
		const absoluteUrl = url.href;

		// 3. Obtenemos la respuesta original (el index.html vacío)
		const response = await context.next();

		// 4. Inyectamos los metadatos "en caliente"
		return new HTMLRewriter()
			.on("title", { element(e) { e.setInnerContent(title); } })
			.on("meta[name='description']", { element(e) { e.setAttribute("content", description); } })
			// Open Graph
			.on("meta[property='og:url']", { element(e) { e.setAttribute("content", absoluteUrl); } })
			.on("meta[property='og:title']", { element(e) { e.setAttribute("content", title); } })
			.on("meta[property='og:description']", { element(e) { e.setAttribute("content", description); } })
			.on("meta[property='og:image']", { element(e) { e.setAttribute("content", image); } })
			// Twitter
			.on("meta[property='twitter:url']", { element(e) { e.setAttribute("content", absoluteUrl); } })
			.on("meta[name='twitter:title']", { element(e) { e.setAttribute("content", title); } })
			.on("meta[name='twitter:description']", { element(e) { e.setAttribute("content", description); } })
			.on("meta[name='twitter:image']", { element(e) { e.setAttribute("content", image); } })
			.transform(response);

	} catch (error) {
		console.error("Error en Edge Function:", error);
		return; // Si falla, que siga el flujo normal (JS del cliente)
	}
};

export const config = { path: "/obra/*" };