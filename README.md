# 💳 DinER - Native iOS Expense Tracker & Subscription Manager (MonAI 1:1 Replica)

[![Build iOS IPA](https://github.com/Mofn23/DinER/actions/workflows/build-ios.yml/badge.svg)](https://github.com/Mofn23/DinER/actions/workflows/build-ios.yml)
![iOS Native](https://img.shields.io/badge/Platform-iOS%20Native-000000?style=flat&logo=apple)
![Offline First](https://img.shields.io/badge/Storage-100%25%20Offline%20Local-34C759?style=flat)
![SideStore Ready](https://img.shields.io/badge/SideStore-Compatible-blue?style=flat)

**DinER** es una aplicación mobile-first nativa para iOS diseñada como un réplica exacta 1:1 del diseño y la experiencia fluida de **MonAI**. Desarrollada con **Next.js**, **TypeScript**, **Tailwind CSS**, **Zustand (Local Storage Persist)** y **Capacitor iOS**, funciona de manera **100% autónoma, privada y offline** dentro de tu iPhone sin depender de servidores externos ni Vercel.

---

## ✨ Características Principales

### 🖤 Sistema de Diseño MonAI 1:1
- **Fondo Oscuro Sólido (`#0B0B0D`)**: Integración continua de borde a borde compatible con la Dynamic Island y la barra de estado de iOS.
- **Tipografía Nunito & Emojis**: Jerarquía visual limpia con peso 900 (`font-black`) para montos principales y descripciones.
- **Transiciones y Animaciones a 60fps**: Conteo animado de cifras (`AnimatedNumber`) mediante `requestAnimationFrame` y curva `easeOutCubic`.

### 🤖 Categorización Inteligente Automática
- Motor de detección de palabras clave en tiempo real (`autoCategory.ts`). Al escribir `Uber`, `KFC`, `Bodyfit`, `Mamá Zara` o `iCloud`, la aplicación selecciona instantáneamente la categoría adecuada (`🚘 Uber`, `🍲 Comida`, `🏋️ Gym`, `👩‍🍼 Mamá`, `📺 Suscripción`).

### 📊 Gráfico de Barras por Categoría y Filtros Dinámicos
- Rediseño de barras delgadas estilo cápsula (`rounded-[22px]`).
- Al seleccionar una categoría en el gráfico, el **Monto Total Principal** y los **Segmentos** se actualizan dinámicamente para reflejar el dinero exacto gastado o recibido en esa categoría.

### 🔍 Búsqueda Fluida Integrada (Inline Search)
- Al pulsar el ícono de búsqueda 🔍, la barra superior se transforma fluidamente en el buscador de MonAI con botón circular de cierre `✕`.
- Muestra resultados filtrados por día con el recálculo neto del día (ej. `8/7/26` mostrando `-$194,626`).

### 📺 Gestor de Suscripciones (Subscription Manager)
- Registro y control de suscripciones recurrentes (`iCloud+`, `WhatsApp plus`, `Bodyfit`).
- Cálculo en tiempo real de costo total **Mensual** y **Anual**.
- **Botón "Pagar"**: Con 1 tap genera automáticamente la transacción del pago en la pantalla de inicio y marca la suscripción como pagada.

### 💾 100% Local y Offline (SideStore / AltStore Compatible)
- Todos tus gastos, categorías, presupuestos y suscripciones se almacenan localmente en tu iPhone mediante `localStorage` y Zustand `persist`.
- **Sin servidores externos, sin Vercel y sin cobros recurrentes.**

---

## 🚀 Cómo Instalar en tu iPhone mediante SideStore / AltStore

No necesitas pagar la cuenta de desarrollador de Apple ($99 USD) ni contar con una Mac. GitHub Actions compila automáticamente el archivo `.ipa` listo para instalar.

### Pasos de Instalación:
1. Dirígete a la sección de **[Releases de este Repositorio](https://github.com/Mofn23/DinER/releases)**.
2. Descarga el archivo **`DinER.ipa`** directamente en tu iPhone.
3. Abre **SideStore** (o AltStore) en tu iPhone.
4. Selecciona **My Apps** ➔ Toca el botón **`+`** ➔ Elige `DinER.ipa`.
5. ¡Listo! **DinER** quedará instalada como una app nativa en la pantalla de inicio de tu iPhone.

---

## 🛠️ Stack Tecnológico

- **Frontend Core**: Next.js 15 (App Router - Static Export `output: 'export'`), React 19, TypeScript.
- **Estilos & UI**: Tailwind CSS v3 (Custom Dark Theme tokens), CSS Animations.
- **Estado & Persistencia**: Zustand v5 + `persist` middleware (`localStorage`).
- **Contenedor Nativo iOS**: Capacitor v6 (`@capacitor/ios`).
- **CI/CD Pipeline**: GitHub Actions (`.github/workflows/build-ios.yml` compila en runners macOS).

---

## 📁 Estructura del Proyecto

```
DinER/
├── .github/workflows/
│   └── build-ios.yml         # Workflow de compilación automatizada de IPA
├── ios/
│   └── App/                  # Proyecto nativo de Xcode para iOS
├── src/
│   ├── app/                  # Rutas de la app de Next.js
│   ├── components/
│   │   ├── common/           # Componentes base, íconos y AnimatedNumber
│   │   ├── home/             # Componentes de la pantalla principal (TotalBlock, BarChart, TransactionList)
│   │   └── sheets/           # Hojas modulares (TransactionSheet, SubscriptionsSheet, SettingsSheet, etc.)
│   └── lib/
│       ├── autoCategory.ts   # Motor de categorización automática por palabras clave
│       ├── initialData.ts    # Datos iniciales e interfaces de TypeScript
│       ├── store.ts          # Zustand store con persistencia local
│       └── utils.ts          # Funciones de formato de moneda y zona horaria (America/Bogota)
├── capacitor.config.json     # Configuración de Capacitor iOS
├── next.config.js            # Configuración de Next.js con exportación estática
└── UPDATES.md                # Registro cronológico completo de versiones y cambios
```

---

## 📝 Licencia & Créditos

Desarrollado para uso personal. Inspirado 1:1 en la estética de **MonAI**.
