import { useState } from 'react'
import { motion } from 'framer-motion'

const SimplexSolver = ({ problemData }) => {
  const [solution, setSolution] = useState(null)
  const [iterations, setIterations] = useState([])
  const [isCalculating, setIsCalculating] = useState(false)

  const generateTableHTML = (data) => {
    return (
      <div className="overflow-x-auto mb-6">
        <table className="w-full border border-white/20 rounded-lg overflow-hidden">
          <tbody>
            {data.map((row, i) => (
              <tr key={i} className={i === 0 ? 'bg-blue-500/20' : i === data.length - 1 ? 'bg-purple-500/20' : 'bg-white/5'}>
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

  const resolverSimplex = () => {
    if (!problemData) return

    setIsCalculating(true)
    const { numVariables, numRestricciones, tipoZ, zCoeffs, restricciones } = problemData

    // Construir tableau inicial
    const tableau = []
    const iteracionesTemp = []

    // Header
    const header = ['Base']
    for (let i = 0; i < numVariables; i++) header.push(`x${i + 1}`)
    for (let i = 0; i < numRestricciones; i++) header.push(`s${i + 1}`)
    header.push('Sol')
    tableau.push(header)

    // Restricciones con variables de holgura
    for (let i = 0; i < numRestricciones; i++) {
      const fila = [`s${i + 1}`]
      // Coeficientes de variables
      for (let j = 0; j < numVariables; j++) {
        fila.push(restricciones[i].coeficientes[j] || 0)
      }
      // Variables de holgura
      for (let j = 0; j < numRestricciones; j++) {
        fila.push(i === j ? 1 : 0)
      }
      // Lado derecho
      fila.push(restricciones[i].resultado || 0)
      tableau.push(fila)
    }

    // Fila Z
    const zRow = ['Z']
    for (let i = 0; i < numVariables; i++) {
      const coef = zCoeffs[i] || 0
      zRow.push(tipoZ === 'min' ? coef : -coef)
    }
    for (let i = 0; i < numRestricciones; i++) zRow.push(0)
    zRow.push(0)
    tableau.push(zRow)

    let iteration = 0
    iteracionesTemp.push({
      numero: iteration,
      tableau: tableau.map(row => [...row])
    })

    // Algoritmo Simplex
    while (true) {
      iteration++
      
      // Encontrar columna pivote (más negativo en fila Z)
      const zData = tableau[tableau.length - 1].slice(1, -1)
      const pivotCol = zData.reduce((minIdx, val, idx) => val < zData[minIdx] ? idx : minIdx, 0)

      // Condición de parada: todos los valores en fila Z son >= 0
      if (zData[pivotCol] >= 0) break

      // Encontrar fila pivote (menor ratio positivo)
      let pivotRow = -1
      let minRatio = Infinity
      for (let i = 1; i < tableau.length - 1; i++) {
        const row = tableau[i]
        const rhs = row[row.length - 1]
        const pivotVal = row[pivotCol + 1]
        if (pivotVal > 0) {
          const ratio = rhs / pivotVal
          if (ratio < minRatio) {
            minRatio = ratio
            pivotRow = i
          }
        }
      }

      // Verificar si hay solución ilimitada
      if (pivotRow === -1) {
        setSolution({ tipo: 'ilimitada' })
        setIterations(iteracionesTemp)
        setIsCalculating(false)
        return
      }

      // Normalizar fila pivote
      const pivotElement = tableau[pivotRow][pivotCol + 1]
      for (let j = 1; j < tableau[0].length; j++) {
        tableau[pivotRow][j] /= pivotElement
      }

      // Hacer ceros en la columna pivote
      for (let i = 1; i < tableau.length; i++) {
        if (i === pivotRow) continue
        const factor = tableau[i][pivotCol + 1]
        for (let j = 1; j < tableau[0].length; j++) {
          tableau[i][j] -= factor * tableau[pivotRow][j]
        }
      }

      // Actualizar variable básica
      tableau[pivotRow][0] = tableau[0][pivotCol + 1]

      // Guardar iteración
      iteracionesTemp.push({
        numero: iteration,
        tableau: tableau.map(row => [...row]),
        pivotRow: pivotRow,
        pivotCol: pivotCol + 1
      })
    }

    // Extraer solución final
    const valorZ = tableau[tableau.length - 1][tableau[0].length - 1]
    const variables = {}
    
    // Encontrar valores de variables básicas
    for (let i = 1; i < tableau.length - 1; i++) {
      const baseVar = tableau[i][0]
      const valor = tableau[i][tableau[0].length - 1]
      variables[baseVar] = valor
    }

    setSolution({
      tipo: 'optima',
      valorZ: valorZ,
      variables: variables,
      iteraciones: iteration
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
      <h3 className="text-2xl font-bold text-white mb-6">🔧 Calculadora Simplex</h3>
      
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
            onClick={resolverSimplex}
            disabled={isCalculating}
            className="w-full mb-6 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold rounded-lg transition-all duration-300 disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isCalculating ? '🔄 Calculando...' : '🚀 Resolver con Simplex'}
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
                <h4 className="text-xl font-bold text-white">📊 Iteraciones del Algoritmo</h4>
                {iterations.map((iter, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/5 rounded-lg p-4"
                  >
                    <h5 className="text-lg font-semibold text-blue-400 mb-3">
                      {iter.numero === 0 ? 'Tabla Inicial' : `Iteración ${iter.numero}`}
                    </h5>
                    {generateTableHTML(iter.tableau)}
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

export default SimplexSolver
