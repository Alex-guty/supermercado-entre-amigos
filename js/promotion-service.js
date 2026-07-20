import{apiFetch}from"./api-client.js";
export const getPublications=async(page=1,pageSize=3)=>apiFetch(`/api/publications?page=${page}&pageSize=${pageSize}`);
export const getAdminPublications=async({page=1,pageSize=10,status="all"}={})=>apiFetch(`/api/admin/publications?page=${page}&pageSize=${pageSize}&status=${encodeURIComponent(status)}`);
export const getPublicationById=async(id)=>(await apiFetch(`/api/admin/publications/${encodeURIComponent(id)}`)).data;
export const createPublication=async(data)=>(await apiFetch("/api/admin/publications",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(data)})).data;
export const updatePublication=async(id,data)=>(await apiFetch(`/api/admin/publications/${encodeURIComponent(id)}`,{method:"PUT",headers:{"content-type":"application/json"},body:JSON.stringify(data)})).data;
export const deletePublication=async(id)=>apiFetch(`/api/admin/publications/${encodeURIComponent(id)}`,{method:"DELETE"});
export const uploadImage=async(file)=>{const form=new FormData();form.append("image",file);return(await apiFetch("/api/admin/images",{method:"POST",body:form})).data;};
export const deleteImage=async(key)=>apiFetch(`/api/admin/images/${encodeURIComponent(key)}`,{method:"DELETE"});
