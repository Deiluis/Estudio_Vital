export const handler = async (event, context) => {
    try {
        // El body viene como string → lo parseamos
        const data = JSON.parse(event.body);

        // Ejemplo de verificación
        console.log("Datos recibidos:", data);

        // Podés aplicar validaciones acá también
        if (!data.nombre || !data.email) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: "Faltan campos obligatorios"
                }),
            };
        }

        return { 
            statusCode: 200,
            body: JSON.stringify({
                message: "Funca",
                received: data
            }),
        };

    } catch (err) {
        console.error("Error en handler:", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Error interno" }),
        };
    }
};