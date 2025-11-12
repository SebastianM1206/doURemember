import { supabase } from "../supabase/supabaseClient";

const TABLE_NAME = "fotos";
const STORAGE_BUCKET = "imgs";
const SUPABASE_URL = import.meta.env.VITE_PUBLIC_SUPABASE_URL || "";
const PUBLIC_BUCKET_PREFIX = `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/`;

// Columnas a seleccionar en las consultas
const baseSelect = "foto_id, descripcion, url, grupo_id";

const isDataUrl = (value) =>
  typeof value === "string" && value.startsWith("data:");

const getFallbackId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

function normalizeImage(record) {
  if (!record) return null;
  return {
    id: record.foto_id,
    descripcion: record.descripcion,
    url: record.url,
    grupoId: record.grupo_id,
    titulo: record.descripcion,
    categoria: "general",
  };
}

function extractStoragePath(reference) {
  if (!reference) return null;
  const bucketMarker = `${STORAGE_BUCKET}/`;

  if (reference.startsWith(PUBLIC_BUCKET_PREFIX)) {
    return reference.replace(PUBLIC_BUCKET_PREFIX, "");
  }

  if (reference.startsWith("http")) {
    return reference.includes(bucketMarker)
      ? reference.split(bucketMarker)[1]
      : null;
  }

  if (reference.startsWith(bucketMarker)) {
    return reference.slice(bucketMarker.length);
  }

  return reference;
}


async function removeStorageObject(reference) {
  const path = extractStoragePath(reference);
  if (!path) return;

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .remove([path]);

  if (error) {
    console.warn("No se pudo eliminar el archivo del bucket:", error.message);
  }
}

async function fetchImageRow(id) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select(baseSelect)
    .eq("foto_id", id)
    .single();

  if (error) {
    console.error("Error obteniendo imagen:", error.message);
    throw new Error("No se pudo obtener la imagen solicitada");
  }

  return data;
}

export async function getImages() {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select(baseSelect)

  if (error) {
    console.error("Error obteniendo imagenes:", error.message);
    throw new Error("No se pudieron cargar las imagenes");
  }

  console.log("Imagenes obtenidas:", data);

  return (data || []).map(normalizeImage);
}

export async function createImage({ descripcion, file, grupo_id }) {

  if (!descripcion || !descripcion.trim()) {
    throw new Error("La descripcion es obligatoria");
  }

  const path = `${Date.now()}_${file.name}`;  
  
  //Subir la imagen al storage de supabase
  const { data, error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file)
  if (error) {
      console.error("Error subiendo la imagen:", error.message);
  } else {
    console.log("Imagen subida con éxito:", data);

    // Obtener la URL pública de la imagen subida
    const { data: publicURL, error: urlError } = supabase
      .storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(path);

    if (urlError) {
      console.error("Error obteniendo la URL pública:", urlError.message);
      throw new Error("No se pudo obtener la URL pública de la imagen");
    }else {
      console.log("URL pública obtenida:", publicURL);
      
      // Insertar el registro en la tabla de imágenes
      const { data: insertData, error: insertError } = await supabase
        .from(TABLE_NAME)
        .insert([{ descripcion, url: publicURL.publicUrl, grupo_id: grupo_id }])
        .select(baseSelect)
        .single();

      if (insertError) {
        console.error("Error insertando la imagen:", insertError.message);
        throw new Error("No se pudo guardar la imagen");
      }

      return normalizeImage(insertData);
    }
  }
}

export async function updateImage(id, { descripcion, file }) {
  if (!id) {
    throw new Error("El identificador de la imagen es obligatorio");
  }

  const current = await fetchImageRow(id);
  const updates = {};
  let shouldRemovePreviousFile = false;

  if (typeof descripcion === "string") {
    updates.descripcion = descripcion.trim();
  }

  // Si hay un nuevo archivo, subirlo al storage
  if (file && file instanceof File) {
    const path = `${Date.now()}_${file.name}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(path, file);

    if (uploadError) {
      console.error("Error subiendo la imagen:", uploadError.message);
      throw new Error("No se pudo subir la nueva imagen");
    }

    console.log("Imagen actualizada subida con éxito:", uploadData);

    // Obtener la URL pública de la nueva imagen
    const { data: publicURL, error: urlError } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(path);

    if (urlError) {
      console.error("Error obteniendo la URL pública:", urlError.message);
      // Eliminar el archivo recién subido si falla
      await removeStorageObject(path);
      throw new Error("No se pudo obtener la URL pública de la imagen");
    }

    updates.url = publicURL.publicUrl;
    shouldRemovePreviousFile = Boolean(current.url);
    console.log("Nueva URL pública:", publicURL.publicUrl);
  }

  if (Object.keys(updates).length === 0) {
    return normalizeImage(current);
  }

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update(updates)
    .eq("foto_id", id)
    .select(baseSelect)
    .single();

  if (error) {
    // Si falla la actualización y se subió un archivo nuevo, eliminarlo
    if (updates.url) {
      await removeStorageObject(updates.url);
    }
    console.error("Error actualizando imagen:", error.message);
    throw new Error("No se pudo actualizar la imagen");
  }

  // Eliminar el archivo anterior solo después de actualizar exitosamente
  if (shouldRemovePreviousFile && current.url) {
    await removeStorageObject(current.url);
  }

  return normalizeImage(data);
}

export async function deleteImage(id) {
  if (!id) {
    throw new Error("El identificador de la imagen es obligatorio");
  }

  const current = await fetchImageRow(id);

  const { error } = await supabase.from(TABLE_NAME).delete().eq("foto_id", id);

  if (error) {
    console.error("Error eliminando imagen:", error.message);
    throw new Error("No se pudo eliminar la imagen");
  }

  if (current?.url) {
    await removeStorageObject(current.url);
  }
}
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
