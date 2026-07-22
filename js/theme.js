const DEFAULT_COLOR = "#21734e";
let currentColor=DEFAULT_COLOR;
function hexToRgb(hex) { const clean=String(hex||"").replace("#",""); if(!/^[0-9a-f]{6}$/i.test(clean))return null; return {r:parseInt(clean.slice(0,2),16),g:parseInt(clean.slice(2,4),16),b:parseInt(clean.slice(4,6),16)}; }
function mix(color,target,amount) { const source=hexToRgb(color),end=hexToRgb(target);const channel=key=>Math.round(source[key]+(end[key]-source[key])*amount).toString(16).padStart(2,"0");return `#${channel("r")}${channel("g")}${channel("b")}`; }
export function getThemeColor(){return currentColor;}
export function applyThemeColor(color=currentColor){
  if(!hexToRgb(color))color=DEFAULT_COLOR;currentColor=color.toLowerCase();const root=document.documentElement;
  root.style.setProperty("--green-950",mix(currentColor,"#000000",.62));root.style.setProperty("--green-900",mix(currentColor,"#000000",.48));root.style.setProperty("--green-800",mix(currentColor,"#000000",.30));root.style.setProperty("--green-700",currentColor);root.style.setProperty("--green-600",mix(currentColor,"#ffffff",.13));root.style.setProperty("--green-500",mix(currentColor,"#ffffff",.27));root.style.setProperty("--lime",mix(currentColor,"#ffffff",.50));root.style.setProperty("--lime-soft",mix(currentColor,"#ffffff",.82));root.style.setProperty("--green",currentColor);root.style.setProperty("--dark",mix(currentColor,"#000000",.48));document.querySelector('meta[name="theme-color"]')?.setAttribute("content",currentColor);return currentColor;
}
export async function loadThemeColor(){try{const response=await fetch("/api/theme",{headers:{accept:"application/json"},cache:"no-store"}),payload=await response.json();if(response.ok&&payload.ok&&hexToRgb(payload.data?.color))return applyThemeColor(payload.data.color);}catch{}return applyThemeColor(currentColor);}
export async function saveThemeColor(color){if(!hexToRgb(color))throw new Error("Selecciona un color válido.");const response=await fetch("/api/theme",{method:"PUT",headers:{"content-type":"application/json",accept:"application/json"},body:JSON.stringify({color})}),payload=await response.json();if(!response.ok||!payload.ok)throw new Error(payload.error?.message||"No se pudo guardar el color global.");return applyThemeColor(payload.data.color);}
export const resetThemeColor=()=>saveThemeColor(DEFAULT_COLOR);
applyThemeColor(DEFAULT_COLOR);
export const themeReady=loadThemeColor();
