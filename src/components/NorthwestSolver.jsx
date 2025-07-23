import { motion } from 'framer-motion'
import { Calculator, Play, RotateCcw, Plus, Minus } from 'lucide-react'
import { useState, useCallback, useMemo, memo } from 'react'

const NorthwestSolver = memo(() => {
  const [sources, setSources] = useState(3)
  const [destinations, setDestinations] = useState(4)
  const [costs, setCosts] = useState(Array(3).fill().map(() => Array(4).fill('')))
  const [supply, setSupply] = useState(Array(3).fill(''))
  const [demand, setDemand] = useState(Array(4).fill(''))
  const [result, setResult] = useState(null)
  const [showResult, setShowResult] = useState(false)

  // Optimizar adjustSize con useCallback profundo
  const adjustSize = useCallback((type, operation) => {
    if (type === 'sources') {
      const newSize = operation === 'add' ? sources + 1 : Math.max(2, sources - 1)
      setSources(newSize)
      if (operation === 'add') {
        setCosts(prev => [...prev, Array(destinations).fill('')])
        setSupply(prev => [...prev, ''])
      } else {
        setCosts(prev => prev.slice(0, -1))
        setSupply(prev => prev.slice(0, -1))
      }
    } else {
      const newSize = operation === 'add' ? destinations + 1 : Math.max(2, destinations - 1)
      setDestinations(newSize)
      if (operation === 'add') {
        setCosts(prev => prev.map(row => [...row, '']))
        setDemand(prev => [...prev, ''])
      } else {
        setCosts(prev => prev.map(row => row.slice(0, -1)))
        setDemand(prev => prev.slice(0, -1))
      }
    }
  }, [sources, destinations])

  // Optimizar updateCosts con verificación de cambios
  const updateCosts = useCallback((i, j, value) => {
    setCosts(prev => {
      if (prev[i][j] === value) return prev
      const newCosts = prev.map((row, rowIndex) => 
        rowIndex === i 
          ? row.map((cell, colIndex) => colIndex === j ? value : cell)
          : row
      )
      return newCosts
    })
  }, [])

  // Optimizar updateSupply
  const updateSupply = useCallback((i, value) => {
    setSupply(prev => {
      if (prev[i] === value) return prev
      const newSupply = [...prev]
      newSupply[i] = value
      return newSupply
    })
  }, [])

  // Optimizar updateDemand
  const updateDemand = useCallback((j, value) => {
    setDemand(prev => {
      if (prev[j] === value) return prev
      const newDemand = [...prev]
      newDemand[j] = value
      return newDemand
    })
  }, [])

  const reset = useCallback(() => {
    setCosts(Array(sources).fill().map(() => Array(destinations).fill('')))
    setSupply(Array(sources).fill(''))
    setDemand(Array(destinations).fill(''))
    setResult(null)
    setShowResult(false)
  }, [sources, destinations])

  // Optimizar el algoritmo pesado con requestAnimationFrame
  const solveNorthwestCorner = useCallback(() => {
    const costMatrix = costs.map(row => row.map(cell => parseFloat(cell) || 0))
    const supplyArray = supply.map(s => parseFloat(s) || 0)
    const demandArray = demand.map(d => parseFloat(d) || 0)

    // Verificar equilibrio
    const totalSupply = supplyArray.reduce((sum, s) => sum + s, 0)
    const totalDemand = demandArray.reduce((sum, d) => sum + d, 0)

    if (totalSupply !== totalDemand) {
      alert('El problema debe estar equilibrado (oferta total = demanda total)')
      return
    }

    // Usar requestAnimationFrame para no bloquear el UI
    requestAnimationFrame(() => {
      const iterations = []
      let currentSupply = [...supplyArray]
      let currentDemand = [...demandArray]
      let allocation = Array(sources).fill().map(() => Array(destinations).fill(0))
      let i = 0, j = 0

      // Proceso de asignación Esquina Noroeste
      while (i < sources && j < destinations) {
        const allocatedAmount = Math.min(currentSupply[i], currentDemand[j])
        allocation[i][j] = allocatedAmount

        currentSupply[i] -= allocatedAmount
        currentDemand[j] -= allocatedAmount

        // Guardar iteración
        iterations.push({
          step: iterations.length + 1,
          allocation: allocation.map(row => [...row]),
          supply: [...currentSupply],
          demand: [...currentDemand],
          currentCell: { i, j },
          allocatedAmount,
          description: `Asignar ${allocatedAmount} unidades a celda (${i + 1}, ${j + 1})`
        })

        // Mover a la siguiente celda según regla de Esquina Noroeste
        if (currentSupply[i] === 0) {
          i++
        } else {
          j++
        }
      }

      // Calcular costo total
      let totalCost = 0
      for (let i = 0; i < sources; i++) {
        for (let j = 0; j < destinations; j++) {
          totalCost += allocation[i][j] * costMatrix[i][j]
        }
      }

      setResult({
        iterations,
        finalAllocation: allocation,
        totalCost,
        costMatrix,
        originalSupply: supplyArray,
        originalDemand: demandArray
      })
      setShowResult(true)
    })
  }, [costs, supply, demand, sources, destinations])

  // Memoizar validación de entrada
  const isValidInput = useMemo(() => {
    if (!costs.length || !supply.length || !demand.length) return false
    
    const costsValid = costs.every(row => row.every(cell => cell !== '' && !isNaN(parseFloat(cell))))
    const supplyValid = supply.every(s => s !== '' && !isNaN(parseFloat(s)))
    const demandValid = demand.every(d => d !== '' && !isNaN(parseFloat(d)))
    
    return costsValid && supplyValid && demandValid
  }, [costs, supply, demand])

  if (showResult) {
    return (
      <motion.div 
        className="space-y-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Tabla inicial con costos */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          <h3 className="text-2xl font-bold text-white mb-6">Tabla de Costos Inicial</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-3 text-white font-bold border border-white/20"></th>
                  {Array(destinations).fill().map((_, j) => (
                    <th key={j} className="p-3 text-white font-bold border border-white/20 bg-blue-500/20">
                      Destino {j + 1}
                    </th>
                  ))}
                  <th className="p-3 text-white font-bold border border-white/20 bg-green-500/20">Oferta</th>
                </tr>
              </thead>
              <tbody>
                {Array(sources).fill().map((_, i) => (
                  <tr key={i}>
                    <td className="p-3 text-white font-bold border border-white/20 bg-purple-500/20">
                      Fuente {i + 1}
                    </td>
                    {Array(destinations).fill().map((_, j) => (
                      <td key={j} className="p-3 text-center border border-white/20 text-white">
                        {result.costMatrix[i][j]}
                      </td>
                    ))}
                    <td className="p-3 text-center border border-white/20 text-green-200 font-bold">
                      {result.originalSupply[i]}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td className="p-3 text-white font-bold border border-white/20 bg-orange-500/20">Demanda</td>
                  {Array(destinations).fill().map((_, j) => (
                    <td key={j} className="p-3 text-center border border-white/20 text-orange-200 font-bold">
                      {result.originalDemand[j]}
                    </td>
                  ))}
                  <td className="p-3 border border-white/20"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Iteraciones del proceso */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          <h3 className="text-2xl font-bold text-white mb-6">Proceso de Asignación - Esquina Noroeste</h3>
          <div className="space-y-6">
            {result.iterations.map((iteration, idx) => (
              <div key={idx} className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h4 className="text-lg font-bold text-emerald-400 mb-4">
                  Paso {iteration.step}: {iteration.description}
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr>
                        <th className="p-2 text-white border border-white/20"></th>
                        {Array(destinations).fill().map((_, j) => (
                          <th key={j} className="p-2 text-white border border-white/20 bg-blue-500/20">
                            D{j + 1}
                          </th>
                        ))}
                        <th className="p-2 text-white border border-white/20 bg-green-500/20">Oferta</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array(sources).fill().map((_, i) => (
                        <tr key={i}>
                          <td className="p-2 text-white font-bold border border-white/20 bg-purple-500/20">
                            F{i + 1}
                          </td>
                          {Array(destinations).fill().map((_, j) => (
                            <td key={j} className={`p-2 border border-white/20 text-center ${
                              iteration.currentCell.i === i && iteration.currentCell.j === j 
                                ? 'bg-yellow-500/30 text-yellow-200 font-bold' 
                                : iteration.allocation[i][j] > 0 
                                  ? 'bg-cyan-500/20 text-cyan-200 font-bold' 
                                  : 'text-gray-400'
                            }`}>
                              {iteration.allocation[i][j] || '-'}
                            </td>
                          ))}
                          <td className="p-2 text-center border border-white/20 text-green-200">
                            {iteration.supply[i]}
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td className="p-2 text-white font-bold border border-white/20 bg-orange-500/20">Demanda</td>
                        {Array(destinations).fill().map((_, j) => (
                          <td key={j} className="p-2 text-center border border-white/20 text-orange-200">
                            {iteration.demand[j]}
                          </td>
                        ))}
                        <td className="p-2 border border-white/20"></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Solución Final */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          <h3 className="text-2xl font-bold text-white mb-6">Solución Final - Asignación Óptima</h3>
          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-3 text-white font-bold border border-white/20"></th>
                  {Array(destinations).fill().map((_, j) => (
                    <th key={j} className="p-3 text-white font-bold border border-white/20 bg-blue-500/20">
                      Destino {j + 1}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array(sources).fill().map((_, i) => (
                  <tr key={i}>
                    <td className="p-3 text-white font-bold border border-white/20 bg-purple-500/20">
                      Fuente {i + 1}
                    </td>
                    {Array(destinations).fill().map((_, j) => (
                      <td key={j} className={`p-3 text-center border border-white/20 ${
                        result.finalAllocation[i][j] > 0 ? 'bg-cyan-500/20 text-cyan-200 font-bold text-lg' : 'text-gray-400'
                      }`}>
                        {result.finalAllocation[i][j] || '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Cálculo del costo total */}
          <div className="bg-white/5 rounded-xl p-6 mb-6">
            <h4 className="text-lg font-bold text-white mb-4">Cálculo del Costo Total:</h4>
            <div className="grid gap-2 text-sm">
              {result.finalAllocation.map((row, i) => 
                row.map((allocation, j) => 
                  allocation > 0 && (
                    <div key={`${i}-${j}`} className="text-gray-300">
                      Fuente {i + 1} → Destino {j + 1}: {allocation} × ${result.costMatrix[i][j]} = ${allocation * result.costMatrix[i][j]}
                    </div>
                  )
                )
              ).flat()}
            </div>
          </div>

          <div className="text-center">
            <div className="inline-block bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-xl p-6 border border-emerald-500/30">
              <h4 className="text-xl font-bold text-emerald-400 mb-2">Costo Total</h4>
              <p className="text-3xl font-bold text-white">${result.totalCost}</p>
            </div>
          </div>
        </div>

        {/* Botón para nueva calculación */}
        <div className="text-center">
          <motion.button
            onClick={() => setShowResult(false)}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Nueva Calculación
          </motion.button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div 
      className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <Calculator className="text-emerald-400" size={24} />
        <h2 className="text-2xl font-bold text-white">Calculadora Esquina Noroeste</h2>
      </div>

      {/* Controles de tamaño */}
      <div className="flex flex-wrap gap-6 mb-8">
        <div className="flex items-center gap-3">
          <span className="text-white font-medium">Fuentes:</span>
          <button onClick={() => adjustSize('sources', 'remove')} className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors">
            <Minus size={16} className="text-red-400" />
          </button>
          <span className="text-white font-bold w-8 text-center">{sources}</span>
          <button onClick={() => adjustSize('sources', 'add')} className="p-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-colors">
            <Plus size={16} className="text-green-400" />
          </button>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-white font-medium">Destinos:</span>
          <button onClick={() => adjustSize('destinations', 'remove')} className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors">
            <Minus size={16} className="text-red-400" />
          </button>
          <span className="text-white font-bold w-8 text-center">{destinations}</span>
          <button onClick={() => adjustSize('destinations', 'add')} className="p-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-colors">
            <Plus size={16} className="text-green-400" />
          </button>
        </div>
      </div>

      {/* Tabla de entrada */}
      <div className="overflow-x-auto mb-6">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-3 text-white font-bold border border-white/20"></th>
              {Array(destinations).fill().map((_, j) => (
                <th key={j} className="p-3 text-white font-bold border border-white/20 bg-blue-500/20">
                  Destino {j + 1}
                </th>
              ))}
              <th className="p-3 text-white font-bold border border-white/20 bg-green-500/20">Oferta</th>
            </tr>
          </thead>
          <tbody>
            {Array(sources).fill().map((_, i) => (
              <tr key={i}>
                <td className="p-3 text-white font-bold border border-white/20 bg-purple-500/20">
                  Fuente {i + 1}
                </td>
                {Array(destinations).fill().map((_, j) => (
                  <td key={j} className="p-2 border border-white/20">
                    <input
                      type="number"
                      value={costs[i][j]}
                      onChange={(e) => updateCosts(i, j, e.target.value)}
                      className="w-full p-2 bg-white/10 border border-white/20 rounded text-white text-center focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                      placeholder="0"
                    />
                  </td>
                ))}
                <td className="p-2 border border-white/20">
                  <input
                    type="number"
                    value={supply[i]}
                    onChange={(e) => updateSupply(i, e.target.value)}
                    className="w-full p-2 bg-green-500/20 border border-white/20 rounded text-white text-center focus:bg-green-500/30 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                    placeholder="0"
                  />
                </td>
              </tr>
            ))}
            <tr>
              <td className="p-3 text-white font-bold border border-white/20 bg-orange-500/20">Demanda</td>
              {Array(destinations).fill().map((_, j) => (
                <td key={j} className="p-2 border border-white/20">
                  <input
                    type="number"
                    value={demand[j]}
                    onChange={(e) => updateDemand(j, e.target.value)}
                    className="w-full p-2 bg-orange-500/20 border border-white/20 rounded text-white text-center focus:bg-orange-500/30 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                    placeholder="0"
                  />
                </td>
              ))}
              <td className="p-3 border border-white/20"></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Botones */}
      <div className="flex gap-4 justify-center">
        <motion.button
          onClick={solveNorthwestCorner}
          disabled={!isValidInput()}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:from-gray-500 disabled:to-gray-600 text-white rounded-xl font-medium transition-all duration-300 disabled:cursor-not-allowed"
          whileHover={isValidInput() ? { scale: 1.05 } : {}}
          whileTap={isValidInput() ? { scale: 0.95 } : {}}
        >
          <Play size={20} />
          Resolver
        </motion.button>
        <motion.button
          onClick={reset}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-xl font-medium transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RotateCcw size={20} />
          Limpiar
        </motion.button>
      </div>
    </motion.div>
  )
})

NorthwestSolver.displayName = 'NorthwestSolver'

export default NorthwestSolver
