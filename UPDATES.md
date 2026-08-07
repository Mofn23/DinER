# DinER - Changelog & Updates Log

Este documento lleva el registro cronológico completo de todas las actualizaciones, mejoras visuales, correcciones y nuevas funcionalidades implementadas en la aplicación **DinER**.

---

## 📌 [v1.3.0] - 2026-08-07

### 📊 Actualización Dinámica del Total por Categoría Seleccionada
- **Total e Indicadores por Categoría**:
  - Al hacer clic sobre cualquier categoría en el gráfico de barras (ej. `Mamá 👩‍🍼`), no solo se filtra el desglose de la lista de transacciones, sino que el **Bloque de Total Principal** (`Total`) y los **Segmentos** se actualizan en vivo para mostrar el dinero exacto gastado o recibido en esa categoría específica.
  - Al limpiar la selección con el chip `⊗`, el monto principal regresa suavemente al total acumulado general del período (`+$841,738 COP`).

---

## 📌 [v1.2.1] - 2026-08-07

### 🕒 Corrección de Zona Horaria (Colombia UTC-5)
- **Fijación de Zona Horaria Local (America/Bogota)**:
  - Se corrigió el desfase de fecha producido por la conversión UTC en horas nocturnas (desfase de +5 horas que marcaba el 7 de agosto antes de medianoche).
  - Implementada la función helper `getLocalDateString()` con formateo explícito en `America/Bogota` para garantizar que la fecha actual sea siempre la de Colombia (ej. `2026-08-06`).
  - Las transacciones de hoy vuelven a mostrarse correctamente bajo el header **`Today`** y la fecha real de la zona horaria del usuario.

---

## 📌 [v1.2.0] - 2026-08-07

### 🎨 Mejoras Visuales & Estilo MonAI (Barras de Estadística)
- **Barras Estilo Cápsula MonAI**: Se rediseñó el gráfico de barras por categoría para igualar exactamente el acabado delicado de MonAI:
  - Ancho de barra ajustado a un estilo más fino (`w-[86px]` para barras altas y `w-[92px]` para cápsulas cortas).
  - Las categorías con montos menores ahora se muestran como cápsulas horizontales estilizadas de 52px de altura con el emoji y la cifra compacta (ej. `🍲 183K`, `🚘 139K`, `🏋️ 105K`) alineados horizontalmente.
  - Las categorías principales con montos mayores se extienden verticalmente hasta 280px con remates redondeados de 22px (`rounded-[22px]`).
  - Tipografía refinada a `14px` ExtraBold para dar la sensación delicada y ligera del diseño original de referencia.

### 📝 Registro Centralizado
- Creación de `UPDATES.md` para mantener el registro oficial de cambios del proyecto.

---

## 📌 [v1.1.0] - 2026-08-06

### 🔍 Búsqueda Fluida 1:1 MonAI (Inline Live Search)
- **Eliminación del Overlay Brusco**: Se removió la hoja superpuesta de búsqueda a pantalla completa.
- **Header de Búsqueda Integrado**: Al pulsar el ícono de la lupa 🔍 en los controles flotantes inferiores, la barra superior cambia fluidamente al Header de Búsqueda de MonAI (título gigante `Search...` o `#query` con botón circular `✕` de 40px en `#1C1C1E`).
- **Cálculo y Filtro Dinámico en Vivo**:
  - Mientras el usuario escribe (ejemplo: `#mama`), toda la pantalla principal (**Bloque Total**, **Segmentos de Gastos/Ingresos**, **Gráfico de Barras** y **Lista por Días**) permanece visible y recalcula su dinero en tiempo real.
  - El header por día en la lista calcula automáticamente la suma neta diaria correspondiente (ej. `8/7/26` con `-$194,626`).

---

## 📌 [v1.0.0] - 2026-08-06

### 🚀 Lanzamiento Inicial & Carga de Datos Reales
- **Construcción Completa DinER**: App PWA mobile-first con marco iOS (`390×844`), modo oscuro estricto (`#0B0B0D`), tipografía `Nunito`, emojis de categoría, íconos SVGs lineales y animaciones fluidas.
- **Datos Reales Procesados (35 Transacciones)**:
  - Ingreso de todas las transacciones de las capturas del usuario.
  - Categoría **Papá** configurada como **Ingreso** (`type: 'income'`).
  - Balance total ajustado al 100%: **Total Neto `+$841,738 COP`** (Gastos: `$2,559,223` / Ingresos: `$3,400,961`).
- **Control de Versiones y Despliegue**: Subida inicial al repositorio GitHub `Mofn23/DinER` y despliegue automático en Vercel para uso en iPhone.
