import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { useState, useCallback } from 'react'
import TableGenerator from '../components/TableGenerator'
import SimplexSolver from '../components/SimplexSolver'

const MetodoSimplex = ({ onBack }) => {
  const [problemData, setProblemData] = useState(null)

  const handleDataChange = useCallback((data) => {
    setProblemData(data)
  }, [])

  return (
    <motion.div 
      className="w-full max-w-6xl mx-auto px-6 py-8 min-h-screen flex flex-col"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Botón de regreso - MÁS VISIBLE */}
      <motion.button
        onClick={onBack}
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
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 bg-clip-text text-transparent">
            🔢 Método Simplex
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Algoritmo iterativo para resolver problemas de programación lineal
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
              <div className="text-2xl mb-2">�</div>
              <h3 className="text-white font-semibold">Variables</h3>
              <p className="text-gray-300 text-sm">Ilimitadas</p>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="text-2xl mb-2">🔄</div>
              <h3 className="text-white font-semibold">Proceso</h3>
              <p className="text-gray-300 text-sm">Iterativo</p>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="text-2xl mb-2">🎯</div>
              <h3 className="text-white font-semibold">Dificultad</h3>
              <p className="text-gray-300 text-sm">Intermedio</p>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="text-2xl mb-2">💪</div>
              <h3 className="text-white font-semibold">Potencia</h3>
              <p className="text-gray-300 text-sm">Alta</p>
            </div>
          </div>
        </motion.div>

        {/* Componente de generación de tabla */}
        <TableGenerator onDataChange={handleDataChange} />

        {/* Componente de resolución Simplex */}
        <SimplexSolver problemData={problemData} />
      </div>
    </motion.div>
  )
}

export default MetodoSimplex
