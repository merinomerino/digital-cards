# Changelog

## [0.3.0] — 2026-05-11

### Added
- Login de administrador con API local protegida por `ADMIN_PASSWORD`
- Página `/admin/cards/new` para crear tarjetas manualmente desde el panel
- Personalización avanzada en CardForm: tagline, tipografías y override de paleta
- Protección de `/seed` con verificación de sesión admin

### Changed
- `Card` ahora soporta `tagline`, `customColors` y `customFont`
- `DesignCardPreview` aplica colores y fuentes personalizadas por tarjeta
- Showcase premium para Chekolettes, Bigotes y Viajes Merino con mejor storytelling visual
- Admin cards mejora UX con CTA de creación y columna de estadísticas

### Security
- Validación server-side de token admin con hash SHA-256 y salt fijo
- Logout local desde layout admin y verificación de sesión en cada carga

## [0.2.0] — 2026-05-09

### Added
- Páginas de sistema: not-found, error, loading states con diseño MTS
- Sitemap y robots.txt para SEO
- vercel.json con headers de seguridad y caching
- next.config.ts con CSP, HSTS, security headers
- Skeleton loaders para ruta de tarjeta y home

### Changed
- UI refinada siguiendo estándares MTS (paleta, tipografía, spacing)
- Reemplazo de emojis por iconos SVG en toda la interfaz
- Optimización de animaciones y transiciones (150ms-200ms)
- Mejora en la accesibilidad: contraste, focus visible, ARIA labels
- Hero section pulida con glassmorphism y gradientes

### Security
- Content-Security-Policy configurada
- HSTS con preload
- X-Frame-Options DENY
- Permissions-Policy restrictiva

## [0.1.0] — 2026-05-07

### Added
- Lanzamiento inicial de CardLink
- Creación de tarjetas digitales con formulario
- Vista pública de tarjeta con diseño dark premium
- Código QR descargable en PNG
- Subida de foto de perfil a Firebase Storage
- Edición de tarjeta con PIN de seguridad (SHA-256)
- Compartir por WhatsApp, nativo, y copiar link
- Google AdSense integrado
- PWA con Service Worker y manifest
- Páginas legales: Términos de Servicio y Política de Privacidad
- Integración con Firebase Firestore
- Footer con branding Merino Tech Systems
