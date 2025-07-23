import { motion } from 'framer-motion'

const SimpleMethodCard = ({ method, index, onClick }) => {
  return (
    <motion.div
      className="relative group cursor-pointer bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-cyan-600/20 backdrop-blur-sm border border-white/10 rounded-2xl p-6 h-56 hover:border-white/30 transition-all duration-150"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.05, 
        ease: "easeOut"
      }}
      whileHover={{ 
        scale: 1.05,
        transition: { duration: 0.15, ease: "easeOut" }
      }}
      whileTap={{ 
        scale: 0.98,
        transition: { duration: 0.1 }
      }}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        console.log('Simple card clicked:', method.title, method.path)
        onClick(method.path)
      }}
      style={{ 
        pointerEvents: 'auto',
        zIndex: 10
      }}
    >
      {/* Contenido */}
      <div className="relative z-10 h-full flex flex-col justify-between text-center">
        {/* Icono y título */}
        <div>
          <div className="text-4xl mb-3">{method.icon}</div>
          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors duration-150">
            {method.title}
          </h3>
        </div>

        {/* Descripción */}
        <div>
          <p className="text-sm text-gray-300 mb-3 leading-relaxed">
            {method.description}
          </p>
          
          {/* Badge de dificultad */}
          <div className="flex justify-center">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              method.difficulty === 'Básico' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
              method.difficulty === 'Intermedio' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
              'bg-red-500/20 text-red-300 border border-red-500/30'
            }`}>
              {method.difficulty}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default SimpleMethodCard
