import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { useState, useCallback, useMemo, memo, lazy, Suspense } from 'react'

const TableGenerator = lazy(() => import('../components/TableGenerator'))
const GraficoSolver = lazy(() => import('../components/GraficoSolver'))

const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
  </div>
)

const MetodoGrafico = memo(({ onBack }) => {
  const [problemData, setProblemData] = useState(null)
  const [solutionData, setSolutionData] = useState(null)

  const handleDataChange = useCallback((data) => {
    setProblemData(data)
  }, [])

  const handleSolutionChange = useCallback((solution) => {
    setSolutionData(solution)
  }, [])

  const handleBackClick = useCallback(() => {
    onBack?.()
  }, [onBack])

  const motionVariants = useMemo(() => ({
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
    transition: { duration: 0.6, ease: "easeOut" }
  }), [])

  return (
    <motion.div 
      className="w-full max-w-6xl mx-auto px-6 py-8 min-h-screen flex flex-col"
      {...motionVariants}
    >
      {/* Botón de regreso - MÁS VISIBLE */}
      <motion.button
        onClick={handleBackClick}
        className="mb-6 self-start flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 backdrop-blur-sm rounded-xl border border-white/20 text-white transition-all duration-300 group shadow-lg"
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
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
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            📊 Método Gráfico
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Solución visual para problemas de programación lineal con 2 variables
          </p>
        </motion.div>

        {/* Información del método */}
        <motion.div 
          className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-white mb-4">📋 Características del Método</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="text-2xl mb-2">📏</div>
              <h3 className="text-white font-semibold">Variables</h3>
              <p className="text-gray-300 text-sm">Máximo 2 variables</p>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="text-2xl mb-2">📈</div>
              <h3 className="text-white font-semibold">Representación</h3>
              <p className="text-gray-300 text-sm">Plano cartesiano</p>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="text-2xl mb-2">🎯</div>
              <h3 className="text-white font-semibold">Dificultad</h3>
              <p className="text-gray-300 text-sm">Básico</p>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="text-2xl mb-2">⚡</div>
              <h3 className="text-white font-semibold">Velocidad</h3>
              <p className="text-gray-300 text-sm">Rápido</p>
            </div>
          </div>
        </motion.div>

        {/* Componente de generación de tabla */}
        <Suspense fallback={<LoadingSpinner />}>
          <TableGenerator onDataChange={handleDataChange} />
        </Suspense>

        {/* Componente de resolución gráfica */}
        <Suspense fallback={<LoadingSpinner />}>
          <GraficoSolver 
            problemData={problemData} 
            onSolutionChange={handleSolutionChange}
          />
        </Suspense>
      </div>
    </motion.div>
  )
})

MetodoGrafico.displayName = 'MetodoGrafico'

export default MetodoGrafico
