# DinER - Changelog & Updates Log

Este documento lleva el registro cronológico completo de todas las actualizaciones, mejoras visuales, correcciones y nuevas funcionalidades implementadas en la aplicación **DinER**.

---

## 📌 [v2.0.0] - 2026-08-12

### 📱 Conversión a App Nativa iOS 100% Offline (SideStore Compatible)
- **Desconexión Completa de Servidores / Vercel**:
  - La aplicación ahora es **100% independiente y local**. Se eliminaron todas las dependencias de servidores remotos o Vercel.
- **Almacenamiento Local Autónomo (Zustand Persist)**:
  - Implementación del middleware `persist` sobre `localStorage` local en el iPhone.
  - Todas las transacciones, categorías personalizadas, presupuestos, suscripciones y configuraciones se guardan localmente en tu dispositivo y se conservan tras cerrar o reiniciar la app.
- **Eliminación de Módulos Innecesarios de Widgets**:
  - Removido el sistema de widgets para garantizar la máxima ligereza y estabilidad.
- **Compilación Automatizada de Archivo `.ipa` (GitHub Actions Pipeline)**:
  - Creado el workflow automatizado `.github/workflows/build-ios.yml`.
  - Cada vez que se hace push al repositorio, GitHub Actions compila automáticamente la aplicación nativa en formato `DinER.ipa` compatible con **SideStore** y **AltStore** y la publica en GitHub Releases.

---

## 📌 [v1.7.0] - 2026-08-07

### 🔔 Notificaciones Push para Suscripciones & PWA Service Worker
- **Service Worker Nativo PWA (`public/sw.js`)**: Registro de Service Worker para notificaciones Push.

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
