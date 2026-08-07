# DinER - Changelog & Updates Log

Este documento lleva el registro cronológico completo de todas las actualizaciones, mejoras visuales, correcciones y nuevas funcionalidades implementadas en la aplicación **DinER**.

---

## 📌 [v1.5.0] - 2026-08-07

### 🤖 Categorización Inteligente Automática (Smart Auto-Categorization)
- **Detección Instantánea por Descripción**:
  - Al escribir en el campo de descripción (por ejemplo `Uber`, `KFC`, `Bodyfit`, `Mamá Zara`, `iCloud`), la app reconoce la palabra clave y selecciona la categoría correspondiente (`🚘 Uber`, `🍲 Comida`, `🏋️ Gym`, `👩‍🍼 Mamá`, `📺 Suscripción`) **de forma 100% automática** e instantánea.
  - Soporte de diccionario inteligente y coincidencia aproximada para agilizar el registro de gastos.

### 🎨 Rediseño 1:1 de la Interfaz "Agregar Transacción" (Estilo MonAI)
- **Header & Posición de Chips**:
  - Botón de cierre circular `✕` colocado a la derecha.
  - Chips de fecha y recurrencia (`Today v`, `Once v`) ubicados justo sobre el campo de descripción.
- **Fila de Monto MonAI `[ - | + ]` & Cifra Coloreada**:
  - Selector en cápsula `[ - | + ]` a la izquierda: el segmento `-` se destaca en rojo `#E8505B` para gastos y `+` en verde `#34C759` para ingresos.
  - La cifra del monto (`COP 123`) se tiñe dinámicamente de rojo en gastos o verde en ingresos en tipografía gigante de 32px.
- **Barra de Categorías y Tags**:
  - Botón circular `(+)` a la izquierda de la barra de categorías.
  - Carrusel horizontal de tags (`#yo`, `#carrro`, `#nu`, `#papa`, `#mama`) sobre la barra de entrada.
- **Botones de Acción Inferiores**:
  - Botón cuadrado `#` a la izquierda para desplegar el panel de tags.
  - Botón principal `✓ Save` estilizado a la derecha.

---

## 📌 [v1.4.0] - 2026-08-07

### 🔢 Animación Fluida de Números (Count-Up / Count-Down iOS 60fps)
- **Componente `AnimatedNumber`**:
  - Implementación de animación de conteo suave (`easeOutCubic`) sobre la API de renderizado nativo `requestAnimationFrame`.
  - Al filtrar por una categoría, al buscar `#tag` o cambiar entre pestañas de Gastos/Ingresos, los números principales (**Monto Total**, **Segmentos de Gastos/Ingresos** y **Pills de Totales Diarios**) se incrementan o decrementan en un conteo animado minimalista de 350ms.

---

## 📌 [v1.3.0] - 2026-08-07

### 📊 Actualización Dinámica del Total por Categoría Seleccionada
- **Total e Indicadores por Categoría**:
  - Al hacer clic sobre cualquier categoría en el gráfico de barras (ej. `Mamá 👩‍🍼`), el **Bloque de Total Principal** (`Total`) y los **Segmentos** se actualizan en vivo para mostrar el dinero exacto gastado o recibido en esa categoría específica.

---

## 📌 [v1.2.1] - 2026-08-07

### 🕒 Corrección de Zona Horaria (Colombia UTC-5)
- **Fijación de Zona Horaria Local (America/Bogota)**:
  - Se corrigió el desfase de fecha producido por la conversión UTC en horas nocturnas (desfase de +5 horas que marcaba el 7 de agosto antes de medianoche).

---

## 📌 [v1.2.0] - 2026-08-07

### 🎨 Mejoras Visuales & Estilo MonAI (Barras de Estadística)
- **Barras Estilo Cápsula MonAI**: Se rediseñó el gráfico de barras por categoría para igualar exactamente el acabado delicado de MonAI.

---

## 📌 [v1.1.0] - 2026-08-06

### 🔍 Búsqueda Fluida 1:1 MonAI (Inline Live Search)
- **Header de Búsqueda Integrado**: Filtro y cálculo dinámico en tiempo real sobre la pantalla principal.

---

## 📌 [v1.0.0] - 2026-08-06

### 🚀 Lanzamiento Inicial & Carga de Datos Reales
- **Construcción Completa DinER**: App PWA mobile-first con marco iOS (`390×844`).
