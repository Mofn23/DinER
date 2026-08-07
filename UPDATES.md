# DinER - Changelog & Updates Log

Este documento lleva el registro cronológico completo de todas las actualizaciones, mejoras visuales, correcciones y nuevas funcionalidades implementadas en la aplicación **DinER**.

---

## 📌 [v1.7.0] - 2026-08-07

### 🔔 Notificaciones Push para Suscripciones & PWA Service Worker
- **Service Worker Nativo PWA (`public/sw.js`)**:
  - Registro de Service Worker que gestiona notificaciones Push en iOS (PWA instalada en pantalla de inicio) y escritorios.
- **Sistema Inteligente de Notificaciones (`notifications.ts`)**:
  - Evaluación automática al iniciar la app: si una suscripción vence hoy o mañana, la app genera de forma autónoma una notificación nativa en tu dispositivo (*"📺 Suscripción Hoy: iCloud+ por -$44,900. Toca para pagar en DinER"*).
- **Banner y Botón de Prueba en Suscripciones**:
  - Banner en el panel de suscripciones con botón **"Activar"** y botón **"Probar"** para enviar una notificación de prueba instantánea a la pantalla de tu iPhone.

---

## 📌 [v1.6.0] - 2026-08-07

### 📺 Nueva Sección Completa de Suscripciones (Subscription Manager)
- **Acceso desde Ajustes**: Nueva opción **"Suscripciones"** agregada dentro del panel de Ajustes (`SettingsSheet`).
- **Tarjetas de Cálculo de Costos (Mensual vs Anual)**: Cálculo automático en tiempo real del gasto total mensual y anual animado con `AnimatedNumber`.
- **Acción "Pagar Suscripción"**: Botón **Pagar** que genera automáticamente una transacción en la página principal.

---

## 📌 [v1.5.2] - 2026-08-07

### 📱 Integración Fondo 100% Continuo con Dynamic Island & Status Bar

---

## 📌 [v1.5.1] - 2026-08-07

### 📐 Corrección de Márgenes y Desplazamiento Completo (Full-Bleed Sheet)

---

## 📌 [v1.5.0] - 2026-08-07

### 🤖 Categorización Inteligente Automática (Smart Auto-Categorization)

---

## 📌 [v1.4.0] - 2026-08-07

### 🔢 Animación Fluida de Números (Count-Up / Count-Down iOS 60fps)

---

## 📌 [v1.3.0] - 2026-08-07

### 📊 Actualización Dinámica del Total por Categoría Seleccionada

---

## 📌 [v1.2.1] - 2026-08-07

### 🕒 Corrección de Zona Horaria (Colombia UTC-5)

---

## 📌 [v1.2.0] - 2026-08-07

### 🎨 Mejoras Visuales & Estilo MonAI (Barras de Estadística)

---

## 📌 [v1.1.0] - 2026-08-06

### 🔍 Búsqueda Fluida 1:1 MonAI (Inline Live Search)

---

## 📌 [v1.0.0] - 2026-08-06

### 🚀 Lanzamiento Inicial & Carga de Datos Reales
