import { motion } from 'framer-motion'
import SimpleMethodCard from './SimpleMethodCard'

const MethodsGrid = ({ onMethodSelect }) => {
  console.log('MethodsGrid received onMethodSelect:', typeof onMethodSelect)
  
  const handleCardClick = (path) => {
    console.log('MethodsGrid handleCardClick called with:', path)
    if (onMethodSelect) {
      onMethodSelect(path)
    } else {
      console.error('onMethodSelect is not defined!')
    }
  }
  
  const methods = [
    {
      id: 1,
      title: "Método Gráfico",
      description: "Solución visual para problemas de programación lineal con 2 variables",
      icon: "📊",
      difficulty: "Básico",
      path: "grafico"
    },
    {
      id: 2,
      title: "Método Simplex",
      description: "Algoritmo clásico para optimización lineal con múltiples variables",
      icon: "🔢",
      difficulty: "Intermedio",
      path: "simplex"
    },
    {
      id: 3,
      title: "Simplex Dual",
      description: "Variante del simplex para casos con restricciones especiales",
      icon: "🔄",
      difficulty: "Avanzado",
      path: "simplex-dual"
    },
    {
      id: 4,
      title: "Método de la Gran M",
      description: "Técnica para problemas con restricciones de igualdad y mayor igual",
      icon: "🔺",
      difficulty: "Intermedio",
      path: "gran-m"
    },
    {
      id: 5,
      title: "Programación Binaria",
      description: "Optimización con variables de decisión binarias (0 o 1)",
      icon: "⚡",
      difficulty: "Avanzado",
      path: "binario"
    },
    {
      id: 6,
      title: "Método Húngaro",
      description: "Optimización de asignación de tareas y recursos",
      icon: "🎯",
      difficulty: "Intermedio",
      path: "hungaro"
    },
    {
      id: 7,
      title: "Esquina Noroeste",
      description: "Método heurístico para problemas de transporte",
      icon: "🧭",
      difficulty: "Básico",
      path: "noroeste"
    }
  ]

  return (
    <motion.div 
      className="w-full max-w-6xl mx-auto px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0 }}
    >
      {/* Descripción académica */}
      <motion.div 
        className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 mb-12"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Universidad Nacional Jorge Basadre Grohmann</h2>
          <p className="text-lg text-gray-300 mb-6">
            Esta aplicación presenta los métodos más importantes de la Investigación Operativa, 
            una disciplina que aplica técnicas matemáticas avanzadas para resolver problemas 
            complejos de optimización en la toma de decisiones.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="text-3xl mb-2">🎯</div>
              <h3 className="text-white font-semibold mb-2">Optimización</h3>
              <p className="text-gray-400 text-sm">Encuentra la mejor solución entre múltiples alternativas</p>
            </div>
            
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="text-3xl mb-2">📐</div>
              <h3 className="text-white font-semibold mb-2">Matemática Aplicada</h3>
              <p className="text-gray-400 text-sm">Utiliza modelos matemáticos para resolver problemas reales</p>
            </div>
            
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="text-3xl mb-2">💼</div>
              <h3 className="text-white font-semibold mb-2">Decisiones Estratégicas</h3>
              <p className="text-gray-400 text-sm">Herramientas para la gestión eficiente de recursos</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Grid de métodos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {methods.map((method, index) => (
          <div
            key={method.id}
            className="relative group cursor-pointer bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-cyan-600/20 backdrop-blur-sm border border-white/10 rounded-2xl p-6 h-56 hover:border-white/30 hover:scale-105 transition-all duration-300 overflow-hidden"
            onClick={() => {
              console.log('Card clicked:', method.title, method.path)
              handleCardClick(method.path)
            }}
          >
            {/* Partículas animadas de fondo - NO INTERFIEREN CON CLICKS */}
            <div className="absolute inset-0 pointer-events-none">
              <motion.div
                className="absolute w-2 h-2 bg-blue-400 rounded-full opacity-30"
                animate={{
                  x: [10, 120, 10],
                  y: [20, 100, 20],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 4 + index * 0.3,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute w-1 h-1 bg-purple-400 rounded-full opacity-40 right-6 top-6"
                animate={{
                  scale: [1, 1.8, 1],
                  opacity: [0.4, 0.8, 0.4]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2.5 + index * 0.2,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute w-1.5 h-1.5 bg-cyan-400 rounded-full opacity-25 left-8 bottom-8"
                animate={{
                  x: [0, 30, 0],
                  y: [0, -20, 0],
                  rotate: [0, 360, 720]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3.5 + index * 0.4,
                  ease: "easeInOut"
                }}
              />
            </div>

            {/* Efecto de brillo en hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            {/* Efecto de esquina brillante */}
            <div className="absolute top-0 right-0 w-0 h-0 border-l-[40px] border-l-transparent border-t-[40px] border-t-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            {/* Contenido */}
            <div className="relative z-10 h-full flex flex-col justify-between text-center">
              {/* Icono y título */}
              <div>
                <motion.div 
                  className="text-4xl mb-3"
                  animate={{ 
                    rotate: [0, 3, -3, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 3 + index * 0.5,
                    ease: "easeInOut"
                  }}
                >
                  {method.icon}
                </motion.div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors duration-300">
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
                  <motion.span 
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      method.difficulty === 'Básico' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                      method.difficulty === 'Intermedio' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                      'bg-red-500/20 text-red-300 border border-red-500/30'
                    }`}
                    animate={{
                      boxShadow: [
                        '0 0 0px rgba(255,255,255,0)',
                        '0 0 10px rgba(255,255,255,0.3)',
                        '0 0 0px rgba(255,255,255,0)'
                      ]
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 2 + index * 0.3,
                      ease: "easeInOut"
                    }}
                  >
                    {method.difficulty}
                  </motion.span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Información adicional */}
      <motion.div 
        className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-8 border border-blue-500/20 text-center mb-16"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0 }}
      >
        <h3 className="text-2xl font-bold text-white mb-4">💡 ¿Por qué Investigación Operativa?</h3>
        <p className="text-gray-300 text-lg mb-6">
          La Investigación Operativa es fundamental para ingenieros, administradores y analistas 
          que buscan optimizar procesos, minimizar costos y maximizar eficiencia en organizaciones complejas.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/5 p-4 rounded-lg">
            <div className="text-2xl mb-2">🏭</div>
            <h4 className="text-white font-semibold">Industria</h4>
            <p className="text-gray-400 text-sm">Optimización de procesos productivos</p>
          </div>
          
          <div className="bg-white/5 p-4 rounded-lg">
            <div className="text-2xl mb-2">🚛</div>
            <h4 className="text-white font-semibold">Logística</h4>
            <p className="text-gray-400 text-sm">Gestión eficiente de cadenas de suministro</p>
          </div>
          
          <div className="bg-white/5 p-4 rounded-lg">
            <div className="text-2xl mb-2">💰</div>
            <h4 className="text-white font-semibold">Finanzas</h4>
            <p className="text-gray-400 text-sm">Optimización de portafolios de inversión</p>
          </div>
          
          <div className="bg-white/5 p-4 rounded-lg">
            <div className="text-2xl mb-2">🏥</div>
            <h4 className="text-white font-semibold">Servicios</h4>
            <p className="text-gray-400 text-sm">Programación óptima de recursos</p>
          </div>
        </div>
      </motion.div>

      {/* Footer */}
      <motion.div 
        className="text-center pb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
      >
        <p className="text-gray-400 mb-2">
          Desarrollado para el aprendizaje de Investigación Operativa
        </p>
        <p className="text-gray-500 text-sm">
          Universidad Nacional Jorge Basadre Grohmann - Tacna, Perú
        </p>
      </motion.div>
    </motion.div>
  )
}

export default MethodsGrid
