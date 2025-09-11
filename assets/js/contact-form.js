const form = document.querySelector("#contacto form");

const constraints = {
    name: { max: 100 },
    tel: { regex: /^[0-9+\-()\s]{7,20}$/, max: 20 },
    email: { regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, max: 254 },
    message: { max: 3000 },
};

// Sanitizar entrada
const sanitizeInput = (value) => {
    if (typeof value !== "string")
        return value;
    return value.trim().replace(/\s+/g, " ")
};

// Validación en vivo: solo longitud máxima
const handleChange = (e) => {
    const { name, value } = e.target;

    const max = constraints[name]?.max;
    let errorEl = e.target.nextElementSibling;
    if (!errorEl || !errorEl.classList.contains("error-message")) {
        errorEl = document.createElement("span");
        errorEl.className = "error-message text-red-500 mt-1";
        e.target.insertAdjacentElement("afterend", errorEl);
    }

    if (max && value.length >= max) {
        e.target.value = value.slice(0, max);
        errorEl.textContent = `Máximo ${max} caracteres.`;
        e.target.classList.add("error");
    } else {
        // Si había error, eliminarlo al escribir
        if (errorEl.textContent) {
            errorEl.textContent = "";
            e.target.classList.remove("error");
        }
    }
};

// Validar formulario al enviar (no incluye longitud máxima)
const validateForm = (data) => {
    const errors = {};

    for (let key in data) {
        const value = data[key];

        // Campo vacío o solo espacios/tabulaciones
        if (!value || value.trim().length === 0) {
            errors[key] = "Este campo es obligatorio.";
            continue;
        }

        // Ningún campo con caracteres especiales (solo letras, números, espacios, . , - _)
        if (/[^a-zA-Z0-9\s@.\-_,+()]/.test(value)) {
            errors[key] = "Contiene caracteres no permitidos.";
            continue;
        }

        // Validaciones específicas (regex)
        if (constraints[key]?.regex && !constraints[key].regex.test(value)) {
            errors[key] = "Formato inválido.";
        }
    }

    return errors;
};

// Mostrar errores con shake y borde rojo
const showErrors = (errors) => {
    document.querySelectorAll(".error-message").forEach(el => el.remove());

    for (let key in errors) {
        const input = form.querySelector(`[name="${key}"]`);
        if (!input) continue;

        const error = document.createElement("span");
        error.className = "error-message text-red-500 mt-1";
        error.textContent = errors[key];
        input.insertAdjacentElement("afterend", error);

        input.classList.add("error");

        input.classList.add("shake");
        setTimeout(() => input.classList.remove("shake"), 500);
    }
};

// Escuchar cambios en los inputs para limitar caracteres y quitar error obligatorio
form.querySelectorAll("input, textarea").forEach(input => {
    input.addEventListener("input", handleChange);
});

// Mostrar indicador general
const showIndicator = (message, success = true) => {
    let indicator = document.querySelector("#form-indicator");
    if (!indicator) {
        indicator = document.createElement("div");
        indicator.id = "form-indicator";
        indicator.className = "mt-2 text-sm font-semibold";
        form.insertAdjacentElement("afterend", indicator);
    }
    indicator.textContent = message;
    indicator.style.color = success ? "green" : "red";
};

// Enviar formulario
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    showIndicator(""); // limpiar indicador

    const formData = new FormData(form);
    const rawData = Object.fromEntries(formData.entries());

    const data = {};
    for (let key in rawData) {
        data[key] = sanitizeInput(rawData[key]);
    }

    const errors = validateForm(data);

    if (Object.keys(errors).length > 0) {
        showErrors(errors);
        return;
    }

    try {
        const res = await fetch(".netlify/functions/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        const json = await res.json();
        console.log("Respuesta backend:", json);

        if (!res.ok) {

            // Aplicar errores recibidos del backend
            if (json.errors)
                showErrors(json.errors);

            return;
        }

        // Éxito
        showIndicator(json.message, true);
        form.reset();

    } catch (error) {
        console.error("Error al enviar:", error);
        showIndicator("Error en la conexión. Intenta nuevamente.", false);
    }
});