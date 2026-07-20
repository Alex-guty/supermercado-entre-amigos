const STORAGE_KEY = "entre-amigos-theme-color";
const DEFAULT_COLOR = "#21734e";
function hexToRgb(hex) { const clean = hex.replace("#", ""); if (!/^[0-9a-f]{6}$/i.test(clean)) return null; return { r: parseInt(clean.slice(0,2),16), g: parseInt(clean.slice(2,4),16), b: parseInt(clean.slice(4,6),16) }; }
function mix(color,target,amount) { const source=hexToRgb(color), end=hexToRgb(target); const channel=(key)=>Math.round(source[key]+(end[key]-source[key])*amount).toString(16).padStart(2,"0"); return `#${channel("r")}${channel("g")}${channel("b")}`; }
export function getThemeColor() { const saved=localStorage.getItem(STORAGE_KEY); return hexToRgb(saved||"") ? saved : DEFAULT_COLOR; }
export function applyThemeColor(color=getThemeColor()) {
  if (!hexToRgb(color)) color=DEFAULT_COLOR;
  const root=document.documentElement;
  root.style.setProperty("--green-950",mix(color,"#000000",.62)); root.style.setProperty("--green-900",mix(color,"#000000",.48)); root.style.setProperty("--green-800",mix(color,"#000000",.30)); root.style.setProperty("--green-700",color); root.style.setProperty("--green-600",mix(color,"#ffffff",.13)); root.style.setProperty("--green-500",mix(color,"#ffffff",.27)); root.style.setProperty("--lime",mix(color,"#ffffff",.50)); root.style.setProperty("--lime-soft",mix(color,"#ffffff",.82)); root.style.setProperty("--green",color); root.style.setProperty("--dark",mix(color,"#000000",.48));
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content",color); return color;
}
export function saveThemeColor(color) { if(!hexToRgb(color)) throw new Error("Selecciona un color válido."); localStorage.setItem(STORAGE_KEY,color); applyThemeColor(color); }
export function resetThemeColor() { localStorage.removeItem(STORAGE_KEY); return applyThemeColor(DEFAULT_COLOR); }
window.addEventListener("storage",(event)=>{if(event.key===STORAGE_KEY)applyThemeColor();}); applyThemeColor();
