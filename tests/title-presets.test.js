import test from"node:test";import assert from"node:assert/strict";import{getTitleSelection,OTHER_TITLE_VALUE,resolvePublicationTitle,TITLE_PRESETS}from"../js/title-presets.js";
test("incluye todos los títulos solicitados",()=>assert.deepEqual(TITLE_PRESETS,["Promoción de la semana","Oferta especial","Novedad","Producto destacado","Nuevo ingreso","Descuento especial","Solo por tiempo limitado"]));
test("reconoce un título predeterminado al editar",()=>assert.deepEqual(getTitleSelection("Oferta especial"),{preset:"Oferta especial",custom:""}));
test("conserva un título personalizado al editar",()=>assert.deepEqual(getTitleSelection("Feria de verano"),{preset:OTHER_TITLE_VALUE,custom:"Feria de verano"}));
test("crea usando el título predeterminado seleccionado",()=>assert.equal(resolvePublicationTitle("Producto destacado","ignorado"),"Producto destacado"));
test("crea usando el título personalizado",()=>assert.equal(resolvePublicationTitle(OTHER_TITLE_VALUE,"  Feria de verano  "),"Feria de verano"));
