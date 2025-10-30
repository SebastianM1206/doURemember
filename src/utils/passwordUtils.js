/**
 * Utilidades para el manejo seguro de contraseñas
 *
 * NOTA IMPORTANTE: Actualmente la función de login compara contraseñas en texto plano.
 * Para mejorar la seguridad, considera:
 *
 * 1. Hashear las contraseñas en la base de datos usando bcrypt
 * 2. Crear una función de Edge Function en Supabase para manejar el login de forma segura
 * 3. Nunca almacenar contraseñas en texto plano en la base de datos
 *
 * Ejemplo de cómo hashear contraseñas:
 * - En el backend (Node.js): usar bcrypt
 *   const bcrypt = require('bcryptjs');
 *   const hashedPassword = await bcrypt.hash(password, 10);
 *
 * - Verificar contraseña:
 *   const isValid = await bcrypt.compare(password, hashedPassword);
 */

/**
 * Valida la fortaleza de una contraseña
 * @param {string} password - La contraseña a validar
 * @returns {{isValid: boolean, errors: string[]}}
 */
export const validatePassword = (password) => {
  const errors = [];

  if (password.length < 8) {
    errors.push("La contraseña debe tener al menos 8 caracteres");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("La contraseña debe contener al menos una letra mayúscula");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("La contraseña debe contener al menos una letra minúscula");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("La contraseña debe contener al menos un número");
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("La contraseña debe contener al menos un carácter especial");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Valida el formato de un correo electrónico
 * @param {string} email - El correo a validar
 * @returns {boolean}
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Genera una contraseña aleatoria segura
 * @param {number} length - La longitud de la contraseña (por defecto 12)
 * @returns {string}
 */
export const generatePassword = (length = 12) => {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const special = '!@#$%^&*(),.?":{}|<>';
  const all = uppercase + lowercase + numbers + special;

  let password = "";

  // Asegurar que tiene al menos un carácter de cada tipo
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];

  // Completar el resto
  for (let i = password.length; i < length; i++) {
    password += all[Math.floor(Math.random() * all.length)];
  }

  // Mezclar los caracteres
  return password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
};

