# Seguridad — CardLink

**Desarrollado por Merino Tech Systems**

---

## Medidas de seguridad implementadas

### 🔐 PIN de usuario
- El PIN de 4 dígitos **nunca se almacena en texto plano**.
- Se aplica **SHA-256** con `crypto-js` antes de persistir en Firestore.
- El hash es un string hexadecimal de 64 caracteres e irreversible.
- Si el usuario pierde su PIN, no es recuperable (privacidad por diseño).

### 🗄️ Reglas de Firestore
Las reglas (`firestore.rules`) garantizan:
- **Lectura pública**: cualquier usuario puede leer tarjetas (por diseño: son públicas).
- **Creación**: solo si el documento no existe, el slug tiene formato válido (`^[a-z0-9][a-z0-9-]*[a-z0-9]$`), el `pinHash` tiene exactamente 64 chars y todos los campos requeridos están presentes.
- **Actualización**: solo si `slug` y `pinHash` no cambian (inmutables post-creación). Las actualizaciones del contenido deben verificar el PIN en el API Route primero.
- **Eliminación**: **prohibida** desde el cliente siempre.

### 🌐 API Route para verificación de PIN
- El endpoint `POST /api/cards/[slug]` recibe el PIN en texto plano, lo hashea en servidor y lo compara con el hash almacenado.
- El PIN en texto plano **nunca persiste** en ninguna capa.
- Responde solo `{ valid: true/false }` sin exponer el hash.

### 🔒 Variables de entorno
- Las credenciales de Firebase se almacenan en `.env.local` (gitignoreado).
- Nunca se comiten al repositorio.
- En producción se configuran en Vercel como variables de entorno cifradas.

### 🛡️ Cabeceras de seguridad HTTP (recomendado configurar en Vercel)
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" }
      ]
    }
  ]
}
```

### 📦 Dependencias
- Se recomienda ejecutar `npm audit` periódicamente.
- Las actualizaciones de seguridad de Next.js deben aplicarse de forma prioritaria.

---

## Reporte de vulnerabilidades

Si descubres una vulnerabilidad de seguridad en CardLink, por favor **no la divulgues públicamente**.

Envía un reporte responsable a:

**Email:** seguridad@merinotechsystems.com  
**Asunto:** `[SECURITY] CardLink — <descripción breve>`

Incluye:
- Descripción de la vulnerabilidad
- Pasos para reproducirla
- Impacto potencial
- Sugerencia de solución (opcional)

Respondemos en un plazo máximo de **72 horas hábiles**.

---

## Alcance

| Componente | En alcance |
|---|---|
| Aplicación web (cardlink.mx) | ✅ |
| API Routes (`/api/*`) | ✅ |
| Reglas de Firestore | ✅ |
| Repositorio GitHub (`digital-cards`) | ✅ |
| Google Firebase / AdSense | ❌ (reportar a Google) |

---

*Merino Tech Systems · Piedras Negras, Coahuila · merinotechsystems.com*
