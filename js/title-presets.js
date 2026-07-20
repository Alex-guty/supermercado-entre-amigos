export const OTHER_TITLE_VALUE="__other__";
export const TITLE_PRESETS=Object.freeze(["Promoción de la semana","Oferta especial","Novedad","Producto destacado","Nuevo ingreso","Descuento especial","Solo por tiempo limitado"]);
export function getTitleSelection(title){return TITLE_PRESETS.includes(title)?{preset:title,custom:""}:{preset:OTHER_TITLE_VALUE,custom:title||""};}
export function resolvePublicationTitle(preset,custom){return preset===OTHER_TITLE_VALUE?(custom||"").trim():preset;}
