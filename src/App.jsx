import { useEffect } from 'react'
import { motion } from 'framer-motion'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import RadialMenu from './components/RadialMenu'

function App() {
  // Habilitar scroll después de que termine la animación
  useEffect(() => {
    const timer = setTimeout(() => {
      document.documentElement.style.overflow = 'auto';
      document.body.style.overflow = 'auto';
      document.getElementById('root').style.overflow = 'auto';
    }, 3000); // Reducido a 3 segundos ya que hay menos contenido

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Pantalla negra inicial que desaparece */}
      <motion.div
        className="fixed inset-0 bg-black z-50"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }}
        style={{ pointerEvents: "none" }}
      />
      
      {/* Revelar el fondo con transición suave y difuminada */}
      <motion.div
        className="fixed inset-0"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 2, delay: 1.2, ease: "easeOut" }}
        style={{ 
          zIndex: 40,
          background: `linear-gradient(
            to top,
            rgba(0,0,0,0.95) 0%,
            rgba(0,0,0,0.8) 20%,
            rgba(0,0,0,0.6) 40%,
            rgba(0,0,0,0.4) 60%,
            rgba(0,0,0,0.2) 80%,
            rgba(0,0,0,0) 100%
          )`
        }}
      />

      {/* Logos pequeños en la esquina superior derecha - FUERA del contenedor principal */}
      <motion.div 
        className="fixed top-6 right-6 flex space-x-3"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2.5, duration: 0.6, ease: "easeOut" }}
        style={{ zIndex: 9999 }}
      >
        <motion.a 
          href="https://vite.dev" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group cursor-pointer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.img 
            src={viteLogo} 
            className="h-8 w-8 opacity-80 group-hover:opacity-100 transition-opacity" 
            alt="Vite logo"
            animate={{ y: [0, -2, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          />
        </motion.a>
        
        <motion.a 
          href="https://react.dev" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group cursor-pointer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.img 
            src={reactLogo} 
            className="h-8 w-8 opacity-80 group-hover:opacity-100 transition-opacity" 
            alt="React logo"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
          />
        </motion.a>
      </motion.div>

      <motion.div 
        className="h-screen w-screen bg-[url('/backgrounds/main.jpeg')] bg-cover bg-center flex flex-col items-center justify-center relative overflow-hidden"
        initial={{ 
          scale: 1.05,
          filter: "brightness(0.4)"
        }}
        animate={{ 
          scale: 1,
          filter: "brightness(1)"
        }}
        transition={{ 
          duration: 1.5, 
          delay: 1.5,
          ease: "easeOut"
        }}
      >

        <motion.div 
          className="h-full w-full bg-black/50 dark:bg-black/70 flex flex-col items-center justify-center overflow-hidden relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          style={{ 
            zIndex: 10
          }}
        >
          {/* Tu contenido principal va aquí */}
          <motion.div 
            className="flex flex-col items-center justify-center h-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.8, duration: 0.8, ease: "easeOut" }}
          >
            {/* Menú radial centrado */}
            <motion.div 
              className="mb-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 3.2, duration: 0.8, ease: "backOut" }}
            >
              <RadialMenu />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  )
}

export default App
