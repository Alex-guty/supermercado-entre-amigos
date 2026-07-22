export const DEFAULT_THEME_COLOR="#21734e";
export const normalizeThemeColor=value=>typeof value==="string"&&/^#[0-9a-f]{6}$/i.test(value.trim())?value.trim().toLowerCase():null;
