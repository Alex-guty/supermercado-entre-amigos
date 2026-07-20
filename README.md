# Supermercado entre amigos

Sitio estático en HTML, CSS y JavaScript.

## Desarrollo local

Sirve la carpeta mediante un servidor HTTP local (los módulos JavaScript no funcionan correctamente abriendo `index.html` directamente con `file://`). La página pública está en `/` y el panel local en `/admin/`.

El panel almacena publicaciones e imágenes en IndexedDB, dentro del navegador y dispositivo donde se crean. El botón **Cargar datos de demostración** agrega ejemplos claramente identificados; **Eliminar todos los datos locales** reinicia el almacenamiento.

## Arquitectura de publicaciones

- `js/promotion-service.js`: API usada por las interfaces.
- `js/local-promotion-repository.js`: implementación temporal de IndexedDB.
- `js/validation.js`: validaciones compartidas.
- `js/promotions.js`: sección pública y tarjetas.
- `admin/`: interfaz administrativa local.

Para migrar a Cloudflare, se puede sustituir el repositorio local por uno que consuma Pages Functions o Workers sin cambiar las interfaces. La protección futura de `/admin/*` y `/api/admin/*` debe configurarse con Cloudflare Access; este proyecto no contiene contraseñas ni correos autorizados.
