import { useState } from 'react'
import { motion } from 'framer-motion'

const DualSolver = ({ problemData }) => {
  const [solution, setSolution] = useState(null)
  const [iterations, setIterations] = useState([])
  const [isCalculating, setIsCalculating] = useState(false)

  const generateTableHTML = (data, etiquetasBase) => {
    return (
      <div className="overflow-x-auto mb-6">
        <table className="w-full border border-white/20 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-blue-500/20">
              <th className="px-4 py-2 border border-white/10 text-center text-white">Base</th>
              {data[0] && data[0].slice(0, -1).map((_, j) => (
                <th key={j} className="px-4 py-2 border border-white/10 text-center text-white">
                  Y{j + 1}
                </th>
              ))}
              <th className="px-4 py-2 border border-white/10 text-center text-white">Solución</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} className={i === data.length - 1 ? 'bg-purple-500/20' : 'bg-white/5'}>
                <td className="px-4 py-2 border border-white/10 text-center text-white font-medium">
                  {etiquetasBase[i]}
                </td>
                {row.map((cell, j) => (
                  <td key={j} className="px-4 py-2 border border-white/10 text-center text-white">
                    {typeof cell === 'number' ? cell.toFixed(2) : cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  const resolverSimplexDual = () => {
    if (!problemData) return

    setIsCalculating(true)
    const { numVariables, numRestricciones, tipoZ, zCoeffs, restricciones } = problemData

    console.log('=== PROBLEMA ORIGINAL ===')
    console.log('Tipo:', tipoZ)
    console.log('Coeficientes Z:', zCoeffs)
    console.log('Restricciones:', restricciones)

    // Construir el problema dual
    // Si el primal es MAX, el dual es MIN (y viceversa)
    const tipoDual = tipoZ === 'max' ? 'min' : 'max'
    
    // Dimensiones del dual: n variables duales, m restricciones duales
    const nVarDuales = numRestricciones  // Una variable dual por cada restricción primal
    const mRestDuales = numVariables     // Una restricción dual por cada variable primal
    
    // Construir tabla para el problema dual
    const tabla = []
    const etiquetasBase = []
    const iteracionesTemp = []

    // Inicializar tabla con ceros
    for (let i = 0; i <= mRestDuales; i++) {
      tabla[i] = new Array(nVarDuales + mRestDuales + 1).fill(0)
    }

    // Matriz A del dual = A^T del primal
    for (let i = 0; i < mRestDuales; i++) { // Filas del dual (restricciones duales)
      for (let j = 0; j < nVarDuales; j++) { // Columnas del dual (variables duales)
        tabla[i][j] = restricciones[j].coeficientes[i] || 0
      }
    }

    // Variables de holgura para el dual
    for (let i = 0; i < mRestDuales; i++) {
      for (let j = 0; j < mRestDuales; j++) {
        tabla[i][nVarDuales + j] = (i === j) ? 1 : 0
      }
    }

    // Lado derecho del dual = coeficientes de la función objetivo primal
    for (let i = 0; i < mRestDuales; i++) {
      tabla[i][nVarDuales + mRestDuales] = zCoeffs[i] || 0
    }

    // Función objetivo del dual = lados derechos del primal
    // Para convertir a forma estándar (minimización), usamos coeficientes negativos
    for (let j = 0; j < nVarDuales; j++) {
      const coefDual = restricciones[j].resultado || 0
      // Si el dual es minimización, ponemos negativos para usar algoritmo de maximización
      tabla[mRestDuales][j] = tipoDual === 'min' ? -coefDual : coefDual
    }

    // Etiquetas base iniciales del dual (variables de holgura)
    for (let i = 0; i < mRestDuales; i++) {
      etiquetasBase[i] = `Y${nVarDuales + i + 1}`
    }
    etiquetasBase[mRestDuales] = 'Zj - Cj'

    console.log('=== PROBLEMA DUAL CONSTRUIDO ===')
    console.log('Tipo dual:', tipoDual)
    console.log('Variables duales:', nVarDuales)
    console.log('Restricciones duales:', mRestDuales)
    console.log('Tabla inicial dual:', tabla)

    // Guardar tabla inicial
    iteracionesTemp.push({
      numero: 0,
      titulo: 'Tabla Dual Inicial',
      tabla: tabla.map(row => [...row]),
      etiquetasBase: [...etiquetasBase]
    })

    let iteracion = 1

    // Algoritmo Simplex estándar (buscar máximo)
    while (true) {
      // Buscar columna entrante (valor más negativo en fila Z para maximización)
      let columnaEntrante = -1
      let valorMasNegativo = 0
      for (let j = 0; j < nVarDuales + mRestDuales; j++) {
        if (tabla[mRestDuales][j] < valorMasNegativo) {
          valorMasNegativo = tabla[mRestDuales][j]
          columnaEntrante = j
        }
      }

      // Condición de parada: no hay valores negativos en fila Z
      if (columnaEntrante === -1) {
        console.log('Algoritmo dual terminado: solución óptima encontrada')
        break
      }

      console.log(`Iteración ${iteracion}: Columna entrante Y${columnaEntrante + 1} con valor ${valorMasNegativo}`)

      // Encontrar fila saliente (test de la razón)
      let filaSalida = -1
      let minCociente = Infinity
      for (let i = 0; i < mRestDuales; i++) {
        if (tabla[i][columnaEntrante] > 0) {
          const cociente = tabla[i][nVarDuales + mRestDuales] / tabla[i][columnaEntrante]
          if (cociente < minCociente) {
            minCociente = cociente
            filaSalida = i
          }
        }
      }

      if (filaSalida === -1) {
        console.log('Problema dual ilimitado')
        setSolution({ tipo: 'ilimitada' })
        setIterations(iteracionesTemp)
        setIsCalculating(false)
        return
      }

      console.log(`Fila saliente: ${etiquetasBase[filaSalida]} con razón ${minCociente}`)

      // Actualizar etiqueta base
      const variableSaliente = etiquetasBase[filaSalida]
      etiquetasBase[filaSalida] = `Y${columnaEntrante + 1}`

      // Operaciones de pivoteo
      const pivote = tabla[filaSalida][columnaEntrante]
      console.log(`Elemento pivote: ${pivote}`)

      // Normalizar fila pivote
      for (let j = 0; j <= nVarDuales + mRestDuales; j++) {
        tabla[filaSalida][j] /= pivote
      }

      // Hacer ceros en la columna pivote
      for (let i = 0; i <= mRestDuales; i++) {
        if (i !== filaSalida) {
          const factor = tabla[i][columnaEntrante]
          for (let j = 0; j <= nVarDuales + mRestDuales; j++) {
            tabla[i][j] -= factor * tabla[filaSalida][j]
          }
        }
      }

      // Guardar iteración
      iteracionesTemp.push({
        numero: iteracion,
        titulo: `Iteración ${iteracion}`,
        tabla: tabla.map(row => [...row]),
        etiquetasBase: [...etiquetasBase],
        variableEntrante: `Y${columnaEntrante + 1}`,
        variableSaliente: variableSaliente
      })

      iteracion++

      // Prevenir bucles infinitos
      if (iteracion > 50) {
        console.log('Máximo de iteraciones alcanzado')
        break
      }
    }

    // Extraer solución del problema dual
    const solucionDual = new Array(nVarDuales + mRestDuales).fill(0)
    
    for (let i = 0; i < mRestDuales; i++) {
      const etiqueta = etiquetasBase[i]
      if (etiqueta.startsWith('Y')) {
        const indice = parseInt(etiqueta.substring(1)) - 1
        if (indice >= 0 && indice < solucionDual.length) {
          solucionDual[indice] = tabla[i][nVarDuales + mRestDuales]
        }
      }
    }

    // Calcular valor óptimo del dual
    let valorZDual = tabla[mRestDuales][nVarDuales + mRestDuales]
    
    // Ajustar signo según el tipo de problema
    if (tipoDual === 'min') {
      valorZDual = -valorZDual  // Convertir de vuelta porque usamos forma de maximización
    }

    console.log('=== SOLUCIÓN DUAL ===')
    console.log('Solución dual:', solucionDual)
    console.log('Valor Z dual (antes de ajuste):', tabla[mRestDuales][nVarDuales + mRestDuales])
    console.log('Valor Z dual (final):', valorZDual)

    // Por el teorema de dualidad fuerte: Z_primal = Z_dual
    // Pero como estamos resolviendo el dual, el valor que obtenemos es para el dual
    // El valor del primal original es el mismo (en valor absoluto, ajustando signos)
    let valorZPrimal = valorZDual
    
    // Si el problema original era de maximización y obtuvimos el dual (minimización)
    // el valor óptimo es el mismo
    if (tipoZ === 'max' && tipoDual === 'min') {
      valorZPrimal = Math.abs(valorZDual)
    } else if (tipoZ === 'min' && tipoDual === 'max') {
      valorZPrimal = Math.abs(valorZDual)
    }

    console.log('Valor Z primal (resultado final):', valorZPrimal)

    // Preparar variables para mostrar (solo las principales del dual)
    const variablesDuales = {}
    for (let i = 0; i < nVarDuales; i++) {
      variablesDuales[`y${i + 1}`] = solucionDual[i] || 0
    }

    setSolution({
      tipo: 'optima',
      valorZ: valorZPrimal,
      variables: variablesDuales,
      iteraciones: iteracion - 1
    })
    setIterations(iteracionesTemp)
    setIsCalculating(false)
  }

  return (
    <motion.div 
      className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
    >
      <h3 className="text-2xl font-bold text-white mb-6">🔧 Calculadora Simplex Dual</h3>
      
      {problemData ? (
        <div>
          {/* Información del problema */}
          <div className="bg-white/10 rounded-lg p-6 mb-6">
            <p className="text-gray-300 text-lg mb-4">📊 Datos del problema configurados</p>
            <div className="grid grid-cols-2 gap-4 text-white">
              <p>Variables: {problemData.numVariables}</p>
              <p>Restricciones: {problemData.numRestricciones}</p>
              <p>Tipo: {problemData.tipoZ === 'max' ? 'Maximizar' : 'Minimizar'}</p>
            </div>
          </div>

          {/* Botón resolver */}
          <motion.button
            onClick={resolverSimplexDual}
            disabled={isCalculating}
            className="w-full mb-6 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-lg transition-all duration-300 disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isCalculating ? '🔄 Calculando...' : '🚀 Resolver con Simplex Dual'}
          </motion.button>

          {/* Resultados */}
          {solution && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Solución final */}
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6">
                <h4 className="text-xl font-bold text-green-400 mb-4">
                  {solution.tipo === 'optima' ? '✅ Solución Óptima' : '⚠️ Solución Ilimitada'}
                </h4>
                {solution.tipo === 'optima' && (
                  <div className="text-white space-y-2">
                    <p className="text-2xl font-bold">Z = {solution.valorZ.toFixed(2)}</p>
                    <p>Iteraciones: {solution.iteraciones}</p>
                    <div className="mt-4">
                      <p className="font-semibold mb-2">Variables:</p>
                      {Object.entries(solution.variables).map(([variable, valor]) => (
                        <p key={variable} className="ml-4">
                          {variable} = {valor.toFixed(2)}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Iteraciones */}
              <div className="space-y-4">
                <h4 className="text-xl font-bold text-white">📊 Iteraciones del Algoritmo Dual</h4>
                {iterations.map((iter, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/5 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h5 className="text-lg font-semibold text-purple-400">
                        {iter.titulo}
                      </h5>
                      {iter.variableEntrante && (
                        <div className="text-sm text-gray-300">
                          <span className="text-green-400">Entrante:</span> {iter.variableEntrante} | 
                          <span className="text-red-400"> Saliente:</span> {iter.variableSaliente}
                        </div>
                      )}
                    </div>
                    {generateTableHTML(iter.tabla, iter.etiquetasBase)}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      ) : (
        <div className="bg-white/10 rounded-lg p-8 text-center">
          <div className="text-4xl mb-4">📝</div>
          <p className="text-gray-300 text-lg">Configure el problema en la tabla superior</p>
        </div>
      )}
    </motion.div>
  )
}

export default DualSolver
