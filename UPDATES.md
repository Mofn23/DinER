# DinER - Changelog & Updates Log

Este documento lleva el registro cronológico completo de todas las actualizaciones, mejoras visuales, correcciones y nuevas funcionalidades implementadas en la aplicación **DinER**.

---

## 📌 [v3.3.3] - 2026-08-12

### 🎙️ Extracción Robusta del Monto por Voz & Liberación del Micrófono (Solución al Punto Naranja 🟠)
- **Extracción Inteligente de Montos en Español**:
  - Incorporado un motor de parsing de expresiones habladas (ej: *"30 mil"*, *"30000"*, *"cincuenta mil"*, *"veinte mil"*) que garantiza detectar el valor numérico sin importar el formato devuelto por la transcripción de voz.
- **Liberación del Micrófono de Hardware (Punto Naranja 🟠 de iOS)**:
  - Agregada la llamada explícita a `track.stop()`, `track.enabled = false` y `recognition.abort()` al cerrar la pantalla de voz o desmontar el componente, apagando de inmediato el indicador de micrófono naranja en la barra de estado de iOS.

---

## 📌 [v3.3.2] - 2026-08-12

### ⚡ Disparo de IA al Cambiar al Campo de Monto & Solución de Voz 100% Nativo iOS
- **Categorización por IA Ejecutada al Tocar el Monto o Salir de Descripción**.
- **Solución al Error de Conexión en Comandos de Voz**.

---

## 📌 [v3.3.1] - 2026-08-12

### ⚡ Auto-Categorización Instantánea con Ruedita de Carga & Permisos Nativo de Micrófono iOS
- **Categorización Instantánea antes de Ingresar el Precio**.
- **Permisos Nativos de Micrófono para iOS (`Info.plist`)**.

---

## 📌 [v3.3.0] - 2026-08-12

### 🤖 Integración Total de Inteligencia Artificial (Gemini 2.0 Flash) & Registro por Voz
- **Auto-Categorización e Inferencia de Emojis con Gemini 2.0 Flash**.
- **Aprendizaje y Memoria IA (`Ajustes ➔ Aprendizaje IA`)**.
- **Registro por Voz Nativo con Procesamiento IA**.
- **Cero Configuración de API Key en la App**.

---

## 📌 [v3.2.8] - 2026-08-12

### 🎨 Ajuste de Borde Seguro Dynamic Island & Ubicación de Píldoras
- **Ajuste de Margen Superior para Dynamic Island**.
- **Ubicación de Píldoras `Today v` y `Once v` sobre Descripción**.

---

## 📌 [v3.2.7] - 2026-08-12

### 🎨 Tarjeta Estilo MonAI 1:1 en Transacciones & Eliminación de Animación de Gráficas
- **Eliminación Total de la Animación de Colapso de Gráficas**.
- **Rediseño de la Tarjeta Modal de Agregar Transacción (`TransactionSheet`)**.
- **Píldoras Sutiles y Pequeñas de Fecha & Frecuencia**.

---

## 📌 [v3.2.6] - 2026-08-12

### 🎨 Botones Superiores Sutiles, Centrado de Tuerca & Rollover Balance por Defecto
- **Botones Superiores Reducidos & Sútiles**.
- **Alineación Perfecta de la Rueda de Ajustes ⚙️**.
- **Rollover Balance Activado por Defecto**.

---

## 📌 [v3.2.5] - 2026-08-12

### 🎨 Restauración del Cuadro Superior de Búsqueda
- **Restaurada la Búsqueda Superior Limpia (`TopBar.tsx`)**.

---

## 📌 [v3.2.4] - 2026-08-12

### 🎨 Dock de Búsqueda MonAI Nivel 1:1 & Colapso de Gráficas de Arriba a Abajo
- **Dock de Búsqueda Flotante Sobre el Teclado (MonAI Match 1:1)**.
- **Colapso de Gráficas de Arriba Hacia Abajo**.
- **Refinamiento de Grosor de Fuente del Saldo Total**.

---

## 📌 [v3.2.3] - 2026-08-12

### 🎨 Animación Ultra-Fluida & Guardián de Suscripciones
- **Animación Cinemática Gradual para la Gráfica de Barras**.
- **Protección Permanente de Suscripciones Locales**.

---

## 📌 [v3.2.2] - 2026-08-12

### 🎨 Proporciones de Píldoras Nivel MonAI 1:1
- **Reducción de Píldora de Control Segmentado (Gastos vs Ingresos)**.
- **Ajuste de Píldora de Monto de Transacción (`AmountPill`)**.

---

## 📌 [v3.2.1] - 2026-08-12

### 🎨 Corrección MonAI 1:1 & Animación Responsive 1:1 de Scroll
- **Eliminación de Píldoras en Transacciones (Transacciones Flotantes MonAI 1:1)**.
- **Animación de Colapso de Gráfica de Barras 1:1 con el Scroll (100% Touch Responsive)**.

---

## 📌 [v3.2.0] - 2026-08-12

### 🎨 Rediseño Nivel MonAI 1:1 & Animaciones Fluidas
- **Color de Fondo Exacto de MonAI (`#131313`)**: Cambiado el tono global a `#131313`.
- **Tipografía Delicada & Kerning MonAI**.
- **Formato Gigante de Saldo Restante 1:1**.
- **Transiciones con Animación de Desvanecimiento (Cross-Dissolve)**.

---

## 📌 [v3.1.0] - 2026-08-12

### 📈 Sincronización Total de Transacciones MonAI & Mejoras de UX
- **Carga Completa de Transacciones Reales (MonAI Match 1:1)**: Coincidencia 100% exacta con los balances de MonAI (`+$688,759 COP`).
- **Teclado Automático (`autoFocus`)**: Cursor automático en descripción.
- **Formato con Separadores de Miles (ej. `$30.000`)**.
- **Corrección de Lógica Dinámica de Fechas**.

---

## 📌 [v3.0.2] - 2026-08-12

### ✏️ Edición Completa de Suscripciones (Edit Subscription Feature)

---

## 📌 [v3.0.1] - 2026-08-12

### 📱 Ícono Estilo MonAI 1:1 & Borde Seguro para Dynamic Island

---

## 📌 [v3.0.0] - 2026-08-12

### 🚀 Fusión Completa DinER + Subscription Manager (Optimización de Cupo SideStore)

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
