# DinER - Changelog & Updates Log

Este documento lleva el registro cronológico completo de todas las actualizaciones, mejoras visuales, correcciones y nuevas funcionalidades implementadas en la aplicación **DinER**.

---

## 📌 [v3.0.2] - 2026-08-12

### ✏️ Edición Completa de Suscripciones (Edit Subscription Feature)
- **Botón de Edición por Tarjeta (Ícono de Lápiz ✏️)**:
  - Agregado el ícono de lápiz en cada tarjeta de suscripción dentro del Hub de Suscripciones (`SubscriptionsHubView.tsx`).
- **Formulario de Edición Completo**:
  - Permite modificar nombre, emoji, monto en COP, día de cobro del mes (1-31), frecuencia (mensual, semanal, bimensual, anual), proveedor, enlaces de cancelación, instrucciones y notas.
- **Notificación Toast de Confirmación**:
  - Al guardar los cambios, emite una notificación toast confirmando la actualización instantánea de la suscripción.

---

## 📌 [v3.0.1] - 2026-08-12

### 📱 Ícono Estilo MonAI 1:1 & Borde Seguro para Dynamic Island
- **Ícono Nivel MonAI (`AppIcon`)**:
  - Creado e integrado el ícono oficial en 1024x1024 con la letra **"D"** en 3D rojo neón sobre fondo negro `#0B0B0D` y línea punteada diagonal.
- **Margen de Borde Seguro de iOS (`Dynamic Island & Status Bar Padding`)**:
  - Implementado `pt-[max(env(safe-area-inset-top,50px),50px)]` en la barra superior (`TopBar.tsx`) y paneles modulares.

---

## 📌 [v3.0.0] - 2026-08-12

### 🚀 Fusión Completa DinER + Subscription Manager (Optimización de Cupo SideStore)
- **Fusión Total de Ambas Aplicaciones**:
  - Se unificaron las funcionalidades de **Subscription Manager** dentro del núcleo de **DinER**, liberando 1 cupo completo en SideStore.

---

## 📌 [v2.0.0] - 2026-08-12

### 📱 Conversión a App Nativa iOS 100% Offline (SideStore Compatible)

---

## 📌 [v1.7.0] - 2026-08-07

### 🔔 Notificaciones Push para Suscripciones & PWA Service Worker

---

## 📌 [v1.6.0] - 2026-08-07

### 📺 Nueva Sección Completa de Suscripciones (Subscription Manager)

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
