import { motion } from 'framer-motion'
import { memo, useCallback, useMemo, lazy, Suspense } from 'react'

// Lazy loading del componente MethodsGrid
const MethodsGrid = lazy(() => import('../components/MethodsGrid'))

const LoadingGrid = memo(() => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full"></div>
  </div>
))

LoadingGrid.displayName = 'LoadingGrid'

const Home = memo(({ onMethodSelect }) => {
  // Optimizar handler con useCallback
  const handleMethodSelect = useCallback((method) => {
    onMethodSelect?.(method)
  }, [onMethodSelect])

  // Memoizar todas las variantes de animación para evitar recálculos
  const animationVariants = useMemo(() => ({
    container: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
      transition: { duration: 0.8, ease: "easeOut" }
    },
    title: {
      initial: { opacity: 0, y: -30 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.8, ease: "backOut" }
    },
    heading: {
      initial: { scale: 0.8 },
      animate: { scale: 1 },
      transition: { duration: 0.8, delay: 0.2 }
    },
    subtitle: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.8, delay: 0.4 }
    }
  }), [])

  return (
    <motion.div 
      className="w-full flex flex-col items-center justify-start min-h-full pt-12"
      {...animationVariants.container}
    >
      {/* Título principal optimizado */}
      <motion.div 
        className="text-center mb-16"
        {...animationVariants.title}
      >
        <motion.h1 
          className="text-7xl font-bold text-white mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent"
          {...animationVariants.heading}
        >
          🔬 Investigación Operativa
        </motion.h1>
        <motion.p 
          className="text-2xl text-gray-300"
          {...animationVariants.subtitle}
        >
          Métodos de Optimización Matemática
        </motion.p>
      </motion.div>

      {/* MethodsGrid con lazy loading */}
      <Suspense fallback={<LoadingGrid />}>
        <MethodsGrid onMethodSelect={handleMethodSelect} />
      </Suspense>
    </motion.div>
  )
})

Home.displayName = 'Home'

export default Home