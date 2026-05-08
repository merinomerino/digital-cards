<div align="center">

# CardLink

### Tu identidad profesional, siempre contigo.

**Tarjetas de presentación digitales con QR · 100% Gratis · Sin registro**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore-orange?logo=firebase)](https://firebase.google.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?logo=typescript)](https://typescriptlang.org)
[![License](https://img.shields.io/badge/Licencia-Propietario-red)](LICENSE)

---

*Desarrollado por [Merino Tech Systems](https://merinotechsystems.com) · Piedras Negras, Coahuila, México*

</div>

---

## ¿Qué es CardLink?

CardLink permite a cualquier profesional crear su tarjeta de presentación digital en segundos:

- ✅ **Sin registro** — solo rellenas el formulario
- ✅ **QR incluido** — descargable en PNG
- ✅ **Link único** — `cardlink.mx/tu-nombre`
- ✅ **Editable** — con tu PIN de seguridad de 4 dígitos
- ✅ **Redes sociales** — LinkedIn, WhatsApp, Instagram, Twitter, GitHub, TikTok
- ✅ **100% gratis** — sostenido con publicidad discreta de Google AdSense

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router, SSR) |
| Lenguaje | TypeScript (strict) |
| Base de datos | Google Firebase Firestore |
| Autenticación | PIN SHA-256 (sin cuentas) |
| Estilos | Tailwind CSS |
| QR | `qrcode.react` |
| Hosting | Vercel |
| Publicidad | Google AdSense |

---

## Estructura del proyecto

```
src/
├── app/
│   ├── layout.tsx          # Layout global (Footer + AdSense)
│   ├── page.tsx            # Landing page + formulario de creación
│   ├── privacy/page.tsx    # Política de Privacidad (LFPDPPP)
│   ├── terms/page.tsx      # Términos de Servicio
│   ├── [slug]/
│   │   ├── page.tsx        # Tarjeta pública (SSR) + banners AdSense
│   │   └── edit/page.tsx   # Editor con gate de PIN
│   └── api/cards/[slug]/
│       └── route.ts        # Verificación de PIN (server-side)
├── components/
│   ├── AdBanner.tsx        # Componente Google AdSense
│   ├── CardForm.tsx        # Formulario crear/editar tarjeta
│   ├── CardPreview.tsx     # Vista pública de la tarjeta
│   ├── Footer.tsx          # Footer con branding MTS
│   ├── PinModal.tsx        # Modal de verificación PIN (OTP)
│   └── QRCodeDisplay.tsx   # QR + descarga PNG
├── lib/
│   ├── firebase.ts         # Inicialización Firebase
│   ├── firestore.ts        # CRUD de tarjetas
│   └── utils.ts            # Helpers (slug, hash, iconos)
└── types/
    └── card.ts             # Interfaces TypeScript
```

---

## Variables de entorno

Crea `.env.local` con:

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# App
NEXT_PUBLIC_APP_URL=https://cardlink.mx

# Google AdSense (opcional — solo producción)
NEXT_PUBLIC_ADSENSE_PUBLISHER_ID=ca-pub-XXXXXXXXXXXXXXXX
NEXT_PUBLIC_ADSENSE_SLOT_TOP=1234567890
NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM=0987654321
```

---

## Instalación local

```bash
git clone https://github.com/merinomerino/digital-cards.git
cd digital-cards
npm install
cp .env.example .env.local
# Edita .env.local con tus credenciales Firebase
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

---

## Deploy en Vercel

1. Importa el repo en [vercel.com](https://vercel.com)
2. Agrega las variables de entorno en Settings → Environment Variables
3. Vercel detecta Next.js automáticamente → deploy en 1 clic
4. Conecta tu dominio personalizado

---

## Firebase

### Desplegar reglas de Firestore

```bash
npm install -g firebase-tools
firebase login
firebase use --add   # selecciona tu proyecto
firebase deploy --only firestore
```

### Índices

Los índices están en `firestore.indexes.json` y se despliegan con:

```bash
firebase deploy --only firestore:indexes
```

---

## Modelo de negocio

| Tier | Precio | Características |
|---|---|---|
| **Free** | Gratis | Tarjeta completa, QR, link único, 1 tarjeta |
| **Pro** *(próximamente)* | $49 MXN/mes | Sin anuncios, analytics, múltiples tarjetas |

Los ingresos de la versión Free se generan mediante anuncios de Google AdSense en las páginas públicas de tarjetas.

---

## Seguridad

Ver [SECURITY.md](SECURITY.md) para detalles sobre:
- Hashing de PIN con SHA-256
- Reglas de Firestore (slug e inmutabilidad del PIN)
- Reporte de vulnerabilidades

---

## Documentos legales

- [Política de Privacidad](https://cardlink.mx/privacy) — LFPDPPP México
- [Términos de Servicio](https://cardlink.mx/terms)

---

## Contribuciones

CardLink es un producto propietario de Merino Tech Systems. No aceptamos contribuciones externas en este momento.
Para reportar bugs o sugerencias escribe a: **contacto@merinotechsystems.com**

---

<div align="center">

© 2026 **CardLink** · Desarrollado con ❤️ por [Merino Tech Systems](https://merinotechsystems.com)

Piedras Negras, Coahuila, México

</div>
