const TYPES=new Set(["promotion","news","announcement"]), UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i, DATE=/^\d{4}-\d{2}-\d{2}$/;
const clean=(value,max)=>typeof value==="string"?value.trim().slice(0,max):"";
export function validId(value){return UUID.test(value||"");}
export function validatePublication(input){
  const data={type:clean(input.type,20),title:clean(input.title,120),description:clean(input.description,600),imageKey:clean(input.imageKey,100),startDate:clean(input.startDate,10),endDate:clean(input.endDate,10),active:input.active===true||input.active===1,buttonText:clean(input.buttonText,50),buttonUrl:clean(input.buttonUrl,500)};const errors=[];
  if(!TYPES.has(data.type))errors.push("Tipo de publicación inválido.");if(!data.title)errors.push("El título es obligatorio.");if(typeof input.title==="string"&&input.title.trim().length>120)errors.push("El título no puede superar 120 caracteres.");if(typeof input.description==="string"&&input.description.trim().length>600)errors.push("La descripción no puede superar 600 caracteres.");
  if(typeof input.active!=="boolean")errors.push("El estado debe ser activo o inactivo.");
  if(!DATE.test(data.startDate)||!DATE.test(data.endDate))errors.push("Las fechas son obligatorias y deben ser válidas.");if(data.startDate&&data.endDate&&data.endDate<data.startDate)errors.push("La fecha final no puede ser anterior a la inicial.");
  if(data.buttonUrl){try{const url=new URL(data.buttonUrl);if(!["http:","https:"].includes(url.protocol))throw 0;}catch{errors.push("La dirección web no es válida.");}}if(Boolean(data.buttonText)!==Boolean(data.buttonUrl))errors.push("El texto y la dirección del botón deben completarse juntos.");
  return {data,errors};
}
export function detectImage(bytes){const b=new Uint8Array(bytes);if(b.length>=3&&b[0]===0xff&&b[1]===0xd8&&b[2]===0xff)return {type:"image/jpeg",ext:"jpg"};if(b.length>=8&&[137,80,78,71,13,10,26,10].every((v,i)=>b[i]===v))return {type:"image/png",ext:"png"};if(b.length>=12&&String.fromCharCode(...b.slice(0,4))==="RIFF"&&String.fromCharCode(...b.slice(8,12))==="WEBP")return {type:"image/webp",ext:"webp"};return null;}
