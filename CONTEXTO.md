# Contexto del Proyecto: CardLink

> Desarrollado por **Merino Tech Systems** · Piedras Negras, Coahuila, México

---

## 1. Propósito del Negocio

| Campo | Valor |
|-------|-------|
| **Problema que resuelve** | Profesionales y negocios locales no tienen una forma rápida y económica de compartir su contacto digital — las tarjetas físicas se pierden y no son actualizables |
| **Métrica de éxito** | Crear una tarjeta digital en < 2 minutos, sin registro, con QR compartible inmediato |
| **Patrocinador** | Merino Tech Systems (producto propio) |
| **Fecha de Discovery** | 2026-05-07 |
| **Confirmación** | ✅ Confirmado — producto propio MTS |

---

## 2. Usuarios y Roles

| Rol | Descripción | Necesidad principal | Frecuencia de uso |
|-----|-------------|---------------------|-------------------|
| **Profesional independiente** | Freelancer, consultor, vendedor | Compartir contacto sin tarjeta física | Ocasional (crea 1 vez, comparte siempre) |
| **Negocio local** | Veterinaria, estética, restaurante | Presencia digital básica con info de contacto y servicios | Edita mensualmente |
| **Visitante / receptor** | Quien escanea el QR | Ver info de contacto y acceder rápido a WhatsApp / redes | Único (escanea 1 vez) |
| **Administrador MTS** | Staff interno MTS | Crear tarjetas premium para clientes, gestionar panel | Diario durante operación |

---

## 3. Flujo Principal del Negocio

**Evento disparador:** Usuario llega a cardlink.mx y quiere crear su tarjeta

```
1. Usuario llena formulario público (nombre, empresa, teléfono, redes, foto)
   → Define un slug único (ej: cardlink.mx/juan-perez)
   → Define PIN de 4 dígitos para editar después
2. Sistema crea la tarjeta en Firestore y la publica en /[slug]
3. Usuario recibe:
   → URL única compartible
   → QR descargable en PNG
   → Botón de WhatsApp para compartir
4. Visitante escanea QR → ve la tarjeta pública → puede llamar, escribir por WhatsApp, ver redes
5. Propietario edita la tarjeta → ingresa a /[slug]/edit → valida PIN → modifica datos
```

**Salida del proceso:** Tarjeta pública disponible en URL permanente con QR

---

## 4. Flujos Alternos

| Situación | Comportamiento esperado | Responsable |
|-----------|-------------------------|-------------|
| Slug ya existe | Error claro + sugerencia de slug alternativo | Sistema |
| PIN incorrecto (edición) | Bloqueo tras 3 intentos, mensaje amigable | Sistema |
| Firebase no disponible | Mensaje de error amigable, no pantalla blanca | Sistema |
| Foto > 5MB | Error antes de subir, con tamaño máximo indicado | Sistema |
| Tarjeta no encontrada (/[slug] inválido) | Página 404 con CTA para crear tarjeta | Sistema |

---

## 5. Reglas de Negocio

| ID | Regla | Prioridad |
|----|-------|-----------|
| REGLA-001 | SI el slug ya existe ENTONCES rechazar y sugerir alternativa | Alta |
| REGLA-002 | SI el PIN no coincide (edición) ENTONCES denegar acceso | Alta |
| REGLA-003 | SI foto > 5MB ENTONCES rechazar antes de subir a Firebase Storage | Alta |
| REGLA-004 | SI la tarjeta tiene `diseño` definido ENTONCES usar DesignCardPreview en lugar de CardPreview | Alta |
| REGLA-005 | SI el usuario es admin MTS ENTONCES puede crear tarjetas con diseño personalizado sin PIN público | Alta |
| REGLA-006 | SI la tarjeta es `clasico` (sin diseño) ENTONCES es gratuita y auto-servicio | Media |
| REGLA-007 | SI la tarjeta tiene diseño premium (tattoo/vet/travel) ENTONCES fue creada por MTS admin | Media |
| REGLA-008 | SI el visitante hace clic en WhatsApp/teléfono ENTONCES registrar el click en analytics | Baja |

