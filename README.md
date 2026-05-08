# CardLink — Tarjetas de Presentación Digitales

App Next.js 15 para crear y compartir tarjetas de presentación digitales con QR.

## Stack
- **Next.js 15** (App Router, TypeScript)
- **Tailwind CSS**
- **Firebase Firestore** — almacenamiento de tarjetas
- **qrcode.react** — generación de QR
- **react-hot-toast** — notificaciones

## Estructura
```
src/app/            → páginas (home, [slug], [slug]/edit, api)
src/components/     → CardPreview, CardForm, QRCodeDisplay, PinModal
src/lib/            → firebase.ts, firestore.ts, utils.ts
src/types/          → card.ts
```

## Setup local

### 1. Clonar e instalar
```bash
git clone https://github.com/tu-usuario/digital-cards.git
cd digital-cards
npm install
```

### 2. Variables de entorno
```bash
cp .env.example .env.local
```
Edita `.env.local` con tus credenciales de Firebase.

### 3. Firebase
1. Crea proyecto en [console.firebase.google.com](https://console.firebase.google.com)
2. Activa **Firestore** en modo producción
3. Aplica las reglas de seguridad:
   ```bash
   npx firebase deploy --only firestore:rules
   ```
4. Copia las credenciales de tu web app a `.env.local`

### 4. Correr en desarrollo
```bash
npm run dev
```

## Deploy en Vercel

1. Sube el repo a GitHub
2. Conecta en [vercel.com](https://vercel.com) → Import Project
3. Agrega las variables de entorno en Vercel → Settings → Environment Variables
4. Vercel detecta Next.js automáticamente — deploy listo

## Seguridad
- PINs almacenados como hash SHA-256 (nunca en texto plano)
- Reglas Firestore: slug y pinHash son inmutables una vez creados
- API Route verifica PIN antes de cualquier update
- `.env.local` excluido del repositorio
