import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

const MetodoBinario = ({ onBack }) => {
  return (
    <motion.div 
      className="w-full max-w-6xl mx-auto px-6 py-8 min-h-screen flex flex-col"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Botón de regreso */}
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
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 via-cyan-500 to-teal-500 bg-clip-text text-transparent">
            ⚡ Programación Lineal Binaria
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Optimización con variables de decisión binarias (0 o 1)
          </p>
        </motion.div>

        {/* Información del método */}
        <motion.div 
          className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-white mb-4">📋 Características de la Programación Binaria</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="text-2xl mb-2">🎯</div>
              <h3 className="text-white font-semibold">Variables</h3>
              <p className="text-gray-300 text-sm">Solo 0 o 1</p>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="text-2xl mb-2">🧠</div>
              <h3 className="text-white font-semibold">Aplicación</h3>
              <p className="text-gray-300 text-sm">Decisiones Si/No</p>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="text-2xl mb-2">⚡</div>
              <h3 className="text-white font-semibold">Método</h3>
              <p className="text-gray-300 text-sm">Branch & Bound</p>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="text-2xl mb-2">🔬</div>
              <h3 className="text-white font-semibold">Complejidad</h3>
              <p className="text-gray-300 text-sm">NP-Completo</p>
            </div>
          </div>
        </motion.div>

        {/* Descripción del método */}
        <motion.div 
          className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h3 className="text-2xl font-bold text-white mb-6">🧠 ¿Qué es la Programación Binaria?</h3>
          
          <div className="space-y-6 text-gray-300">
            <p className="text-lg leading-relaxed">
              La programación lineal binaria es un tipo especial de programación lineal entera donde 
              las variables de decisión solo pueden tomar valores de 0 o 1. Es ideal para modelar 
              decisiones de tipo "sí/no", "seleccionar/no seleccionar".
            </p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xl font-semibold text-cyan-400 mb-4">🎯 Aplicaciones típicas:</h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 text-xl">•</span>
                    <span>Selección de proyectos de inversión</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 text-xl">•</span>
                    <span>Problemas de localización de plantas</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 text-xl">•</span>
                    <span>Asignación de recursos limitados</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 text-xl">•</span>
                    <span>Problemas de la mochila (Knapsack)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 text-xl">•</span>
                    <span>Diseño de redes y circuitos</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-xl font-semibold text-teal-400 mb-4">⚙️ Métodos de solución:</h4>
                <ol className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 font-bold">1.</span>
                    <span><strong>Branch and Bound:</strong> Método exacto</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 font-bold">2.</span>
                    <span><strong>Cutting Planes:</strong> Planos de corte</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 font-bold">3.</span>
                    <span><strong>Heurísticas:</strong> Métodos aproximados</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 font-bold">4.</span>
                    <span><strong>Metaheurísticas:</strong> Algoritmos genéticos</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Ejemplo del problema de la mochila */}
        <motion.div 
          className="bg-gradient-to-br from-cyan-500/10 to-teal-500/10 rounded-2xl p-8 border border-cyan-500/20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h3 className="text-2xl font-bold text-white mb-6">🎒 Ejemplo: Problema de la Mochila</h3>
          
          <div className="bg-black/30 rounded-lg p-6 font-mono text-sm">
            <p className="text-cyan-400 mb-4">Formulación matemática:</p>
            <div className="text-white space-y-2 mb-6">
              <p>Maximizar: Z = 60x₁ + 100x₂ + 120x₃</p>
              <p>Sujeto a:</p>
              <p className="ml-4">10x₁ + 20x₂ + 30x₃ ≤ 50 (peso)</p>
              <p className="ml-4">x₁, x₂, x₃ ∈ &#123;0, 1&#125;</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-500/20 p-4 rounded-lg">
                <p className="text-blue-300 font-bold">Objeto 1</p>
                <p className="text-white">Valor: 60</p>
                <p className="text-white">Peso: 10</p>
              </div>
              <div className="bg-green-500/20 p-4 rounded-lg">
                <p className="text-green-300 font-bold">Objeto 2</p>
                <p className="text-white">Valor: 100</p>
                <p className="text-white">Peso: 20</p>
              </div>
              <div className="bg-purple-500/20 p-4 rounded-lg">
                <p className="text-purple-300 font-bold">Objeto 3</p>
                <p className="text-white">Valor: 120</p>
                <p className="text-white">Peso: 30</p>
              </div>
            </div>
            
            <p className="text-teal-400 mb-2">Interpretación de variables:</p>
            <div className="text-white space-y-1">
              <p>• x₁ = 1 → Seleccionar objeto 1, x₁ = 0 → No seleccionar</p>
              <p>• x₂ = 1 → Seleccionar objeto 2, x₂ = 0 → No seleccionar</p>
              <p>• x₃ = 1 → Seleccionar objeto 3, x₃ = 0 → No seleccionar</p>
            </div>
          </div>
        </motion.div>

        {/* Branch and Bound */}
        <motion.div 
          className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <h3 className="text-2xl font-bold text-white mb-6">🌳 Método Branch and Bound</h3>
          
          <div className="space-y-6 text-gray-300">
            <p className="text-lg leading-relaxed">
              El algoritmo Branch and Bound es el método exacto más utilizado para resolver problemas 
              de programación binaria. Explora sistemáticamente el espacio de soluciones creando 
              un árbol de decisiones.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-500/10 p-6 rounded-lg border border-blue-500/20">
                <h4 className="text-lg font-semibold text-blue-400 mb-4">🔍 Proceso de Branching:</h4>
                <ol className="space-y-2 text-sm">
                  <li>1. Resolver relajación lineal (xi ∈ [0,1])</li>
                  <li>2. Si solución es entera → candidata</li>
                  <li>3. Si no, elegir variable fraccionaria</li>
                  <li>4. Crear dos ramas: xi = 0 y xi = 1</li>
                  <li>5. Repetir para cada subproblema</li>
                </ol>
              </div>
              
              <div className="bg-green-500/10 p-6 rounded-lg border border-green-500/20">
                <h4 className="text-lg font-semibold text-green-400 mb-4">✂️ Proceso de Bounding:</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Calcular cota superior (relajación lineal)</li>
                  <li>• Mantener mejor solución entera encontrada</li>
                  <li>• Podar ramas con cotas peores</li>
                  <li>• Actualizar solución incumbent</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Próximamente */}
        <motion.div 
          className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <div className="text-6xl mb-4">🚧</div>
          <h3 className="text-2xl font-bold text-white mb-4">Calculadora en Desarrollo</h3>
          <p className="text-gray-300 text-lg">
            La implementación interactiva del algoritmo Branch and Bound estará disponible próximamente.
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default MetodoBinario
