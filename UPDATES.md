# DinER - Changelog & Updates Log

Este documento lleva el registro cronológico completo de todas las actualizaciones, mejoras visuales, correcciones y nuevas funcionalidades implementadas en la aplicación **DinER**.

---

## 📌 [v3.0.1] - 2026-08-12

### 📱 Ícono Estilo MonAI 1:1 & Borde Seguro para Dynamic Island
- **Ícono Nivel MonAI (`AppIcon`)**:
  - Creado e integrado el ícono oficial en 1024x1024 con la letra **"D"** en 3D rojo neón sobre fondo negro `#0B0B0D` y línea punteada diagonal, idéntico 1:1 al estilo visual de MonAI.
  - Empaquetado automáticamente dentro del compilado nativo Xcode de iOS (`Assets.xcassets/AppIcon`).
- **Margen de Borde Seguro de iOS (`Dynamic Island & Status Bar Padding`)**:
  - Implementado `pt-[max(env(safe-area-inset-top,50px),50px)]` en la barra superior (`TopBar.tsx`) y paneles modulares para evitar que la Dynamic Island y la hora del teléfono tapen las listas o la configuración.
- **Formato Semántico de Versiones**:
  - Control de versión ajustado a `v3.0.1` para parches y mejoras menores de interfaz.

---

## 📌 [v3.0.0] - 2026-08-12

### 🚀 Fusión Completa DinER + Subscription Manager (Optimización de Cupo SideStore)
- **Fusión Total de Ambas Aplicaciones**:
  - Se unificaron las funcionalidades de **Subscription Manager** dentro del núcleo de **DinER**, liberando 1 cupo completo en la cuenta gratuita de desarrollador de SideStore.
- **Sin Pérdida de Datos**:
  - Se conservaron el 100% de las 35 transacciones reales de DinER y se integraron todas las suscripciones existentes (`Datos mamá`, `Apple Music`, `iCloud+`, `Netflix Premium`, `ChatGPT Plus`, `WhatsApp plus`, `Bodyfit Fitness Center`).
- **Hub Completo de Suscripciones Integrado (`SubscriptionsHubView.tsx`)**:
  - **📱 Todas**: Lista de suscripciones con botón de pago instantáneo a 1 tap.
  - **⏰ Timeline**: Línea de tiempo cronológica con horizonte temporal.
  - **💡 Fugas de Dinero & Proyecciones (`InsightsTab.tsx`)**: Detector de pruebas gratuitas.
  - **🚫 Centro de Cancelación (`CancellationTab.tsx`)**: Guías paso a paso para cancelar servicios.

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
