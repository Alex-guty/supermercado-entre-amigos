const MAX_BYTES=1024*1024,MAX_DIMENSION=1600;
const toBlob=(canvas,quality)=>new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error("No se pudo optimizar la imagen.")),"image/webp",quality));
export async function optimizeImage(file){
  if(!file||file.size<=MAX_BYTES)return file;
  const bitmap=await createImageBitmap(file),scale=Math.min(1,MAX_DIMENSION/Math.max(bitmap.width,bitmap.height)),canvas=document.createElement("canvas");canvas.width=Math.max(1,Math.round(bitmap.width*scale));canvas.height=Math.max(1,Math.round(bitmap.height*scale));const context=canvas.getContext("2d",{alpha:true});context.imageSmoothingEnabled=true;context.imageSmoothingQuality="high";context.drawImage(bitmap,0,0,canvas.width,canvas.height);bitmap.close();
  let low=.38,high=.9,best=await toBlob(canvas,.72);for(let attempt=0;attempt<7;attempt++){const quality=(low+high)/2,candidate=await toBlob(canvas,quality);if(candidate.size<=MAX_BYTES){best=candidate;low=quality;}else high=quality;}if(best.size>MAX_BYTES)best=await toBlob(canvas,.32);const name=file.name.replace(/\.[^.]+$/,"")||"publicacion";return new File([best],`${name}.webp`,{type:"image/webp",lastModified:Date.now()});
}
export const formatFileSize=bytes=>`${Math.round(bytes/1024)} KB`;
