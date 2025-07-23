import { motion } from 'framer-motion'
import { ArrowLeft, Calculator, Brain, Target, Zap, TrendingUp, Binary } from 'lucide-react'
import TableGenerator from '../components/TableGenerator'
import { useState, useCallback, useMemo, memo } from 'react'

// Utilidad para convertir número en string binario con padding
function toBinaryString(num, length) {
  return num.toString(2).padStart(length, '0')
}

// Algoritmo didáctico binario con pasos/tablas educativas
function Binario(problema) {
  const {
    numVariables,
    zCoeffs,
    restricciones,
    tipoZ
  } = problema

  // Paso 1: Generar todas las combinaciones
  const totalCombinaciones = Math.pow(2, numVariables)
  const combinaciones = []
  for (let i = 0; i < totalCombinaciones; i++) {
    const bin = toBinaryString(i, numVariables)
    combinaciones.push(bin.split('').map(Number))
  }

  // Paso 2: Calcular costo y beneficio
  // Costo = primera restricción (usada como función objetivo)
  // Beneficio = función objetivo
  const tablaPaso2 = combinaciones.map((comb, idx) => {
    const costo = restricciones[0].coeficientes.reduce((acc, coef, i) => acc + coef * comb[i], 0)
    const beneficio = zCoeffs.reduce((acc, coef, i) => acc + coef * comb[i], 0)
    return {
      caso: idx + 1,
      variables: comb,
      costo,
      beneficio
    }
  })

  // Paso 3: Revisar admisibilidad (todas las restricciones)
  const tablaPaso3 = tablaPaso2.map(row => {
    let admisible = true
    for (let i = 0; i < restricciones.length; i++) {
      const { coeficientes, relacion, resultado } = restricciones[i]
      const suma = coeficientes.reduce((acc, coef, j) => acc + coef * row.variables[j], 0)
      if (relacion === '<=' && suma > resultado) admisible = false
      if (relacion === '>=' && suma < resultado) admisible = false
      if (relacion === '='  && suma !== resultado) admisible = false
    }
    return {
      ...row,
      admisible
    }
  })

  // Paso 4: Seleccionar el de mayor beneficio (entre los admisibles)
  // Beneficio es función objetivo
  const admisibles = tablaPaso3.filter(row => row.admisible)
  let seleccionado = null
  if (admisibles.length > 0) {
    seleccionado = admisibles.reduce((best, row) =>
      tipoZ === 'max'
        ? (row.beneficio > best.beneficio ? row : best)
        : (row.beneficio < best.beneficio ? row : best)
    , admisibles[0])
  }

  // Para mostrar resultado óptimo en la UI estándar
  const resultadoAlgoritmo = {
    optimo: seleccionado
      ? { Z: seleccionado.beneficio, variables: seleccionado.variables }
      : { Z: null, variables: null }
  }

  // Pasos para mostrar en la UI didáctica
  const pasos = [
    {
      titulo: "1️⃣ Identificar las combinaciones",
      contenido: (
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-center border-collapse rounded overflow-hidden">
            <thead>
              <tr className="bg-cyan-700 text-white">
                <th className="px-2 py-1">Caso</th>
                {Array.from({ length: numVariables }, (_, i) => (
                  <th key={i} className="px-2 py-1">{`x${i + 1}`}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {combinaciones.map((comb, idx) => (
                <tr key={idx} className="bg-cyan-900/20">
                  <td className="px-2 py-1 font-mono">{idx + 1}</td>
                  {comb.map((v, j) => (
                    <td key={j} className="px-2 py-1 font-mono">{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    },
    {
      titulo: "2️⃣ Asignar costo y beneficio",
      contenido: (
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-center border-collapse rounded overflow-hidden">
            <thead>
              <tr className="bg-cyan-700 text-white">
                <th className="px-2 py-1">Caso</th>
                {Array.from({ length: numVariables }, (_, i) => (
                  <th key={i} className="px-2 py-1">{`x${i + 1}`}</th>
                ))}
                <th className="px-2 py-1">Costo</th>
                <th className="px-2 py-1">Beneficio</th>
              </tr>
            </thead>
            <tbody>
              {tablaPaso2.map((row, idx) => (
                <tr key={idx} className="bg-cyan-900/20">
                  <td className="px-2 py-1 font-mono">{row.caso}</td>
                  {row.variables.map((v, j) => (
                    <td key={j} className="px-2 py-1 font-mono">{v}</td>
                  ))}
                  <td className="px-2 py-1 font-mono">{row.costo}</td>
                  <td className="px-2 py-1 font-mono">{row.beneficio}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    },
    {
      titulo: "3️⃣ Revisar los admisibles",
      contenido: (
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-center border-collapse rounded overflow-hidden">
            <thead>
              <tr className="bg-cyan-700 text-white">
                <th className="px-2 py-1">Caso</th>
                {Array.from({ length: numVariables }, (_, i) => (
                  <th key={i} className="px-2 py-1">{`x${i + 1}`}</th>
                ))}
                <th className="px-2 py-1">Costo</th>
                <th className="px-2 py-1">Beneficio</th>
                <th className="px-2 py-1">Admisible</th>
              </tr>
            </thead>
            <tbody>
              {tablaPaso3.map((row, idx) => (
                <tr
                  key={idx}
                  className={
                    row.admisible
                      ? "bg-yellow-300/50"
                      : "bg-cyan-900/20"
                  }
                >
                  <td className="px-2 py-1 font-mono">{row.caso}</td>
                  {row.variables.map((v, j) => (
                    <td key={j} className="px-2 py-1 font-mono">{v}</td>
                  ))}
                  <td className="px-2 py-1 font-mono">{row.costo}</td>
                  <td className="px-2 py-1 font-mono">{row.beneficio}</td>
                  <td className={`px-2 py-1 font-bold ${row.admisible ? "text-yellow-900" : "text-cyan-700"}`}>
                    {row.admisible ? "SI" : "NO"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    },
    {
      titulo: "4️⃣ Se selecciona el que tiene más beneficio",
      contenido: (
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-center border-collapse rounded overflow-hidden">
            <thead>
              <tr className="bg-green-700 text-white">
                <th className="px-2 py-1">Caso</th>
                {Array.from({ length: numVariables }, (_, i) => (
                  <th key={i} className="px-2 py-1">{`x${i + 1}`}</th>
                ))}
                <th className="px-2 py-1">Costo</th>
                <th className="px-2 py-1">Beneficio</th>
                <th className="px-2 py-1">Admisible</th>
              </tr>
            </thead>
            <tbody>
              {tablaPaso3.map((row, idx) => (
                <tr
                  key={idx}
                  className={
                    seleccionado && row.caso === seleccionado.caso
                      ? "bg-green-400/90"
                      : row.admisible
                        ? "bg-yellow-300/50"
                        : "bg-cyan-900/20"
                  }
                >
                  <td className="px-2 py-1 font-mono">{row.caso}</td>
                  {row.variables.map((v, j) => (
                    <td key={j} className="px-2 py-1 font-mono">{v}</td>
                  ))}
                  <td className="px-2 py-1 font-mono">{row.costo}</td>
                  <td className="px-2 py-1 font-mono">{row.beneficio}</td>
                  <td className={`px-2 py-1 font-bold ${row.admisible ? "text-yellow-900" : "text-cyan-700"}`}>
                    {row.admisible ? "SI" : "NO"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {seleccionado ? (
            <div className="mt-4 p-3 rounded bg-green-700 text-white font-bold text-lg">
              Solución óptima: Caso {seleccionado.caso}, Beneficio = {seleccionado.beneficio}, x = [{seleccionado.variables.join(', ')}]
            </div>
          ) : (
            <div className="mt-4 p-3 rounded bg-red-700 text-white font-bold text-lg">
              No se encontró solución factible.
            </div>
          )}
        </div>
      )
    }
  ]

  return {
    optimo: resultadoAlgoritmo.optimo,
    pasos // para renderizar didácticamente
  }
}

const MetodoBinario = memo(({ onBack }) => {
  const [problema, setProblema] = useState(null)
  const [resultado, setResultado] = useState(null)

  // Optimizar resolverProblema con useCallback
  const resolverProblema = useCallback(() => {
    if (!problema) return
    
    // Usar requestAnimationFrame para operaciones pesadas
    requestAnimationFrame(() => {
      const res = Binario(problema)
      setResultado(res)
    })
  }, [problema])

  // Memoizar el callback de onBack
  const handleBackClick = useCallback(() => {
    onBack?.()
  }, [onBack])

  // Memoizar variantes de animación
  const motionVariants = useMemo(() => ({
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
    transition: { duration: 0.6, ease: "easeOut" }
  }), [])

  // Memoizar las tarjetas de características
  const caracteristicasCards = useMemo(() => [
    {
      icon: Target,
      title: "Variables",
      description: "Solo 0 o 1",
      gradient: "from-blue-500/10 to-cyan-500/10",
      border: "border-blue-500/20",
      iconColor: "text-blue-400"
    },
    {
      icon: Brain,
      title: "Aplicación", 
      description: "Decisiones Si/No",
      gradient: "from-purple-500/10 to-pink-500/10",
      border: "border-purple-500/20",
      iconColor: "text-purple-400"
    },
    {
      icon: Zap,
      title: "Método",
      description: "Mochila Binaria",
      gradient: "from-yellow-500/10 to-orange-500/10",
      border: "border-yellow-500/20",
      iconColor: "text-yellow-400"
    },
    {
      icon: TrendingUp,
      title: "Complejidad",
      description: "NP-Completo",
      gradient: "from-red-500/10 to-pink-500/10",
      border: "border-red-500/20",
      iconColor: "text-red-400"
    }
  ], [])

  // Memoizar botón de resolver para evitar re-renders
  const ResolverButton = useMemo(() => (
    <motion.button
      onClick={resolverProblema}
      disabled={!problema}
      className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 disabled:from-gray-500 disabled:to-gray-600 text-white rounded-xl font-medium transition-all duration-300 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-500/25"
      whileHover={problema ? { scale: 1.05, y: -2 } : {}}
      whileTap={problema ? { scale: 0.95 } : {}}
    >
      <Calculator className="inline mr-2" size={20} />
      Resolver con Método Binario
    </motion.button>
  ), [problema, resolverProblema])

  return (
    <motion.div
      className="w-full max-w-7xl mx-auto px-6 py-8 min-h-screen flex flex-col"
      {...motionVariants}
    >
      {/* Botón de regreso optimizado */}
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

      <div className="flex-1">
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
              <p className="text-gray-300 text-sm">Mochila Binaria</p>
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
                    <span><strong>Mochila Binaria:</strong> Enumeración completa de combinaciones binarias</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 font-bold">2.</span>
                    <span><strong>Algoritmos dinámicos:</strong> Para variantes más complejas</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 font-bold">3.</span>
                    <span><strong>Metaheurísticas:</strong> Algoritmos genéticos, búsqueda local</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Método de la mochila */}
        <motion.div
          className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <h3 className="text-2xl font-bold text-white mb-6">🎒 Método de la Mochila Binaria</h3>
          <div className="space-y-6 text-gray-300 text-lg">
            <p>
              El método de la mochila binaria es una técnica de optimización combinatoria que busca seleccionar un subconjunto óptimo de elementos (por ejemplo, objetos, proyectos, inversiones) bajo una restricción de capacidad o presupuesto. Cada elemento tiene un peso o costo y un beneficio asociado, y el objetivo es maximizar el beneficio total sin exceder la capacidad disponible.
            </p>
            <p>
              El procedimiento consiste en generar todas las combinaciones posibles de selección (variables binarias 0/1), calcular el costo y el beneficio para cada una, descartar las combinaciones no admisibles que violen alguna restricción, y finalmente elegir la combinación admisible que maximiza el beneficio.
            </p>
            <ul className="list-disc ml-6">
              <li>
                <strong>Variables binarias:</strong> Cada variable representa si un elemento se selecciona (1) o no (0).
              </li>
              <li>
                <strong>Costo:</strong> Suma de los costos de los elementos seleccionados (usualmente la restricción principal).
              </li>
              <li>
                <strong>Beneficio:</strong> Suma de los beneficios de los elementos seleccionados (función objetivo).
              </li>
              <li>
                <strong>Admisibilidad:</strong> Una solución es admisible si el costo total no excede la capacidad y cumple todas las restricciones adicionales.
              </li>
              <li>
                <strong>Solución óptima:</strong> Es la combinación admisible con mayor beneficio.
              </li>
            </ul>
            <p>
              Este método es didáctico y sirve para problemas pequeños, ya que la cantidad de combinaciones crece exponencialmente con el número de variables. Para problemas más grandes, se emplean algoritmos más eficientes como branch and bound o heurísticas.
            </p>
          </div>
        </motion.div>

        {/* Calculadora interactiva */}
        <TableGenerator onDataChange={setProblema} mostrarTipoVariable={true} />

        <div className="mt-8 flex justify-center">
          {ResolverButton}
        </div>

        {/* Resultados optimizados */}
        {resultado && (
          <motion.div
            className="bg-gradient-to-br from-slate-800/50 via-slate-700/30 to-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10 mt-8 relative overflow-hidden"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-cyan-500/5"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"></div>
            
            <div className="relative">
              <h3 className="text-2xl font-bold text-white mb-6">Proceso de Resolución Paso a Paso</h3>
              <div className="space-y-8">
                {resultado.pasos.map((paso, idx) => (
                  <motion.div
                    key={idx}
                    className="bg-white/5 rounded-xl p-6 border border-white/10"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                  >
                    <h4 className="text-xl font-bold mb-4 text-cyan-400">{paso.titulo}</h4>
                    <div className="overflow-x-auto">
                      {paso.contenido}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
})

MetodoBinario.displayName = 'MetodoBinario'

export default MetodoBinario