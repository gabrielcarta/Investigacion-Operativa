import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Configuración para optimizar renderizado de React
const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  // Eliminar StrictMode en producción mejora el rendimiento
  // ya que evita el doble renderizado
  process.env.NODE_ENV === 'production' ? (
    <App />
  ) : (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  ),
)
