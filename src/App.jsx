import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import unjbgLogo from './assets/unjbg.png'
import mainBg from './assets/main.jpeg'

// Importar páginas
import Home from './pages/Home'
import MetodoGrafico from './pages/MetodoGrafico'
import MetodoSimplex from './pages/MetodoSimplex'
import SimplexDual from './pages/SimplexDual'
import MetodoHungaro from './pages/MetodoHungaro'
import EsquinaNoroeste from './pages/EsquinaNoroeste'
import MetodoModi from './pages/MetodoModi'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  
  // Habilitar scroll SIN scrollbars visibles
  useEffect(() => {
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
  }, []);

  const handleMethodSelect = (methodPath) => {
    console.log(`Navegando a: ${methodPath}`)
    setCurrentPage(methodPath)
  };

  const handleBackToHome = () => {
    setCurrentPage('home')
  };

  const renderCurrentPage = () => {
    switch(currentPage) {
      case 'grafico':
        return <MetodoGrafico onBack={handleBackToHome} />
      case 'simplex':
        return <MetodoSimplex onBack={handleBackToHome} />
      case 'simplex-dual':
        return <SimplexDual onBack={handleBackToHome} />
      case 'hungaro':
        return <MetodoHungaro onBack={handleBackToHome} />
      case 'noroeste':
        return <EsquinaNoroeste onBack={handleBackToHome} />
      case 'modi':
        return <MetodoModi onBack={handleBackToHome} />
      default:
        return <Home onMethodSelect={handleMethodSelect} />
    }
  };

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
      
      {/* Revelar el fondo con transición suave y difuminada - SIN BLOQUEAR CLICKS */}
      <motion.div
        className="fixed inset-0 pointer-events-none"
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
          href="https://www.unjbg.edu.pe" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group cursor-pointer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.img 
            src={unjbgLogo} 
            className="h-10 w-10 opacity-80 group-hover:opacity-100 transition-opacity rounded-full" 
            alt="UNJBG logo"
            animate={{ 
              scale: [1, 1.2, 1],
              rotateY: [0, 15, -15, 0]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 2, 
              ease: "easeInOut" 
            }}
          />
        </motion.a>

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

      <div 
        className="h-screen w-screen bg-cover bg-center flex flex-col items-center justify-center relative"
        style={{ backgroundImage: `url(${mainBg})` }}
      >
        {/* Partículas de fondo globales - NO INTERFIEREN CON CLICKS */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Partículas flotantes */}
          <motion.div
            className="absolute w-2 h-2 bg-blue-500 rounded-full opacity-20"
            animate={{
              x: [20, 1200, 20],
              y: [100, 600, 100],
              scale: [1, 1.5, 1]
            }}
            transition={{
              repeat: Infinity,
              duration: 15,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute w-3 h-3 bg-purple-500 rounded-full opacity-15 right-40 top-32"
            animate={{
              x: [0, -300, 0],
              y: [0, 200, 0],
              rotate: [0, 360, 720]
            }}
            transition={{
              repeat: Infinity,
              duration: 12,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-30 left-1/4 bottom-1/4"
            animate={{
              y: [0, -100, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 2, 1]
            }}
            transition={{
              repeat: Infinity,
              duration: 8,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute w-2 h-2 bg-pink-400 rounded-full opacity-25 right-1/3 top-1/2"
            animate={{
              x: [0, 100, 0],
              y: [0, -150, 0],
              rotate: [0, -360, -720]
            }}
            transition={{
              repeat: Infinity,
              duration: 10,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute w-1.5 h-1.5 bg-green-400 rounded-full opacity-20 left-1/2 top-1/4"
            animate={{
              scale: [1, 2.5, 1],
              opacity: [0.2, 0.6, 0.2],
              rotate: [0, 180, 360]
            }}
            transition={{
              repeat: Infinity,
              duration: 6,
              ease: "easeInOut"
            }}
          />
        </div>

        <div 
          className="h-full w-full bg-black/40 dark:bg-black/60 flex flex-col items-center justify-center overflow-y-auto relative py-12"
          style={{ 
            zIndex: 10
          }}
        >
          {/* Contenido principal con scroll */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentPage}
              className="w-full flex flex-col items-center justify-center min-h-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0, duration: 0.6, ease: "easeOut" }}
            >
              {renderCurrentPage()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  )
}

export default App
