import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

const EsquinaNoroeste = ({ onBack }) => {
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
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-600 bg-clip-text text-transparent">
            📍 Esquina Noroeste
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Método heurístico para encontrar solución básica factible inicial
          </p>
        </motion.div>

        {/* Contenido en construcción */}
        <motion.div 
          className="bg-white/5 backdrop-blur-sm rounded-2xl p-12 border border-white/10 text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="text-6xl mb-6">🚧</div>
          <h2 className="text-2xl font-bold text-white mb-4">En construcción</h2>
          <p className="text-gray-300 text-lg max-w-md mx-auto">
            Próximamente tendrás toda la información y calculadora del método Esquina Noroeste
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default EsquinaNoroeste
