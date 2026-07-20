import { DESCRIPTION_MAX_LENGTH, IMAGE_RULES, PUBLICATION_TYPES } from "./config.js";
export function validateImage(file) {
  if (!file) return [];
  const errors = [];
  if (!IMAGE_RULES.acceptedTypes.includes(file.type)) errors.push("La imagen debe ser JPEG, PNG o WebP.");
  if (file.size > IMAGE_RULES.maxBytes) errors.push("La imagen no puede superar 3 MB.");
  return errors;
}
function validUrl(value) {
  if (!value) return true;
  try { return ["http:", "https:"].includes(new URL(value).protocol); } catch { return false; }
}
export function validatePublication(data) {
  const errors = [];
  if (!data.title?.trim()) errors.push("El título es obligatorio.");
  if (!data.description?.trim()) errors.push("La descripción es obligatoria.");
  if ((data.description || "").length > DESCRIPTION_MAX_LENGTH) errors.push(`La descripción no puede superar ${DESCRIPTION_MAX_LENGTH} caracteres.`);
  if (!PUBLICATION_TYPES[data.type]) errors.push("Selecciona un tipo de publicación válido.");
  if (!data.startDate) errors.push("La fecha de inicio es obligatoria.");
  if (!data.endDate) errors.push("La fecha de finalización es obligatoria.");
  if (data.startDate && data.endDate && data.endDate < data.startDate) errors.push("La fecha final no puede ser anterior a la fecha inicial.");
  if (!validUrl(data.buttonUrl)) errors.push("La dirección web debe comenzar con http:// o https://.");
  if (data.buttonText && !data.buttonUrl) errors.push("Agrega una dirección web para el botón.");
  if (data.buttonUrl && !data.buttonText) errors.push("Agrega un texto para el botón.");
  return errors;
}
