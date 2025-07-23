import { useEffect, useState, useCallback, useMemo, memo, lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BrowserRouter as Router } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import unjbgLogo from './assets/unjbg.png'
import mainBg from './assets/main.jpeg'
import setupScrollOptimizer from './utils/scrollOptimizer'

// Lazy loading de páginas para mejorar rendimiento
const Home = lazy(() => import('./pages/Home'))
const MetodoGrafico = lazy(() => import('./pages/MetodoGrafico'))
const MetodoSimplex = lazy(() => import('./pages/MetodoSimplex'))
const SimplexDual = lazy(() => import('./pages/SimplexDual'))
const MetodoGranM = lazy(() => import('./pages/MetodoGranM'))
const MetodoBinario = lazy(() => import('./pages/MetodoBinario'))
const MetodoHungaro = lazy(() => import('./pages/MetodoHungaro'))
const EsquinaNoroeste = lazy(() => import('./pages/EsquinaNoroeste'))

// Componente de loading optimizado
const LoadingSpinner = memo(() => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
  </div>
))

LoadingSpinner.displayName = 'LoadingSpinner'

// Componente de partículas memoizado para evitar re-renders
const BackgroundParticles = memo(() => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {/* Partículas flotantes optimizadas */}
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
))

BackgroundParticles.displayName = 'BackgroundParticles'

// Componente de logos memoizado
const LogoSection = memo(() => {
  // Memoizar variantes de animación
  const logoVariants = useMemo(() => ({
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    transition: { delay: 2.5, duration: 0.6, ease: "easeOut" }
  }), [])

  return (
    <motion.div 
      className="fixed top-6 right-6 flex space-x-3"
      {...logoVariants}
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
  )
})

LogoSection.displayName = 'LogoSection'

const App = memo(() => {
  const [currentPage, setCurrentPage] = useState('home')
  
  // Habilitar scroll SIN scrollbars visibles
  useEffect(() => {
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
  }, []);

  // Implementar optimizador de scroll
  useEffect(() => {
    const cleanup = setupScrollOptimizer();
    return cleanup;
  }, []);

  // Optimizar handlers con useCallback
  const handleMethodSelect = useCallback((methodPath) => {
    console.log(`Navegando a: ${methodPath}`)
    setCurrentPage(methodPath)
  }, []);

  const handleBackToHome = useCallback(() => {
    setCurrentPage('home')
  }, []);

  // Memoizar el componente de página actual para evitar re-renders
  const currentPageComponent = useMemo(() => {
    const pageProps = { onBack: handleBackToHome };
    
    switch(currentPage) {
      case 'grafico':
        return <MetodoGrafico {...pageProps} />
      case 'simplex':
        return <MetodoSimplex {...pageProps} />
      case 'simplex-dual':
        return <SimplexDual {...pageProps} />
      case 'gran-m':
        return <MetodoGranM {...pageProps} />
      case 'binario':
        return <MetodoBinario {...pageProps} />
      case 'hungaro':
        return <MetodoHungaro {...pageProps} />
      case 'noroeste':
        return <EsquinaNoroeste {...pageProps} />
      default:
        return <Home onMethodSelect={handleMethodSelect} />
    }
  }, [currentPage, handleBackToHome, handleMethodSelect]);

  // Memoizar estilos de fondo para evitar recálculos
  const backgroundStyle = useMemo(() => ({
    backgroundImage: `url(${mainBg})`
  }), []);

  // Memoizar variantes de animación
  const overlayVariants = useMemo(() => ({
    initial: { opacity: 1 },
    animate: { opacity: 0 },
    blackOverlay: { duration: 1, delay: 0.5, ease: "easeInOut" },
    gradientOverlay: { duration: 2, delay: 1.2, ease: "easeOut" }
  }), []);

  return (
    <Router>
      <div className="min-h-screen bg-slate-900">
        {/* Pantalla negra inicial que desaparece */}
        <motion.div
          className="fixed inset-0 bg-black z-50"
          initial={overlayVariants.initial}
          animate={overlayVariants.animate}
          transition={overlayVariants.blackOverlay}
          style={{ pointerEvents: "none" }}
        />
        
        {/* Revelar el fondo con transición suave y difuminada */}
        <motion.div
          className="fixed inset-0 pointer-events-none"
          initial={overlayVariants.initial}
          animate={overlayVariants.animate}
          transition={overlayVariants.gradientOverlay}
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

        {/* Logos optimizados */}
        <LogoSection />

        <div 
          className="h-screen w-screen bg-cover bg-center flex flex-col items-center justify-center relative"
          style={backgroundStyle}
        >
          {/* Partículas de fondo optimizadas */}
          <BackgroundParticles />

          <div 
            className="h-full w-full bg-black/40 dark:bg-black/60 flex flex-col items-center justify-center overflow-y-auto relative py-12"
            style={{ zIndex: 10 }}
          >
            {/* Contenido principal con scroll optimizado */}
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentPage}
                className="w-full flex flex-col items-center justify-center min-h-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: 0, duration: 0.6, ease: "easeOut" }}
              >
                <Suspense fallback={<LoadingSpinner />}>
                  {currentPageComponent}
                </Suspense>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Router>
  )
})

App.displayName = 'App'

export default App
