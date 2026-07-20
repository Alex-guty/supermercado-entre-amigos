import { PUBLICATION_TYPES } from "./config.js";
import { getActivePublications, onPublicationsChanged } from "./promotion-service.js";
const grid=document.querySelector("#promotions-grid"), status=document.querySelector("#promotions-status"), pagination=document.querySelector("#promotions-pagination"), previousButton=document.querySelector("#promotions-previous"), nextButton=document.querySelector("#promotions-next"), pageStatus=document.querySelector("#promotions-page-status");
const PAGE_SIZE=3; let publications=[], currentPage=1;
const formatDate=new Intl.DateTimeFormat("es-CR",{day:"numeric",month:"long",year:"numeric",timeZone:"UTC"});
function element(tag,className,text){const node=document.createElement(tag);if(className)node.className=className;if(text)node.textContent=text;return node;}
function createCard(item){
  const article=element("article",`promotion-card promotion-card--${item.type}`);
  if(item.image){
    const media=element("div","promotion-card__media");
    const image=element("img","promotion-card__image");image.src=item.image;image.alt=`Imagen de ${item.title}`;
    media.append(image);article.append(media);
  }
  const body=element("div","promotion-card__body"); body.append(element("span","promotion-card__tag",PUBLICATION_TYPES[item.type]),element("h3","",item.title),element("p","",item.description),element("p","promotion-card__dates",`Vigente del ${formatDate.format(new Date(item.startDate))} al ${formatDate.format(new Date(item.endDate))}`));
  if(item.buttonText&&item.buttonUrl){const link=element("a","button button--promotion",item.buttonText);link.href=item.buttonUrl;link.target="_blank";link.rel="noopener noreferrer";body.append(link);} article.append(body);return article;
}
function renderPage(){
  const totalPages=Math.max(1,Math.ceil(publications.length/PAGE_SIZE)); currentPage=Math.min(currentPage,totalPages); const start=(currentPage-1)*PAGE_SIZE;
  grid.replaceChildren(...publications.slice(start,start+PAGE_SIZE).map(createCard)); pagination.hidden=publications.length<=PAGE_SIZE; pageStatus.textContent=`Página ${currentPage} de ${totalPages}`; previousButton.disabled=currentPage===1; nextButton.disabled=currentPage===totalPages;
}
async function render(){
  if(!grid||!status)return; status.hidden=false;status.textContent="Cargando publicaciones…";grid.replaceChildren();pagination.hidden=true;
  try{publications=await getActivePublications();currentPage=1;if(!publications.length){status.textContent="Próximamente publicaremos nuevas promociones.";return;}status.hidden=true;renderPage();}
  catch{status.textContent="No pudimos cargar las novedades en este momento.";}
}
function changePage(direction){currentPage+=direction;renderPage();document.querySelector("#novedades")?.scrollIntoView({behavior:"smooth",block:"start"});}
previousButton?.addEventListener("click",()=>changePage(-1)); nextButton?.addEventListener("click",()=>changePage(1)); render();onPublicationsChanged(render);
