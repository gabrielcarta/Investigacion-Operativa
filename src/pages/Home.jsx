import { motion } from 'framer-motion'
import MethodsGrid from '../components/MethodsGrid'

const Home = ({ onMethodSelect }) => {
  return (
    <motion.div 
      className="w-full flex flex-col items-center justify-start min-h-full pt-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Título principal */}
      <motion.div 
        className="text-center mb-16"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "backOut" }}
      >
        <motion.h1 
          className="text-7xl font-bold text-white mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          🔬 Investigación Operativa
        </motion.h1>
        <motion.p 
          className="text-2xl text-gray-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Métodos de Optimización Matemática
        </motion.p>
      </motion.div>

      <MethodsGrid onMethodSelect={onMethodSelect} />
    </motion.div>
  )
}

export default Home
