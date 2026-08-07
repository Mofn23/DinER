# DinER - Changelog & Updates Log

Este documento lleva el registro cronológico completo de todas las actualizaciones, mejoras visuales, correcciones y nuevas funcionalidades implementadas en la aplicación **DinER**.

---

## 📌 [v1.8.0] - 2026-08-07

### 📱 Integración Widget Minimalista iOS (WidgetKit & Capacitor)
- **Diseño Ultra-Minimalista**:
  - Muestra exclusivamente tu **Saldo Restante** (`+ $841,738 COP`) con píldora verde de incremento y el **Gasto del Mes** (`- $2,559,223 COP`) en tipografía roja `#E8505B`.
- **Código Nativo Swift / SwiftUI WidgetKit (`DinERWidget.swift`)**:
  - Código Swift SwiftUI nativo en `ios/App/DinERWidget/DinERWidget.swift` con fondo oscuro `#0B0B0D` e integración con App Groups de iOS (`group.com.diner.app`).
  - Acción deep-link `diner://add` al tocar el Widget para abrir la app directamente en la pantalla de agregar transacción.
- **Vista Previa e Instalación en Ajustes (`WidgetPreviewSheet.tsx`)**:
  - Nueva opción **"📱 Widget de iOS"** en el panel de Ajustes para previsualizar el Widget en vivo, sincronizar datos con un clic y consultar la guía paso a paso de instalación en iPhone.

---

## 📌 [v1.7.0] - 2026-08-07

### 🔔 Notificaciones Push para Suscripciones & PWA Service Worker
- **Service Worker Nativo PWA (`public/sw.js`)**: Registro de Service Worker para notificaciones Push.
- **Sistema Inteligente de Notificaciones (`notifications.ts`)**: Evaluación diaria de vencimiento de suscripciones.

---

## 📌 [v1.6.0] - 2026-08-07

### 📺 Nueva Sección Completa de Suscripciones (Subscription Manager)
- **Acceso desde Ajustes**: Nueva opción **"Suscripciones"** agregada dentro del panel de Ajustes (`SettingsSheet`).
- **Tarjetas de Cálculo de Costos (Mensual vs Anual)**: Cálculo en tiempo real.
- **Acción "Pagar Suscripción"**: Botón **Pagar** que genera transacciones automáticas.

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
