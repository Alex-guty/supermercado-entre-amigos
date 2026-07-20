import { STORAGE_CONFIG } from "./config.js";
import { localPromotionRepository as repository } from "./local-promotion-repository.js";
import { validatePublication } from "./validation.js";
const channel = "BroadcastChannel" in window ? new BroadcastChannel(STORAGE_CONFIG.channelName) : null;
const today = () => { const now = new Date(); return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10); };
function notifyChange() { window.dispatchEvent(new CustomEvent(STORAGE_CONFIG.eventName)); channel?.postMessage({ type: "changed" }); }
function normalize(input, current = {}) {
  return { ...current, type: input.type, title: input.title.trim(), description: input.description.trim(), image: input.image || current.image || "", startDate: input.startDate, endDate: input.endDate, active: Boolean(input.active), buttonText: input.buttonText?.trim() || "", buttonUrl: input.buttonUrl?.trim() || "", updatedAt: new Date().toISOString() };
}
export async function getPublications() { return (await repository.getAll()).sort((a, b) => b.createdAt.localeCompare(a.createdAt)); }
export async function getActivePublications() { const date = today(); return (await getPublications()).filter((item) => item.active && item.startDate <= date && item.endDate >= date).sort((a, b) => b.startDate.localeCompare(a.startDate)); }
export const getPublicationById = (id) => repository.getById(id);
export async function createPublication(input) {
  const errors = validatePublication(input); if (errors.length) throw new Error(errors.join("\n"));
  const publication = normalize(input, { id: crypto.randomUUID(), createdAt: new Date().toISOString() });
  await repository.save(publication); notifyChange(); return publication;
}
export async function updatePublication(id, input) {
  const current = await repository.getById(id); if (!current) throw new Error("La publicación ya no existe.");
  const errors = validatePublication(input); if (errors.length) throw new Error(errors.join("\n"));
  const publication = normalize(input, current); await repository.save(publication); notifyChange(); return publication;
}
export async function deletePublication(id) { await repository.delete(id); notifyChange(); }
export async function clearPublications() { await repository.clear(); notifyChange(); }
export async function seedDemoPublications() {
  if ((await repository.getAll()).length) return false;
  const date = (offset) => new Date(Date.now() + offset * 86400000).toISOString().slice(0, 10);
  const demos = [
    { type: "promotion", title: "Demostración: promoción activa", description: "Contenido de prueba para comprobar una publicación vigente.", startDate: date(-2), endDate: date(7), active: true },
    { type: "news", title: "Demostración: novedad programada", description: "Contenido de prueba que comenzará a mostrarse más adelante.", startDate: date(5), endDate: date(15), active: true },
    { type: "promotion", title: "Demostración: promoción vencida", description: "Contenido de prueba cuya vigencia ya terminó.", startDate: date(-15), endDate: date(-5), active: true },
    { type: "announcement", title: "Demostración: anuncio inactivo", description: "Contenido de prueba desactivado manualmente.", startDate: date(-1), endDate: date(10), active: false }
  ];
  for (const item of demos) await createPublication({ ...item, image: "", buttonText: "", buttonUrl: "" });
  return true;
}
export function onPublicationsChanged(callback) { window.addEventListener(STORAGE_CONFIG.eventName, callback); channel?.addEventListener("message", callback); }