---

## 6. Restricciones No Negociables

| Tipo | Detalle |
|------|---------|
| **Hosting** | Vercel (Next.js App Router + SSR para SEO) |
| **Base de datos** | Firebase Firestore |
| **Storage** | Firebase Storage (fotos de perfil) |
| **Auth admin** | PIN SHA-256 (sin cuentas para usuarios normales) |
| **Monetización** | Google AdSense en versión gratuita |
| **Tiempo de carga tarjeta** | < 2 segundos (SSR, LCP optimizado) |
| **Sin registro de usuarios** | Flujo 100% anónimo para creadores normales |
| **Mobile first** | La tarjeta pública debe verse perfecta en móvil 375px+ |
| **Dominio** | cardlink.mx |

---

## 7. Lo que NO está en el Alcance (v0.3.0)

- NO: App móvil nativa
- NO: Pagos o suscripciones automatizadas
- NO: Dashboard de analytics para el usuario final (solo admin MTS)
- NO: Múltiples tarjetas por usuario
- NO: Login con Google/email para usuarios normales
- NO: Modo claro (UI siempre dark)
- NO: Edición de slug después de creado

---

## 8. Glosario

| Término | Definición en CardLink |
|---------|------------------------|
| **Tarjeta** | Perfil digital público de una persona o negocio |
| **Slug** | Identificador único en la URL (ej: `juan-perez`) |
| **PIN** | Código de 4 dígitos que protege la edición de la tarjeta |
| **Diseño** | Plantilla visual premium (clasico, tattoo, vet, travel) |
| **Tarjeta clásica** | Diseño estándar MTS, auto-servicio, gratuita |
| **Tarjeta premium** | Diseño personalizado creado por admin MTS para clientes |
| **Admin MTS** | Operador interno de MTS con acceso al panel /admin |
| **Vista pública** | Página /[slug] visible para cualquier visitante |
| **Analytics** | Conteo de vistas, clicks en WhatsApp/teléfono/redes |

---

## 9. Decisiones Técnicas (ADR)

| ID | Decisión | Razón | Alternativa descartada |
|----|----------|-------|------------------------|
| ADR-001 | Next.js App Router + SSR | SEO para indexar tarjetas públicas en Google | SPA pura (no indexable) |
| ADR-002 | Sin auth para usuarios normales (PIN SHA-256) | Fricción cero — no requiere email ni contraseña | Firebase Auth: demasiada fricción para el flujo |
| ADR-003 | Firebase Firestore | Tiempo real, sin servidor, escala automática | PostgreSQL: requiere servidor administrado |
| ADR-004 | Diseños separados (CardPreview vs DesignCardPreview) | Permite evolución independiente de plantillas | Un solo componente: dificultad para customizar |
| ADR-005 | Google AdSense en versión gratuita | Sostenibilidad del producto sin cobrar al usuario | Freemium con límite de features |

---

## 10. Historial de Cambios

| Fecha | Cambio | Impacto |
|-------|--------|---------|
| 2026-05-07 | v0.1.0 — Lanzamiento inicial, tarjetas clásicas | Bajo |
| 2026-05-09 | v0.2.0 — UI MTS, SEO, headers de seguridad | Bajo |
| 2026-05-11 | v0.3.0 — Panel admin, diseños premium, analytics, CSP | Alto |

---

## Checklist de Contexto

- [x] Propósito explicable en 1 frase sin jerga técnica
- [x] Flujo principal documentado
- [x] Reglas de negocio críticas documentadas (8 reglas)
- [x] Roles de usuario identificados
- [x] Restricciones técnicas conocidas
- [x] Glosario definido
- [x] Patrocinador = MTS (producto propio, auto-aprobado)
- [x] No alcance definido

**✅ GO — Contexto completo para v0.3.0**
