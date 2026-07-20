import { PUBLICATION_TYPES } from "../js/config.js";
import { clearPublications, createPublication, deletePublication, getPublicationById, getPublications, onPublicationsChanged, seedDemoPublications, updatePublication } from "../js/promotion-service.js";
import { validateImage } from "../js/validation.js";
import { getThemeColor, resetThemeColor, saveThemeColor } from "../js/theme.js";
const $ = (selector) => document.querySelector(selector);
const form = $("#publication-form"), list = $("#publication-list"), listStatus = $("#list-status"), message = $("#form-message"), previewWrap = $("#image-preview"), preview = $("#preview-image");
let currentImage = "";
const today = () => { const now = new Date(); return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0,10); };
function showMessage(text, kind = "success") { message.textContent = text; message.className = `message message--${kind}`; message.hidden = false; message.scrollIntoView({ behavior:"smooth", block:"nearest" }); }
function statusOf(item) { const date=today(); if (item.endDate < date) return "expired"; if (!item.active) return "inactive"; if (item.startDate > date) return "scheduled"; return "active"; }
const statusLabels = { active:"Activa", inactive:"Inactiva", expired:"Vencida", scheduled:"Programada" };
function setPreview(value) { currentImage=value || ""; previewWrap.hidden=!currentImage; preview.src=currentImage; }
function resetForm() { form.reset(); $("#publication-id").value=""; $("#active").checked=true; setPreview(""); $("#form-title").textContent="Nueva publicación"; $("#save-button").textContent="Guardar publicación"; $("#cancel-edit").hidden=true; $("#description-count").textContent="0"; }
function readForm() { return { type:$("#type").value,title:$("#title").value,description:$("#description").value,image:currentImage,startDate:$("#start-date").value,endDate:$("#end-date").value,active:$("#active").checked,buttonText:$("#button-text").value,buttonUrl:$("#button-url").value }; }
function fileAsDataUrl(file) { return new Promise((resolve,reject)=>{ const reader=new FileReader(); reader.onload=()=>resolve(reader.result); reader.onerror=()=>reject(new Error("No se pudo leer la imagen.")); reader.readAsDataURL(file); }); }
function makeButton(text,className,action) { const button=document.createElement("button"); button.type="button"; button.className=`button ${className}`; button.textContent=text; button.addEventListener("click",action); return button; }
function makeItem(item) {
  const article=document.createElement("article"); article.className="publication"; const image=item.image?document.createElement("img"):document.createElement("div");
  if(item.image){image.src=item.image;image.alt=`Imagen de ${item.title}`;image.className="publication__image";}else{image.className="publication__placeholder";image.textContent="Sin imagen";}
  const content=document.createElement("div"), top=document.createElement("div"), heading=document.createElement("h3"), badge=document.createElement("span"), meta=document.createElement("p"), actions=document.createElement("div");
  top.className="publication__top"; heading.textContent=item.title; const state=statusOf(item); badge.className=`badge badge--${state}`; badge.textContent=statusLabels[state]; top.append(heading,badge);
  meta.textContent=`${PUBLICATION_TYPES[item.type]} · ${item.startDate} a ${item.endDate}`; actions.className="publication__actions";
  actions.append(makeButton("Editar","button--secondary",()=>editItem(item.id)),makeButton(item.active?"Desactivar":"Activar","button--quiet",()=>toggleItem(item)),makeButton("Eliminar","button--danger-quiet",()=>removeItem(item)));
  content.append(top,meta,actions); article.append(image,content); return article;
}
async function renderList() { listStatus.hidden=false; listStatus.textContent="Cargando publicaciones…"; list.replaceChildren(); try { const filter=$("#status-filter").value; const items=(await getPublications()).filter((item)=>filter==="all"||statusOf(item)===filter); if(!items.length){listStatus.textContent="No hay publicaciones para este filtro.";return;} listStatus.hidden=true; list.append(...items.map(makeItem)); } catch { listStatus.textContent="No se pudo cargar el contenido local."; } }
async function editItem(id) { const item=await getPublicationById(id); if(!item)return; $("#publication-id").value=item.id; $("#type").value=item.type; $("#title").value=item.title; $("#description").value=item.description; $("#start-date").value=item.startDate; $("#end-date").value=item.endDate; $("#active").checked=item.active; $("#button-text").value=item.buttonText; $("#button-url").value=item.buttonUrl; setPreview(item.image); $("#description-count").textContent=item.description.length; $("#form-title").textContent="Editar publicación"; $("#save-button").textContent="Actualizar publicación"; $("#cancel-edit").hidden=false; form.scrollIntoView({behavior:"smooth"}); }
async function toggleItem(item) { await updatePublication(item.id,{...item,active:!item.active}); showMessage(`Publicación ${item.active?"desactivada":"activada"} correctamente.`); }
async function removeItem(item) { if(!confirm(`¿Eliminar “${item.title}”? Esta acción no se puede deshacer.`))return; await deletePublication(item.id); showMessage("Publicación eliminada correctamente."); if($("#publication-id").value===item.id)resetForm(); }
form.addEventListener("submit",async(event)=>{ event.preventDefault(); message.hidden=true; try { const data=readForm(), id=$("#publication-id").value; if(id){await updatePublication(id,data);showMessage("Publicación actualizada correctamente.");}else{await createPublication(data);showMessage("Publicación guardada correctamente.");} resetForm(); } catch(error){showMessage(error.message||"No se pudo guardar la publicación.","error");} });
$("#image").addEventListener("change",async(event)=>{ const file=event.target.files[0]; const errors=validateImage(file); if(errors.length){event.target.value="";showMessage(errors.join("\n"),"error");return;} if(file)setPreview(await fileAsDataUrl(file)); });
$("#remove-image").addEventListener("click",()=>{setPreview("");$("#image").value="";}); $("#description").addEventListener("input",(event)=>$("#description-count").textContent=event.target.value.length); $("#cancel-edit").addEventListener("click",resetForm); $("#status-filter").addEventListener("change",renderList);
$("#seed-demo").addEventListener("click",async()=>{ const seeded=await seedDemoPublications(); showMessage(seeded?"Datos de demostración cargados.":"Ya existen publicaciones. Elimina los datos locales antes de cargar la demostración.",seeded?"success":"error"); });
$("#reset-data").addEventListener("click",async()=>{if(!confirm("¿Eliminar todas las publicaciones e imágenes guardadas localmente?"))return;await clearPublications();resetForm();showMessage("Datos locales eliminados correctamente.");});
const themeInput=$("#theme-color"), themeMessage=$("#theme-message");
themeInput.value=getThemeColor();
$("#apply-theme").addEventListener("click",()=>{saveThemeColor(themeInput.value);themeMessage.textContent="Color aplicado correctamente en todas las páginas.";themeMessage.hidden=false;});
$("#reset-theme").addEventListener("click",()=>{themeInput.value=resetThemeColor();themeMessage.textContent="Se restableció el color original.";themeMessage.hidden=false;});
onPublicationsChanged(renderList); renderList();
