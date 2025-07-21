# React + Vite + TailwindCSS

Este proyecto es una aplicación React moderna construida con Vite y estilizada con TailwindCSS, que proporciona un entorno de desarrollo rápido y una experiencia de usuario moderna.

## 🚀 Características

- **React 18**: Biblioteca de interfaz de usuario moderna y reactiva
- **Vite**: Herramienta de construcción ultrarrápida con HMR (Hot Module Replacement)
- **TailwindCSS**: Framework de CSS utility-first para diseño rápido y consistente
- **ESLint**: Linting para código JavaScript/React limpio y consistente

## 🛠️ Tecnologías Utilizadas

- [React](https://react.dev/) - Biblioteca de JavaScript para interfaces de usuario
- [Vite](https://vite.dev/) - Build tool de próxima generación
- [TailwindCSS](https://tailwindcss.com/) - Framework de CSS utility-first
- [PostCSS](https://postcss.org/) - Procesador de CSS
- [Autoprefixer](https://autoprefixer.github.io/) - Plugin para añadir prefijos CSS automáticamente

## 📦 Instalación

1. Clona el repositorio:
```bash
git clone <your-repository-url>
cd io
```

2. Instala las dependencias:
```bash
npm install
```

## 🏃‍♂️ Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Vista previa de la construcción de producción
- `npm run lint` - Ejecuta ESLint para verificar el código

## 🎨 Configuración de TailwindCSS

El proyecto está configurado con TailwindCSS y incluye:
- Configuración personalizada en `tailwind.config.js`
- PostCSS configurado en `postcss.config.js`
- Clases de utilidad personalizadas (como `animate-spin-slow`)
- Soporte para modo oscuro con clases `dark:`

## 📁 Estructura del Proyecto

```
├── public/          # Archivos estáticos
├── src/
│   ├── assets/      # Recursos (imágenes, iconos, etc.)
│   ├── components/  # Componentes React reutilizables
│   ├── App.jsx      # Componente principal
│   ├── main.jsx     # Punto de entrada
│   └── index.css    # Estilos globales con directivas de Tailwind
├── .github/
│   └── copilot-instructions.md  # Instrucciones para GitHub Copilot
└── README.md        # Este archivo
```

## 🚀 Primeros Pasos

1. Inicia el servidor de desarrollo:
```bash
npm run dev
```

2. Abre [http://localhost:5173](http://localhost:5173) en tu navegador

3. ¡Comienza a desarrollar! Los cambios se reflejarán automáticamente gracias al HMR de Vite.

## 📝 Consejos de Desarrollo

- Utiliza las clases de TailwindCSS en lugar de CSS personalizado
- Aprovecha el modo oscuro con las variantes `dark:`
- Usa las clases responsivas de Tailwind (`sm:`, `md:`, `lg:`, `xl:`)
- El servidor de desarrollo de Vite es extremadamente rápido, perfecto para desarrollo iterativo

## 🤝 Contribución

¡Las contribuciones son bienvenidas! Por favor, asegúrate de seguir las mejores prácticas de React y usar TailwindCSS para los estilos.te

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
