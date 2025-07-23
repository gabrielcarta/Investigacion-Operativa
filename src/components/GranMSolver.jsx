import { useState } from 'react'
import { motion } from 'framer-motion'

const GranMSolver = ({ problemData }) => {
  const [solution, setSolution] = useState(null)
  const [iterations, setIterations] = useState([])
  const [isCalculating, setIsCalculating] = useState(false)

  const generateTableHTML = (data) => {
    return (
      <div className="overflow-x-auto mb-6">
        <table className="w-full border border-white/20 rounded-lg overflow-hidden">
          <tbody>
            {data.map((row, i) => (
              <tr key={i} className={i === 0 ? 'bg-orange-500/20' : i === data.length - 1 ? 'bg-red-500/20' : 'bg-white/5'}>
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

  const resolverGranM = () => {
    if (!problemData) return

    setIsCalculating(true)
    const { numVariables, numRestricciones, tipoZ, zCoeffs, restricciones } = problemData
    
    const M = 1000000 // Valor grande para M
    let tableau = []
    const iteracionesTemp = []
    
    try {
      // Paso 1: Determinar el número de variables de cada tipo
      let numSlack = 0
      let numSurplus = 0
      let numArtificial = 0
      
      restricciones.forEach(rest => {
        if (rest.relacion === '<=') {
          numSlack++
        } else if (rest.relacion === '>=') {
          numSurplus++
          numArtificial++
        } else if (rest.relacion === '=') {
          numArtificial++
        }
      })

      // Paso 2: Crear el tableau inicial
      const numCols = 1 + numVariables + numSlack + numSurplus + numArtificial + 1
      
      // Header
      const header = ['Base']
      for (let i = 0; i < numVariables; i++) header.push(`x${i + 1}`)
      for (let i = 0; i < numSlack; i++) header.push(`s${i + 1}`)
      for (let i = 0; i < numSurplus; i++) header.push(`e${i + 1}`)
      for (let i = 0; i < numArtificial; i++) header.push(`A${i + 1}`)
      header.push('Sol')
      
      tableau.push(header)

      // Variables base
      const baseVariables = []
      let slackIdx = 0
      let surplusIdx = 0
      let artificialIdx = 0

      // Crear filas de restricciones
      for (let i = 0; i < numRestricciones; i++) {
        const rest = restricciones[i]
        const fila = new Array(numCols).fill(0)
        
        // Variables originales
        for (let j = 0; j < numVariables; j++) {
          fila[1 + j] = rest.coeficientes[j] || 0
        }
        
        if (rest.relacion === '<=') {
          // Agregar variable de holgura
          fila[1 + numVariables + slackIdx] = 1
          fila[0] = `s${slackIdx + 1}`
          baseVariables.push(`s${slackIdx + 1}`)
          slackIdx++
        } else if (rest.relacion === '>=') {
          // Agregar variable de exceso y artificial
          fila[1 + numVariables + numSlack + surplusIdx] = -1
          fila[1 + numVariables + numSlack + numSurplus + artificialIdx] = 1
          fila[0] = `A${artificialIdx + 1}`
          baseVariables.push(`A${artificialIdx + 1}`)
          surplusIdx++
          artificialIdx++
        } else if (rest.relacion === '=') {
          // Agregar solo variable artificial
          fila[1 + numVariables + numSlack + numSurplus + artificialIdx] = 1
          fila[0] = `A${artificialIdx + 1}`
          baseVariables.push(`A${artificialIdx + 1}`)
          artificialIdx++
        }
        
        // RHS
        fila[fila.length - 1] = rest.resultado || 0
        tableau.push(fila)
      }

      // Paso 3: Crear fila Z
      const zRow = new Array(numCols).fill(0)
      zRow[0] = 'Z'
      
      // Coeficientes originales
      for (let i = 0; i < numVariables; i++) {
        zRow[1 + i] = (tipoZ === 'max' ? -(zCoeffs[i] || 0) : (zCoeffs[i] || 0))
      }
      
      // Penalizar variables artificiales
      for (let i = 0; i < numArtificial; i++) {
        const colIdx = 1 + numVariables + numSlack + numSurplus + i
        zRow[colIdx] = (tipoZ === 'max' ? -M : M)
      }
      
      // Ajustar por variables artificiales en la base
      for (let i = 0; i < baseVariables.length; i++) {
        if (baseVariables[i].startsWith('A')) {
          const artificialNum = parseInt(baseVariables[i].substring(1)) - 1
          const multiplier = (tipoZ === 'max' ? M : -M)
          
          // Restar M veces la fila de la restricción de la fila Z
          for (let j = 1; j < tableau[i + 1].length - 1; j++) {
            zRow[j] -= multiplier * tableau[i + 1][j]
          }
          zRow[zRow.length - 1] -= multiplier * tableau[i + 1][tableau[i + 1].length - 1]
        }
      }
      
      tableau.push(zRow)

      let iteration = 0
      iteracionesTemp.push({
        numero: iteration,
        tableau: tableau.map(row => [...row]),
        baseVariables: [...baseVariables]
      })

      // Algoritmo Simplex
      while (iteration < 20) {
        iteration++
        
        // Encontrar columna pivote (más negativo en fila Z)
        const zData = tableau[tableau.length - 1]
        let pivotCol = -1
        let mostNegative = 0
        
        for (let i = 1; i < zData.length - 1; i++) {
          if (zData[i] < mostNegative) {
            mostNegative = zData[i]
            pivotCol = i
          }
        }

        // Condición de parada
        if (pivotCol === -1 || mostNegative >= -0.0001) break

        // Encontrar fila pivote
        let pivotRow = -1
        let minRatio = Infinity
        
        for (let i = 1; i < tableau.length - 1; i++) {
          const pivotVal = tableau[i][pivotCol]
          const rhs = tableau[i][tableau[i].length - 1]
          
          if (pivotVal > 0.0001) {
            const ratio = rhs / pivotVal
            if (ratio >= 0 && ratio < minRatio) {
              minRatio = ratio
              pivotRow = i
            }
          }
        }

        if (pivotRow === -1) break // No hay solución acotada

        // Pivoteo
        const pivotElement = tableau[pivotRow][pivotCol]
        
        // Normalizar fila pivote
        for (let j = 1; j < tableau[pivotRow].length; j++) {
          tableau[pivotRow][j] /= pivotElement
        }
        
        // Actualizar variable base
        baseVariables[pivotRow - 1] = header[pivotCol]
        tableau[pivotRow][0] = header[pivotCol]

        // Eliminar en otras filas
        for (let i = 1; i < tableau.length; i++) {
          if (i === pivotRow) continue
          
          const factor = tableau[i][pivotCol]
          for (let j = 1; j < tableau[i].length; j++) {
            tableau[i][j] -= factor * tableau[pivotRow][j]
          }
        }

        iteracionesTemp.push({
          numero: iteration,
          tableau: tableau.map(row => [...row]),
          baseVariables: [...baseVariables],
          pivotRow: pivotRow - 1,
          pivotCol: pivotCol - 1
        })
      }

      // Analizar solución
      const finalSolution = {}
      const zValue = tableau[tableau.length - 1][tableau[tableau.length - 1].length - 1]
      
      // Verificar variables artificiales
      let hasArtificialVars = false
      const artificialVarsInfo = []
      
      for (let i = 0; i < baseVariables.length; i++) {
        if (baseVariables[i].startsWith('A')) {
          const value = tableau[i + 1][tableau[i + 1].length - 1]
          artificialVarsInfo.push(`${baseVariables[i]} = ${value.toFixed(6)}`)
          if (Math.abs(value) > 0.0001) {
            hasArtificialVars = true
          }
        }
      }

      if (hasArtificialVars) {
        finalSolution.status = 'No tiene solución factible'
        finalSolution.message = 'Las variables artificiales no se pudieron eliminar de la base'
        finalSolution.debugInfo = `Variables artificiales: ${artificialVarsInfo.join(', ')}`
      } else {
        finalSolution.status = 'Solución óptima encontrada'
        finalSolution.variables = {}
        
        // Inicializar variables
        for (let i = 0; i < numVariables; i++) {
          finalSolution.variables[`x${i + 1}`] = 0
        }
        
        // Asignar valores de la base
        for (let i = 0; i < baseVariables.length; i++) {
          const varName = baseVariables[i]
          if (varName.startsWith('x')) {
            finalSolution.variables[varName] = tableau[i + 1][tableau[i + 1].length - 1]
          }
        }
        
        finalSolution.valorZ = tipoZ === 'max' ? -zValue : zValue
      }

      setIterations(iteracionesTemp)
      setSolution(finalSolution)
      
    } catch (error) {
      setSolution({
        status: 'Error en el cálculo',
        message: `Error: ${error.message}`
      })
    }
    
    setIsCalculating(false)
  }

  return (
    <motion.div 
      className="w-full space-y-6"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
    >
      {problemData && (
        <motion.div 
          className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-2xl p-6 border border-orange-500/20"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-xl font-bold text-white mb-4">🔺 Resolver con Método Gran M</h3>
          
          <div className="mb-4 p-4 bg-black/20 rounded-lg">
            <h4 className="text-orange-400 font-semibold mb-2">Problema formulado:</h4>
            <p className="text-white">
              {problemData.tipoZ === 'max' ? 'Maximizar' : 'Minimizar'}: Z = {' '}
              {problemData.zCoeffs.map((coef, i) => 
                `${i > 0 ? (coef >= 0 ? ' + ' : ' - ') : ''}${Math.abs(coef)}x${i + 1}`
              ).join('')}
            </p>
            <div className="mt-2">
              <span className="text-gray-300">Sujeto a:</span>
              {problemData.restricciones.map((rest, i) => (
                <div key={i} className="ml-4 text-white">
                  {rest.coeficientes.map((coef, j) => 
                    `${j > 0 ? (coef >= 0 ? ' + ' : ' - ') : ''}${Math.abs(coef)}x${j + 1}`
                  ).join('')} {rest.relacion} {rest.resultado}
                </div>
              ))}
            </div>
          </div>

          <motion.button
            onClick={resolverGranM}
            disabled={isCalculating}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isCalculating ? '🔄 Calculando...' : '🚀 Resolver con Gran M'}
          </motion.button>
        </motion.div>
      )}

      {/* Mostrar solución */}
      {solution && (
        <motion.div 
          className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-2xl font-bold text-white mb-4">📊 Solución Final</h3>
          
          <div className={`p-4 rounded-lg border ${
            solution.status.includes('óptima') 
              ? 'bg-green-500/10 border-green-500/30' 
              : 'bg-red-500/10 border-red-500/30'
          }`}>
            <p className="text-lg font-semibold mb-2 text-white">
              Estado: {solution.status}
            </p>
            
            {solution.variables && (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {Object.entries(solution.variables).map(([variable, value]) => (
                    <div key={variable} className="text-center p-3 bg-white/10 rounded-lg">
                      <div className="text-orange-400 font-bold">{variable}</div>
                      <div className="text-white text-lg">{Number(value).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 p-3 bg-orange-500/20 rounded-lg text-center">
                  <span className="text-orange-300 font-semibold">Valor óptimo Z = </span>
                  <span className="text-white text-xl font-bold">{Number(solution.valorZ).toFixed(2)}</span>
                </div>
              </>
            )}
            
            {solution.message && (
              <p className="text-red-300 mt-2">{solution.message}</p>
            )}
            
            {solution.debugInfo && (
              <p className="text-yellow-300 mt-2 text-sm">{solution.debugInfo}</p>
            )}
          </div>
        </motion.div>
      )}

      {/* Mostrar iteraciones */}
      {iterations.length > 0 && (
        <motion.div 
          className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-2xl font-bold text-white mb-6">📈 Iteraciones del Algoritmo</h3>
          
          <div className="space-y-6">
            {iterations.map((iter, index) => (
              <motion.div 
                key={index}
                className="border border-orange-500/20 rounded-lg p-4 bg-orange-500/5"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-orange-400">
                    {index === 0 ? 'Tableau Inicial' : `Iteración ${iter.numero}`}
                  </h4>
                  {iter.pivotRow !== undefined && (
                    <span className="text-sm text-gray-300">
                      Pivote: Fila {iter.pivotRow + 1}, Columna {iter.pivotCol + 1}
                    </span>
                  )}
                </div>
                
                {generateTableHTML(iter.tableau)}
                
                {iter.baseVariables && (
                  <div className="mt-2 p-2 bg-black/20 rounded text-sm">
                    <span className="text-gray-400">Variables en base: </span>
                    <span className="text-white">{iter.baseVariables.join(', ')}</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default GranMSolver
