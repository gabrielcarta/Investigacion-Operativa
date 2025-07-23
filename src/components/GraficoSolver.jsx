import { useState, useEffect, useMemo, useCallback, memo } from 'react'
import { motion } from 'framer-motion'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Scatter } from 'react-chartjs-2'

// Registrar componentes de Chart.js solo una vez
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const GraficoSolver = memo(({ problemData, onSolutionChange }) => {
  const [solutionData, setSolutionData] = useState(null)
  const [isCalculating, setIsCalculating] = useState(false)

  // Memoizar la función de generación de datos del gráfico
  const generateChartData = useCallback((solutionData) => {
    if (!solutionData || solutionData.error || !solutionData.feasibleVertices.length) {
      return null
    }

    const { constraintsData, feasibleVertices, optimalSolution } = solutionData
    const datasets = []

    // Calcular escala del gráfico
    let maxCoordX = 10
    let maxCoordY = 10

    const allPointsForScale = [...feasibleVertices]
    if (optimalSolution) {
      allPointsForScale.push(optimalSolution)
    }

    if (allPointsForScale.length > 0) {
      maxCoordX = Math.max(...allPointsForScale.map(p => Math.abs(p.x1)), 10) * 1.2
      maxCoordY = Math.max(...allPointsForScale.map(p => Math.abs(p.x2)), 10) * 1.2
    }

    constraintsData.forEach(c => {
      if (c.b === 0 && c.a !== 0) {
        maxCoordX = Math.max(maxCoordX, Math.abs(c.val / c.a) * 1.2)
      }
      if (c.a === 0 && c.b !== 0) {
        maxCoordY = Math.max(maxCoordY, Math.abs(c.val / c.b) * 1.2)
      }
      if (c.a !== 0) maxCoordX = Math.max(maxCoordX, Math.abs(c.val / c.a) * 1.2)
      if (c.b !== 0) maxCoordY = Math.max(maxCoordY, Math.abs(c.val / c.b) * 1.2)
    })

    maxCoordX = Math.max(maxCoordX, 1)
    maxCoordY = Math.max(maxCoordY, 1)

    // 1. Líneas de restricción
    constraintsData.forEach((constraint, index) => {
      const { a, b, val } = constraint
      const lineData = []

      if (Math.abs(b) > 1e-9) {
        // x2 = (val - a*x1) / b
        lineData.push({ x: 0, y: val / b })
        lineData.push({ x: maxCoordX, y: (val - a * maxCoordX) / b })
      } else if (Math.abs(a) > 1e-9) {
        // Línea vertical x1 = val / a
        const xVal = val / a
        lineData.push({ x: xVal, y: 0 })
        lineData.push({ x: xVal, y: maxCoordY })
      } else {
        return
      }

      const filteredLineData = lineData.filter(p => 
        isFinite(p.x) && isFinite(p.y) && 
        Math.abs(p.x) < maxCoordX * 5 && 
        Math.abs(p.y) < maxCoordY * 5
      )

      if (filteredLineData.length >= 2) {
        datasets.push({
          label: `Restricción ${index + 1}: ${constraint.id}`,
          data: filteredLineData,
          borderColor: `hsl(${(index * 60) % 360}, 70%, 50%)`,
          backgroundColor: `hsla(${(index * 60) % 360}, 70%, 50%, 0.1)`,
          borderWidth: 2,
          fill: false,
          tension: 0,
          pointRadius: 4,
          pointBackgroundColor: `hsl(${(index * 60) % 360}, 70%, 50%)`,
          showLine: true
        })
      }
    })

    // 2. Región factible
    if (feasibleVertices.length >= 3) {
      datasets.push({
        label: 'Región Factible',
        data: [...feasibleVertices.map(p => ({ x: p.x1, y: p.x2 })), { x: feasibleVertices[0].x1, y: feasibleVertices[0].x2 }],
        backgroundColor: 'rgba(75, 192, 192, 0.3)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 2,
        fill: true,
        tension: 0,
        pointRadius: 0,
        showLine: true
      })
    }

    // 3. Vértices factibles
    if (feasibleVertices.length > 0) {
      datasets.push({
        label: 'Vértices Factibles',
        data: feasibleVertices.map(p => ({ x: p.x1, y: p.x2 })),
        backgroundColor: 'rgb(54, 162, 235)',
        borderColor: 'rgb(54, 162, 235)',
        pointRadius: 6,
        pointHoverRadius: 8,
        showLine: false
      })
    }

    // 4. Punto óptimo
    if (optimalSolution) {
      datasets.push({
        label: 'Solución Óptima',
        data: [{ x: optimalSolution.x1, y: optimalSolution.x2 }],
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
        pointRadius: 10,
        pointHoverRadius: 12,
        pointStyle: 'rectRot',
        showLine: false
      })
    }

    return {
      datasets,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: 'linear',
            position: 'bottom',
            title: {
              display: true,
              text: 'X₁',
              color: '#ffffff',
              font: { size: 14 }
            },
            min: 0,
            max: maxCoordX,
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: '#ffffff'
            }
          },
          y: {
            type: 'linear',
            title: {
              display: true,
              text: 'X₂',
              color: '#ffffff',
              font: { size: 14 }
            },
            min: 0,
            max: maxCoordY,
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: '#ffffff'
            }
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              color: '#ffffff',
              font: { size: 12 }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || ''
                if (label) {
                  label += ': '
                }
                if (context.parsed.y !== null) {
                  label += `(X₁: ${context.parsed.x.toFixed(2)}, X₂: ${context.parsed.y.toFixed(2)})`
                }
                return label
              }
            }
          }
        }
      }
    }
  }, [])

  // Memoizar el algoritmo de resolución
  const resolverGrafico = useCallback(() => {
    if (!problemData || problemData.numVariables !== 2) {
      const errorResult = {
        error: "El método gráfico solo está disponible para problemas con exactamente 2 variables.",
        feasibleVertices: [],
        optimalSolution: null
      }
      setSolutionData(errorResult)
      onSolutionChange?.(errorResult)
      return
    }

    setIsCalculating(true)

    // Usar setTimeout para no bloquear el UI
    setTimeout(() => {
      try {
        const { zCoeffs, tipoZ, restricciones } = problemData
        const objCoeffs = [zCoeffs[0] || 0, zCoeffs[1] || 0]

        // Convertir restricciones al formato esperado
        const constraintsData = restricciones.map((r, index) => ({
          a: r.coeficientes[0] || 0,
          b: r.coeficientes[1] || 0,
          rel: r.relacion,
          val: r.resultado || 0,
          id: `R${index + 1}`
        }))

        // Crear líneas para intersecciones
        const lines = []
        constraintsData.forEach(c => {
          lines.push({ a: c.a, b: c.b, val: c.val, id: c.id, originalConstraint: true })
        })
        lines.push({ a: 1, b: 0, val: 0, id: 'X₁=0 (Eje X₂)', originalConstraint: false })
        lines.push({ a: 0, b: 1, val: 0, id: 'X₂=0 (Eje X₁)', originalConstraint: false })

        // Encontrar puntos de intersección
        const intersectionPoints = []
        for (let i = 0; i < lines.length; i++) {
          for (let j = i + 1; j < lines.length; j++) {
            const l1 = lines[i]
            const l2 = lines[j]
            const determinant = l1.a * l2.b - l2.a * l1.b

            if (Math.abs(determinant) > 1e-9) {
              const x1 = (l1.val * l2.b - l2.val * l1.b) / determinant
              const x2 = (l1.a * l2.val - l2.a * l1.val) / determinant
              const roundedX1 = parseFloat(x1.toFixed(5))
              const roundedX2 = parseFloat(x2.toFixed(5))
              intersectionPoints.push({ 
                x1: roundedX1, 
                x2: roundedX2, 
                fromLines: [l1.id, l2.id] 
              })
            }
          }
        }

        // Filtrar vértices factibles
        const feasibleVertices = []
        const tolerance = 1e-9

        intersectionPoints.forEach(pt => {
          if (pt.x1 < -tolerance || pt.x2 < -tolerance) {
            return
          }

          let isFeasibleForAll = true
          for (const constraint of constraintsData) {
            const sum = constraint.a * pt.x1 + constraint.b * pt.x2
            let constraintSatisfied = false
            if (constraint.rel === '<=') {
              constraintSatisfied = sum <= constraint.val + tolerance
            } else if (constraint.rel === '>=') {
              constraintSatisfied = sum >= constraint.val - tolerance
            } else if (constraint.rel === '=') {
              constraintSatisfied = Math.abs(sum - constraint.val) < tolerance
            }
            
            if (!constraintSatisfied) {
              isFeasibleForAll = false
              break
            }
          }

          if (isFeasibleForAll) {
            if (!feasibleVertices.some(v => Math.abs(v.x1 - pt.x1) < 1e-5 && Math.abs(v.x2 - pt.x2) < 1e-5)) {
              feasibleVertices.push({ x1: pt.x1, x2: pt.x2 })
            }
          }
        })

        // Verificar origen
        let originFeasible = true
        for (const constraint of constraintsData) {
          const sum = 0
          let constraintSatisfied = false
          if (constraint.rel === '<=') { constraintSatisfied = sum <= constraint.val + tolerance }
          else if (constraint.rel === '>=') { constraintSatisfied = sum >= constraint.val - tolerance }
          else if (constraint.rel === '=') { constraintSatisfied = Math.abs(sum - constraint.val) < tolerance }
          if (!constraintSatisfied) {
            originFeasible = false
            break
          }
        }
        if (originFeasible) {
          if (!feasibleVertices.some(v => Math.abs(v.x1 - 0) < 1e-5 && Math.abs(v.x2 - 0) < 1e-5)) {
            feasibleVertices.push({ x1: 0, x2: 0 })
          }
        }

        // Ordenar vértices para formar polígono
        if (feasibleVertices.length >= 3) {
          let centerX = 0
          let centerY = 0
          feasibleVertices.forEach(v => {
            centerX += v.x1
            centerY += v.x2
          })
          centerX /= feasibleVertices.length
          centerY /= feasibleVertices.length

          feasibleVertices.sort((a, b) => {
            const angleA = Math.atan2(a.x2 - centerY, a.x1 - centerX)
            const angleB = Math.atan2(b.x2 - centerY, b.x1 - centerX)
            return angleA - angleB
          })
        }

        // Encontrar solución óptima
        let optimalSolution = null
        let optimalZ = (tipoZ === 'max') ? -Infinity : Infinity

        if (feasibleVertices.length === 0 && !originFeasible) {
          const errorResult = {
            error: "No se encontraron vértices factibles. El problema puede no tener solución.",
            feasibleVertices: [],
            optimalSolution: null
          }
          setSolutionData(errorResult)
          onSolutionChange?.(errorResult)
          setIsCalculating(false)
          return
        }

        if (feasibleVertices.length === 0 && originFeasible) {
          feasibleVertices.push({x1: 0, x2: 0})
        }

        feasibleVertices.forEach(vertex => {
          const zValue = objCoeffs[0] * vertex.x1 + objCoeffs[1] * vertex.x2
          const currentOptimalZRounded = parseFloat(optimalZ.toFixed(5))
          const currentZValueRounded = parseFloat(zValue.toFixed(5))

          if (tipoZ === 'max') {
            if (currentZValueRounded > currentOptimalZRounded) {
              optimalZ = zValue
              optimalSolution = vertex
            } else if (currentZValueRounded === currentOptimalZRounded) {
              if (!optimalSolution) optimalSolution = vertex
            }
          } else {
            if (currentZValueRounded < currentOptimalZRounded) {
              optimalZ = zValue
              optimalSolution = vertex
            } else if (currentZValueRounded === currentOptimalZRounded) {
              if (!optimalSolution) optimalSolution = vertex
            }
          }
        })

        if (!optimalSolution && feasibleVertices.length > 0) {
          optimalSolution = feasibleVertices[0]
          optimalZ = objCoeffs[0] * optimalSolution.x1 + objCoeffs[1] * optimalSolution.x2
        }

        // Calcular evaluaciones de vértices
        const vertexEvaluations = feasibleVertices.map(v => ({
          x1: v.x1,
          x2: v.x2,
          zValue: objCoeffs[0] * v.x1 + objCoeffs[1] * v.x2
        }))

        const result = {
          error: null,
          feasibleVertices,
          optimalSolution,
          optimalZ,
          vertexEvaluations,
          constraintsData,
          objCoeffs,
          tipoZ
        }

        setSolutionData(result)
        onSolutionChange?.(result)

      } catch (error) {
        const errorResult = {
          error: `Error al resolver: ${error.message}`,
          feasibleVertices: [],
          optimalSolution: null
        }
        setSolutionData(errorResult)
        onSolutionChange?.(errorResult)
      } finally {
        setIsCalculating(false)
      }
    }, 100)
  }, [problemData, onSolutionChange])

  useEffect(() => {
    if (problemData) {
      resolverGrafico()
    }
  }, [problemData, resolverGrafico])

  // Memoizar el componente del gráfico
  const chartComponent = useMemo(() => {
    if (!solutionData?.optimalSolution) return null
    
    const chartData = generateChartData(solutionData)
    if (!chartData) return null

    return (
      <div className="bg-white/5 rounded-lg p-4" style={{ height: '400px' }}>
        <Scatter data={chartData} options={chartData.options} />
      </div>
    )
  }, [solutionData, generateChartData])

  if (!problemData) {
    return (
      <motion.div 
        className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="text-4xl mb-4">📊</div>
        <p className="text-gray-300">Configure el problema en la tabla superior para ver la solución gráfica</p>
      </motion.div>
    )
  }

  return (
    <motion.div 
      className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
    >
      <h3 className="text-2xl font-bold text-white mb-6">📈 Solución Gráfica</h3>
      
      {isCalculating ? (
        <div className="text-center py-8">
          <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-300">Calculando solución...</p>
        </div>
      ) : solutionData?.error ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-4">
          <p className="text-red-300">{solutionData.error}</p>
        </div>
      ) : solutionData?.optimalSolution ? (
        <div className="space-y-6">
          {/* Gráfico visual */}
          <div className="bg-white/10 rounded-xl p-4">
            <h4 className="text-lg font-bold text-white mb-4">📊 Gráfico del Problema</h4>
            {chartComponent}
          </div>

          {/* Solución óptima */}
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <h4 className="text-lg font-bold text-white mb-3">🎯 Solución Óptima</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-gray-300 text-sm">X₁</p>
                <p className="text-white text-xl font-bold">{solutionData.optimalSolution.x1.toFixed(3)}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-300 text-sm">X₂</p>
                <p className="text-white text-xl font-bold">{solutionData.optimalSolution.x2.toFixed(3)}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-300 text-sm">Valor Óptimo Z</p>
                <p className="text-green-400 text-xl font-bold">{solutionData.optimalZ.toFixed(3)}</p>
              </div>
            </div>
          </div>

          {/* Evaluación de vértices */}
          <div>
            <h4 className="text-lg font-bold text-white mb-3">📋 Evaluación de Vértices Factibles</h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-white/20">
                <thead>
                  <tr className="bg-white/10">
                    <th className="border border-white/20 px-3 py-2 text-white text-sm">X₁</th>
                    <th className="border border-white/20 px-3 py-2 text-white text-sm">X₂</th>
                    <th className="border border-white/20 px-3 py-2 text-white text-sm">Valor de Z</th>
                    <th className="border border-white/20 px-3 py-2 text-white text-sm">¿Óptimo?</th>
                  </tr>
                </thead>
                <tbody>
                  {solutionData.vertexEvaluations.map((vertex, index) => {
                    const isOptimal = Math.abs(vertex.zValue - solutionData.optimalZ) < 1e-5
                    return (
                      <tr key={index} className={`${isOptimal ? 'bg-green-500/20' : 'hover:bg-white/5'}`}>
                        <td className="border border-white/20 px-3 py-2 text-white text-sm text-center">
                          {vertex.x1.toFixed(3)}
                        </td>
                        <td className="border border-white/20 px-3 py-2 text-white text-sm text-center">
                          {vertex.x2.toFixed(3)}
                        </td>
                        <td className="border border-white/20 px-3 py-2 text-white text-sm text-center">
                          {vertex.zValue.toFixed(3)}
                        </td>
                        <td className="border border-white/20 px-3 py-2 text-center">
                          {isOptimal ? (
                            <span className="text-green-400 font-bold">✓ SÍ</span>
                          ) : (
                            <span className="text-gray-400">No</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : null}
    </motion.div>
  )
})

GraficoSolver.displayName = 'GraficoSolver'

export default GraficoSolver
