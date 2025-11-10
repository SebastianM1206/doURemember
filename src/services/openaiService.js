import OpenAI from "openai";

const openai = new OpenAI({
    baseURL: "https://api.openai.com/v1/",
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
});

export async function getCompletion(descArray) {
    const response = await openai.chat.completions.create({
        messages: [
            { role: "system", content: "Eres un experto en evaluación. Tu tarea es asignar puntuaciones de 1 a 5 a los siguientes criterios para cada par de descripciones:topical_consistency, logica_flow, linguistic_complexity, presence_entities, accuracy_details, omission_rate, comission_rate. Asegúrate de ser objetivo y preciso en tu evaluación." },
            {role: "user", content: `por favor, asigna una puntuación de 1 a 5 a cada uno de los siguientes criterios:
                        topical_consistency (Evalúa si la descripción original está alineada con la descripción proporcionada por el paciente.),
                        logica_flow (Evalúa si la secuencia de ideas o eventos tiene una progresión lógica), 
                        linguistic_complexity (Mide el nivel de complejidad lingüística, que incluye el uso de vocabulario y estructura gramatical),
                        presence_entities (Evalúa cuántas entidades (personas, objetos, etc.) están presentes en la descripción y si son relevantes),
                        accuracy_details (Se refiere a la precisión de los detalles en relación con la descripción original),
                        omission_rate (Mide cuántos elementos relevantes se omiten en la descripción proporcionada por el paciente),
                        comission_rate (Evalúa cuántos elementos irrelevantes o incorrectos se agregan en la descripción proporcionada),
                        para cada objeto en el siguiente array:\n${descArray}\n
                        MEDIDA DE RESPUESTA\n
                        Necesito que me devuelvas solamente un arreglo de objetos de la misma longitud en el que cada objeto solo tenga como atributos cada criterio con su puntuacion.`
                    }
        ],
        model: "gpt-4o-mini",
        store: false,
    });
    return {completion: response.choices[0].message.content};
};