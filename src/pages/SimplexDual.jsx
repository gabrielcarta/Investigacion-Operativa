import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { useState, useCallback, useMemo, memo, lazy, Suspense } from 'react'

// Lazy loading de componentes pesados
const TableGenerator = lazy(() => import('../components/TableGenerator'))
const DualSolver = lazy(() => import('../components/DualSolver'))

const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full"></div>
  </div>
)

const SimplexDual = memo(({ onBack }) => {
  const [problemData, setProblemData] = useState(null)

  const handleDataChange = useCallback((data) => {
    setProblemData(data)
  }, [])

  const handleBackClick = useCallback(() => {
    onBack?.()
  }, [onBack])

  // Memoizar las animaciones para evitar recálculos
  const motionVariants = useMemo(() => ({
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
    transition: { duration: 0.6, ease: "easeOut" }
  }), [])

  const buttonVariants = useMemo(() => ({
    whileHover: { scale: 1.05, y: -2 },
    whileTap: { scale: 0.95 }
  }), [])

  return (
    <motion.div 
      className="w-full max-w-6xl mx-auto px-6 py-8 min-h-screen flex flex-col"
      {...motionVariants}
    >
      {/* Botón de regreso optimizado */}
      <motion.button
        onClick={handleBackClick}
        className="mb-6 self-start flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 backdrop-blur-sm rounded-xl border border-white/20 text-white transition-all duration-300 group shadow-lg"
        {...buttonVariants}
        style={{ zIndex: 50 }}
      >
        <ArrowLeft size={22} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Volver al inicio</span>
      </motion.button>

      {/* Contenido scrolleable */}
      <div className="flex-1">
        {/* Título */}
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
            🔄 Simplex Dual
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Método dual del algoritmo Simplex para problemas especiales
          </p>
        </motion.div>

        {/* Información del método */}
        <motion.div 
          className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-white mb-4">📋 Características del Método Dual</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="text-2xl mb-2">�</div>
              <h3 className="text-white font-semibold">Enfoque</h3>
              <p className="text-gray-300 text-sm">Dual</p>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="text-2xl mb-2">⚡</div>
              <h3 className="text-white font-semibold">Eficiencia</h3>
              <p className="text-gray-300 text-sm">Casos especiales</p>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="text-2xl mb-2">🎯</div>
              <h3 className="text-white font-semibold">Dificultad</h3>
              <p className="text-gray-300 text-sm">Avanzado</p>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="text-2xl mb-2">🔬</div>
              <h3 className="text-white font-semibold">Aplicación</h3>
              <p className="text-gray-300 text-sm">Especializada</p>
            </div>
          </div>
        </motion.div>

        {/* Componente de generación de tabla con lazy loading */}
        <Suspense fallback={<LoadingSpinner />}>
          <TableGenerator onDataChange={handleDataChange} />
        </Suspense>

        {/* Componente de resolución Simplex Dual con lazy loading */}
        <Suspense fallback={<LoadingSpinner />}>
          <DualSolver problemData={problemData} />
        </Suspense>
      </div>
    </motion.div>
  )
})

SimplexDual.displayName = 'SimplexDual'

export default SimplexDual
