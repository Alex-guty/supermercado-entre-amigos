# Supermercado entre amigos

Sitio estático con Cloudflare Pages Functions, D1 y R2. La página pública permanece en `/` y el panel en `/admin/`.

## Desarrollo local

```sh
npm install
npm run db:migrate:local
npm run dev
```

Wrangler sirve el sitio, `/admin/` y `/api/`. No abras los HTML con `file://`.

## Arquitectura

- `functions/api/publications.js`: API pública paginada y filtrada por vigencia en `America/Costa_Rica`.
- `functions/api/images/[key].js`: imágenes privadas de R2 servidas por el mismo dominio.
- `functions/api/admin/`: API administrativa protegible con Access.
- `migrations/`: esquema D1 sin datos de demostración.
- `js/promotion-service.js`: cliente usado por las interfaces; estas no conocen D1 ni R2.

Al reemplazar una imagen, primero se sube el archivo nuevo. La publicación se actualiza después y el servidor elimina la imagen anterior solamente si D1 se actualizó correctamente. Si la actualización falla, el cliente solicita eliminar la imagen recién subida. Al eliminar una publicación, D1 se modifica antes de borrar su imagen. La ruta de eliminación directa rechaza imágenes todavía asociadas.

## Recursos

Preview:

- D1: `supermercado-entre-amigos-db-preview`
- R2: `supermercado-entre-amigos-images-preview`

Producción:

- D1: `supermercado-entre-amigos-db`
- R2: `supermercado-entre-amigos-images`

Los identificadores públicos de D1 están en `wrangler.jsonc` (preview) y `wrangler.production.jsonc` (producción). Nunca guardes tokens o credenciales.

## Cloudflare Access (configuración manual)

En Zero Trust crea una aplicación Self-hosted para el dominio existente y protege:

- `entreamigosbiolley.com/admin`
- `entreamigosbiolley.com/admin/*`
- `entreamigosbiolley.com/api/admin`
- `entreamigosbiolley.com/api/admin/*`

Crea una política `Administradores Supermercado Entre Amigos`, acción `Allow`, con `<CORREO_DUEÑO>` y `<CORREO_ADMINISTRADOR>`. Usa One-time PIN por correo. Verifica que ambos correos entren, que un tercer correo sea bloqueado, que la API administrativa directa también quede bloqueada y que `/`, `/api/publications` y `/api/images/*` continúen públicos.

## Publicación segura

Prueba primero la rama `feature/cloudflare-promotions` en la URL `pages.dev`, usando bindings de preview. No conectes `entreamigosbiolley.com`, no cambies DNS y no desactives GitHub Pages hasta validar el preview y documentar un plan de reversión.
