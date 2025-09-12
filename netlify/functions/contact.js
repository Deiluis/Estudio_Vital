import nodemailer from "nodemailer";

// Función para sanitizar los inputs
const sanitizeInput = (value) => {
    if (typeof value !== "string") return "";
    return value.trim().replace(/\s+/g, " ");
};

// Validación de los campos
const validateData = (data) => {
    const errors = {};

    // Campos obligatorios
    if (!data.name) errors.name = "El nombre es obligatorio.";
    if (!data.email) errors.email = "El email es obligatorio.";
    if (!data.tel) errors.tel = "El teléfono es obligatorio.";
    if (!data.message) errors.message = "La consulta es obligatoria.";

    // Formato y límites
    if (data.name && data.name.length > 100) errors.name = "Máximo 100 caracteres.";
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = "Formato de email inválido.";
    if (data.tel && !/^[0-9+\-()\s]{7,20}$/.test(data.tel)) errors.tel = "Formato de teléfono inválido.";
    if (data.message && data.message.length > 3000) errors.message = "Máximo 3000 caracteres.";

    // Caracteres permitidos (opcional extra)
    const allowedPattern = /^[a-zA-Z0-9ÁÉÍÓÚÑáéíóúñ\s@.\-_,+()?!¿¡]*$/;
    if (data.name && !allowedPattern.test(data.name)) errors.name = "Contiene caracteres no permitidos.";
    if (data.message && !allowedPattern.test(data.message)) errors.message = "Contiene caracteres no permitidos.";

    return errors;
};

export const handler = async (event, context) => {
    try {
        // Obtener token enviado desde el frontend
        const { recaptchaToken } = JSON.parse(event.body);

        // Verificar con Google.
        const verifyResponse = await fetch(
            `https://www.google.com/recaptcha/api/siteverify`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `secret=${process.env.RECAPTCHA_SECRET}&response=${recaptchaToken}`
            }
        );

        const result = await verifyResponse.json();

        // Si el token no es válido, se bloquea.
        if (!result.success || result.score < 0.5) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Validación reCAPTCHA fallida." })
            };
        }

        const rawData = JSON.parse(event.body);

        // Sanitizar inputs
        const data = {
            name: sanitizeInput(rawData.name),
            email: sanitizeInput(rawData.email),
            tel: sanitizeInput(rawData.tel),
            message: sanitizeInput(rawData.message),
        };

        // Validar
        const errors = validateData(data);
        if (Object.keys(errors).length > 0) {
            return {
                statusCode: 400,
                body: JSON.stringify({ errors }),
            };
        }

        // Configuración de nodemailer
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: process.env.SMTP_SECURE === "true",
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        // Definir el correo
        const mailOptions = {
            from: `${data.name}`,
            to: process.env.CONTACT_RECEIVER,
            subject: `Nuevo mensaje de contacto de ${data.name}`,
            text: `Nombre: ${data.name}\nEmail: ${data.email}\nTel: ${data.tel}\nConsulta: ${data.message}`
        };

        // Enviar correo
        await transporter.sendMail(mailOptions);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Formulario enviado correctamente.",
            }),
        };
    } catch (err) {
        console.error("Error en handler:", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Error interno del servidor." }),
        };
    }
};