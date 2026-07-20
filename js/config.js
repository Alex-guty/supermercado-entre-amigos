export const PUBLICATION_TYPES = Object.freeze({ promotion: "Promoción", news: "Novedad", announcement: "Anuncio" });
export const STORAGE_CONFIG = Object.freeze({ databaseName: "entre-amigos-publications", databaseVersion: 1, storeName: "publications", eventName: "entre-amigos-publications-changed", channelName: "entre-amigos-publications" });
export const IMAGE_RULES = Object.freeze({ acceptedTypes: ["image/jpeg", "image/png", "image/webp"], maxBytes: 3 * 1024 * 1024 });
export const DESCRIPTION_MAX_LENGTH = 600;
