// Utilidades para manejo de archivos e imágenes

/**
 * Formatea el tamaño de un archivo en bytes a una representación legible
 * @param {number} bytes - Tamaño del archivo en bytes
 * @returns {string} - Tamaño formateado (ej: "2.5 MB")
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Valida si un archivo de imagen cumple con los requisitos
 * @param {File} file - Archivo a validar
 * @returns {Object} - {isValid: boolean, error: string}
 */
export const validateImageFile = (file) => {
  if (!file) {
    return { isValid: false, error: 'No se ha seleccionado ningún archivo' }
  }
  
  // Validar tipo de archivo
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    return { 
      isValid: false, 
      error: 'Tipo de archivo no permitido. Solo se permiten: JPEG, PNG, WebP' 
    }
  }
  
  // Validar tamaño de archivo (5MB)
  const maxSize = 5 * 1024 * 1024 // 5MB en bytes
  if (file.size > maxSize) {
    return { 
      isValid: false, 
      error: `El archivo es demasiado grande (${formatFileSize(file.size)}). Tamaño máximo: 5MB` 
    }
  }
  
  return { isValid: true, error: null }
}

/**
 * Genera un nombre único para el archivo
 * @param {string} originalName - Nombre original del archivo
 * @returns {string} - Nombre único generado
 */
export const generateUniqueFileName = (originalName) => {
  const fileExt = originalName.split('.').pop()
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2)
  return `${timestamp}_${randomString}.${fileExt}`
}

/**
 * Configuración del bucket de Supabase
 */
export const BUCKET_CONFIG = {
  name: 'imgs',
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  allowedExtensions: ['jpg', 'jpeg', 'png', 'webp']
}
