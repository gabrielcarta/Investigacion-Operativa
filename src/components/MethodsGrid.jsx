import { motion } from 'framer-motion'
import { memo, useCallback, useMemo } from 'react'

const MethodsGrid = memo(({ onMethodSelect }) => {
  console.log('MethodsGrid received onMethodSelect:', typeof onMethodSelect)
  
  const handleCardClick = useCallback((path) => {
    console.log('MethodsGrid handleCardClick called with:', path)
    if (onMethodSelect) {
      onMethodSelect(path)
    } else {
      console.error('onMethodSelect is not defined!')
    }
  }, [onMethodSelect])
  
  // Memoizar los métodos para evitar recrearlos en cada render
  const methods = useMemo(() => [
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
  ], [])

  // Memoizar variantes de animación
  const animationVariants = useMemo(() => ({
    container: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.6, delay: 0 }
    },
    description: {
      initial: { opacity: 0, y: 50 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.8, delay: 0.6 }
    },
    universityTitle: {
      initial: { opacity: 0, y: -20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.6, delay: 0.8 }
    },
    info: {
      initial: { opacity: 0, y: 50 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.6, delay: 1.0 }
    },
    footer: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.6, delay: 1.2 }
    }
  }), [])

  // Memoizar las tarjetas de métodos para evitar re-renders
  const methodCards = useMemo(() => {
    return methods.map((method, index) => {
      const cardClickHandler = () => {
        console.log('Card clicked:', method.title, method.path)
        handleCardClick(method.path)
      }

      return (
        <div
          key={method.id}
          className="relative group cursor-pointer bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-cyan-600/20 backdrop-blur-sm border border-white/10 rounded-2xl p-6 h-56 hover:border-white/30 hover:scale-105 transition-all duration-300 overflow-hidden"
          onClick={cardClickHandler}
        >
          {/* Partículas animadas de fondo optimizadas */}
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

          {/* Contenido optimizado */}
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
      )
    })
  }, [methods, handleCardClick])

  return (
    <motion.div 
      className="w-full max-w-6xl mx-auto px-6"
      {...animationVariants.container}
    >
      {/* Descripción académica optimizada */}
      <motion.div 
        className="bg-gradient-to-br from-slate-800/50 via-slate-700/30 to-slate-800/50 backdrop-blur-sm rounded-3xl p-10 border border-white/20 mb-16 max-w-7xl mx-auto relative overflow-hidden"
        {...animationVariants.description}
      >
        {/* Efectos de fondo */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        
        <div className="relative">
          {/* Título de la Universidad */}
          <motion.div 
            className="text-center mb-10"
            {...animationVariants.universityTitle}
          >
            <h2 className="text-3xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-600 bg-clip-text text-transparent">
              Universidad Nacional Jorge Basadre Grohmann
            </h2>
            <p className="text-lg text-gray-300">Equipo de Desarrollo</p>
          </motion.div>

          {/* Tarjetas de los integrantes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Gabriel Carta */}
            <div className="bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-blue-500/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center group hover:from-pink-500/20 hover:via-purple-500/20 hover:to-blue-500/20 transition-all duration-500">
              <div className="mb-6 flex justify-center">
                <div className="p-4 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full group-hover:scale-110 transition-transform">
                  🎯
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 bg-gradient-to-r from-pink-400 to-purple-600 bg-clip-text text-transparent">
                Gabriel Carta
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Encuentra la mejor solución entre múltiples alternativas
              </p>
            </div>

            {/* Luis Choque */}
            <div className="bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-teal-500/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center group hover:from-blue-500/20 hover:via-cyan-500/20 hover:to-teal-500/20 transition-all duration-500">
              <div className="mb-6 flex justify-center">
                <div className="p-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full group-hover:scale-110 transition-transform">
                  📐
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-cyan-600 bg-clip-text text-transparent">
                Luis Choque
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Utiliza modelos matemáticos para resolver problemas reales
              </p>
            </div>

            {/* Diego Pumachoqque */}
            <div className="bg-gradient-to-br from-emerald-500/10 via-green-500/10 to-teal-500/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center group hover:from-emerald-500/20 hover:via-green-500/20 hover:to-teal-500/20 transition-all duration-500">
              <div className="mb-6 flex justify-center">
                <div className="p-4 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-full group-hover:scale-110 transition-transform">
                  💼
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 bg-gradient-to-r from-emerald-400 to-green-600 bg-clip-text text-transparent">
                Diego Pumachoqque
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Herramientas para la gestión eficiente de recursos
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Grid de métodos optimizado */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {methodCards}
      </div>

      {/* Información adicional */}
      <motion.div 
        className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-8 border border-blue-500/20 text-center mb-16"
        {...animationVariants.info}
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
        {...animationVariants.footer}
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
})

MethodsGrid.displayName = 'MethodsGrid'

export default MethodsGrid
