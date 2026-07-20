export const json=(data,status=200,headers={})=>new Response(JSON.stringify(data),{status,headers:{"content-type":"application/json; charset=utf-8","x-content-type-options":"nosniff",...headers}});
export const ok=(data,status=200,extra={})=>json({ok:true,data,...extra},status);
export const fail=(code,message,status=400)=>json({ok:false,error:{code,message}},status);
export function method(request,allowed){if(!allowed.includes(request.method))return fail("METHOD_NOT_ALLOWED","Método no permitido.",405);}
export function sameOrigin(request){const origin=request.headers.get("origin");if(!origin)return true;return origin===new URL(request.url).origin;}
export async function bodyJson(request){if(!(request.headers.get("content-type")||"").toLowerCase().includes("application/json"))throw Object.assign(new Error("Se requiere application/json."),{status:415,code:"UNSUPPORTED_MEDIA_TYPE"});return request.json();}
export const serverError=()=>fail("INTERNAL_ERROR","No fue posible completar la operación.",500);
