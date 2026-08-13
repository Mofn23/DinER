# DinER - Changelog & Updates Log

Este documento lleva el registro cronológico completo de todas las actualizaciones, mejoras visuales, correcciones y nuevas funcionalidades implementadas en la aplicación **DinER**.

---

## 📌 [v3.0.0] - 2026-08-12

### 🚀 Fusión Completa DinER + Subscription Manager (Optimización de Cupo SideStore)
- **Fusión Total de Ambas Aplicaciones**:
  - Se unificaron las funcionalidades de **Subscription Manager** dentro del núcleo de **DinER**, liberando 1 cupo completo en la cuenta gratuita de desarrollador de SideStore.
- **Sin Pérdida de Datos**:
  - Se conservaron el 100% de las 35 transacciones reales de DinER y se integraron todas las suscripciones existentes (`Datos mamá`, `Apple Music`, `iCloud+`, `Netflix Premium`, `ChatGPT Plus`, `WhatsApp plus`, `Bodyfit Fitness Center`).
- **Hub Completo de Suscripciones Integrado (`SubscriptionsHubView.tsx`)**:
  - **📱 Todas**: Lista de suscripciones con botón de pago instantáneo a 1 tap.
  - **⏰ Timeline**: Línea de tiempo cronológica con horizonte temporal de 7 días, 30 días, 90 días y 1 año.
  - **💡 Fugas de Dinero & Proyecciones (`InsightsTab.tsx`)**: Detector de pruebas gratuitas (trials) por vencer y cálculo de dinero a ahorrar.
  - **🚫 Centro de Cancelación (`CancellationTab.tsx`)**: Guías paso a paso para cancelar servicios y contador de dinero total recuperado.
- **Selector de Vista Superior en Pantalla Principal**:
  - Conmutador en la barra superior entre **Gastos & Finanzas 💳** y **Suscripciones 📺**.

---

## 📌 [v2.0.0] - 2026-08-12

### 📱 Conversión a App Nativa iOS 100% Offline (SideStore Compatible)
- **Desconexión Completa de Servidores / Vercel**:
  - La aplicación ahora es **100% independiente y local**. Se eliminaron todas las dependencias de servidores remotos o Vercel.
- **Almacenamiento Local Autónomo (Zustand Persist)**:
  - Implementación del middleware `persist` sobre `localStorage` local en el iPhone.
- **Compilación Automatizada de Archivo `.ipa` (GitHub Actions Pipeline)**:
  - Creado el workflow automatizado `.github/workflows/build-ios.yml`.

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
