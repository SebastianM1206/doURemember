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