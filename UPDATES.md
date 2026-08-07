# DinER - Changelog & Updates Log

Este documento lleva el registro cronológico completo de todas las actualizaciones, mejoras visuales, correcciones y nuevas funcionalidades implementadas en la aplicación **DinER**.

---

## 📌 [v1.5.1] - 2026-08-07

### 📐 Corrección de Márgenes y Desplazamiento Completo (Full-Bleed Sheet)
- **Eliminación del Corte Brusco en Bordes**:
  - Se corrigieron los márgenes internos que provocaban que las cápsulas de categorías y etiquetas (`#tags`) se cortaran bruscamente a 24px de los bordes.
  - Implementación de carruseles de desplazamiento de borde a borde nativo (`-mx-5 px-5`), permitiendo que el usuario deslice fluidamente las categorías y etiquetas hasta el borde de la pantalla sin ninguna restricción de caja ni amontonamiento.

---

## 📌 [v1.5.0] - 2026-08-07

### 🤖 Categorización Inteligente Automática (Smart Auto-Categorization)
- **Detección Instantánea por Descripción**:
  - Al escribir en el campo de descripción (por ejemplo `Uber`, `KFC`, `Bodyfit`, `Mamá Zara`, `iCloud`), la app reconoce la palabra clave y selecciona la categoría correspondiente (`🚘 Uber`, `🍲 Comida`, `🏋️ Gym`, `👩‍🍼 Mamá`, `📺 Suscripción`) **de forma 100% automática** e instantánea.
- **Rediseño 1:1 MonAI (Fila `[ - | + ]` & Cifra Coloreada)**:
  - Toggle `[ - | + ]` a la izquierda con resalte rojo/verde.
  - Cifra coloreada de 32px en rojo `#E8505B` (gastos) o verde `#34C759` (ingresos).

---

## 📌 [v1.4.0] - 2026-08-07

### 🔢 Animación Fluida de Números (Count-Up / Count-Down iOS 60fps)
- **Componente `AnimatedNumber`**: Animación de conteo suave (`easeOutCubic`) sobre `requestAnimationFrame`.

---

## 📌 [v1.3.0] - 2026-08-07

### 📊 Actualización Dinámica del Total por Categoría Seleccionada
- Recálculo en tiempo real del Total Principal y Segmentos al tocar una categoría en el gráfico.

---

## 📌 [v1.2.1] - 2026-08-07

### 🕒 Corrección de Zona Horaria (Colombia UTC-5)
- Fijación de fecha local en `America/Bogota`.

---

## 📌 [v1.2.0] - 2026-08-07

### 🎨 Mejoras Visuales & Estilo MonAI (Barras de Estadística)
- Cápsulas horizontales estilizadas y barras delgadas.

---

## 📌 [v1.1.0] - 2026-08-06

### 🔍 Búsqueda Fluida 1:1 MonAI (Inline Live Search)

---

## 📌 [v1.0.0] - 2026-08-06

### 🚀 Lanzamiento Inicial & Carga de Datos Reales
