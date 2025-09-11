const form = document.querySelector("#contacto form");

const sanitizeInput = (value) => {
    if (typeof value !== "string") return value;

    return value
        .trim() // elimina espacios al inicio y fin
        .replace(/\s+/g, " ") // colapsa espacios múltiples
        .replace(/[<>]/g, ""); // elimina < y > para prevenir HTML injection
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const rawData = Object.fromEntries(formData.entries());

    // Sanitizar todo
    const data = {};

    for (let key in rawData) {
        data[key] = sanitizeInput(rawData[key]);
    }

    console.log(data);

    try {
        const res = await fetch(".netlify/functions/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        console.log(res);

        res.json().then(res => console.log(res));

    } catch (error) {
        console.log(error);
    }
});