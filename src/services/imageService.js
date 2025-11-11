import { supabase } from "../supabase/supabaseClient";

/**
 * Insertar una foto en la base de datos
 * @param {Object} pictureData Datos de la foto al insertar
 * @param {string} pictureData.descripcion Deescripcion de la foto a insertar
 * @param {string} pictureData.url URL de la imagen almacenada
 * @param {string} pictureData.grupo_id Identificador del grupo al que pertenece la foto
 */
export async function insertPicture(pictureData){
    try{
        const  {data, error} = await supabase.from("fotos").insert([pictureData]);
        if(error){
            console.error("Error al insertar foto: ", error);
            return { data: null, error: data.error || "Error al insertar foto" };
        }
        return {data, error: null};
    }catch(error){
        console.error("Error al ingresar la foto")
    }
}
/**
 * Obtiene el identificador del grupo a partir del identificador del paciente
 * @param {string} patientId Identificador del paciente
 * @returns {number} Identificador del grupo asociado al paciente
 */
async function getGroupId(patientId){
    try{
        const {data, error} = await supabase.from("grupos").select("id").eq("paciente_id", patientId).single();
        if(error){
            console.error("Error al obtener el ID del grupo: ", error);
            return {data: null, error: data.error || "Error al obtener el ID del grupo"};
        }
        return {data: data.id};
    }catch(error){
        console.error("Error al obtener el grupo_id");
    }
}

/**
 * Obtiene 5 fotos aleatorias asociadas a un paciente
 * @param {string} patientId Identificador del paciente que solicita las fotos
 * @returns {array} Arreglo de las fotos aleatorias asociadas al paciente
 */
export async function getRandomPicturesByPatientId(patientId){
    const {data: groupId} = await getGroupId(patientId);
    try{
        const {data, error} = await supabase.from("fotos").select("*").eq("grupo_id", groupId);
        if(error){
            console.error("Error al obtener las fotos: ", error);
            return { data: null, error: data.error || "Error al obtener las fotos" };
        }
        const shuffled = data.sort(() => 0.5 - Math.random()).slice(0, 5);
        return {shuffled, error: null};
    }catch(error){
        console.error("Error al obtener fotos");
    }
}

/**
 * Actualizar la descipcion de la foto
 * @param {Object} newPictureData Datos de la foto a actualizar
 * @param {string} newPictureData.descipcion Nueva descripcion de la foto
 * @param {string} pictureId Identificador de la foto a actualizar
 */
export async function updatePicture(pictureId, newPictureData){
    try{
        const {data, error} = await supabase.from("fotos").update(newPictureData).eq("foto_id", pictureId);
        if(error){
            console.error("Error al actualizar la foto: ", error);
            return { data: null, error: data.error || "Error al actualizar la foto" };
        }
        return {data, error: null};
    }catch(error){
        console.error("Error al actualizar la foto");
    }
}

/**
 * Eliminar una foto a partir de su ID
 * @param {string} picturaId Identificador de la foto a eliminar
 */
export async function deletePicture(pictureId){
    try{
        const {data, error} = await supabase.from("fotos").delete().eq("foto_id", pictureId);
        if(error){
            console.error("Error al eliminar foto: ", error);
            return {data: null, error: data.error || "Error al eliminar foto"}
        }
        return {data, error: null};
    }catch(error){
        console.error("Error al eliminar la foto");
    }
}