import { useState, useCallback, useMemo, memo } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Calculator, Minus, Plus, Play, RotateCcw, Target, Zap, TrendingUp, Layers } from 'lucide-react'

const EsquinaNoroeste = memo(({ onBack }) => {
  const [sources, setSources] = useState(3)
  const [destinations, setDestinations] = useState(3)
  const [costs, setCosts] = useState(Array(3).fill().map(() => Array(3).fill('')))
  const [supply, setSupply] = useState(Array(3).fill(''))
  const [demand, setDemand] = useState(Array(3).fill(''))
  const [result, setResult] = useState(null)
  const [showResult, setShowResult] = useState(false)

  // Optimizar la función adjustSize con useCallback profundo
  const adjustSize = useCallback((type, action) => {
    if (type === 'sources') {
      if (action === 'add' && sources < 10) {
        setSources(prev => prev + 1)
        setCosts(prev => [...prev, Array(destinations).fill('')])
        setSupply(prev => [...prev, ''])
      } else if (action === 'remove' && sources > 2) {
        setSources(prev => prev - 1)
        setCosts(prev => prev.slice(0, -1))
        setSupply(prev => prev.slice(0, -1))
      }
    } else {
      if (action === 'add' && destinations < 10) {
        setDestinations(prev => prev + 1)
        setCosts(prev => prev.map(row => [...row, '']))
        setDemand(prev => [...prev, ''])
      } else if (action === 'remove' && destinations > 2) {
        setDestinations(prev => prev - 1)
        setCosts(prev => prev.map(row => row.slice(0, -1)))
        setDemand(prev => prev.slice(0, -1))
      }
    }
  }, [sources, destinations])

  // Optimizar updateCosts con estructura inmutable más eficiente
  const updateCosts = useCallback((i, j, value) => {
    setCosts(prev => {
      // Solo actualizar si el valor realmente cambió
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

  // Memoizar el cálculo pesado del método de esquina noroeste con Web Worker simulation
  const northwestCornerMethod = useCallback(() => {
    // Validar datos antes de procesar
    const costMatrix = costs.map(row => row.map(cell => parseFloat(cell) || 0))
    const supplyArray = supply.map(s => parseFloat(s) || 0)
    const demandArray = demand.map(d => parseFloat(d) || 0)
    
    // Usar requestAnimationFrame para no bloquear el render
    requestAnimationFrame(() => {
      let iterations = []
      let currentSupply = [...supplyArray]
      let currentDemand = [...demandArray]
      let allocation = Array(sources).fill().map(() => Array(destinations).fill(0))
      let i = 0, j = 0

      // Agregar estado inicial
      iterations.push({
        step: 0,
        allocation: allocation.map(row => [...row]),
        supply: [...currentSupply],
        demand: [...currentDemand],
        currentCell: { i, j },
        allocatedAmount: 0,
        description: "Estado inicial"
      })

      // Proceso de asignación optimizado
      while (i < sources && j < destinations) {
        const allocatedAmount = Math.min(currentSupply[i], currentDemand[j])
        allocation[i][j] = allocatedAmount

        currentSupply[i] -= allocatedAmount
        currentDemand[j] -= allocatedAmount

        // Guardar iteración solo si hay cambios significativos
        if (allocatedAmount > 0) {
          iterations.push({
            step: iterations.length,
            allocation: allocation.map(row => [...row]),
            supply: [...currentSupply],
            demand: [...currentDemand],
            currentCell: { i, j },
            allocatedAmount,
            description: `Asignar ${allocatedAmount} unidades a celda (${i + 1}, ${j + 1})`
          })
        }

        // Lógica de movimiento corregida y optimizada
        if (Math.abs(currentSupply[i]) < 1e-9 && Math.abs(currentDemand[j]) < 1e-9) {
          i++
          j++
        } else if (Math.abs(currentSupply[i]) < 1e-9) {
          i++
        } else if (Math.abs(currentDemand[j]) < 1e-9) {
          j++
        }
      }

      // Calcular costo total de manera optimizada
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
        costMatrix
      })
      setShowResult(true)
    })
  }, [costs, supply, demand, sources, destinations])

  // Memoizar la validación de entrada con dependencias optimizadas
  const isValidInput = useMemo(() => {
    if (!costs.length || !supply.length || !demand.length) return false
    
    const costsValid = costs.every(row => 
      row.every(cell => cell !== '' && !isNaN(parseFloat(cell)))
    )
    const supplyValid = supply.every(s => s !== '' && !isNaN(parseFloat(s)))
    const demandValid = demand.every(d => d !== '' && !isNaN(parseFloat(d)))
    
    return costsValid && supplyValid && demandValid
  }, [costs, supply, demand])

  const handleBackClick = useCallback(() => {
    onBack?.()
  }, [onBack])

  // Memoizar variantes de animación para evitar recálculos
  const motionVariants = useMemo(() => ({
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
    transition: { duration: 0.6, ease: "easeOut" }
  }), [])

  // Memoizar los componentes de la tabla para evitar re-renders masivos
  const tableRows = useMemo(() => {
    const rows = []
    
    // Header
    const headerCells = [
      <th key="empty" className="p-3 text-white font-bold border border-white/20 bg-gradient-to-r from-slate-700/50 to-slate-600/50"></th>
    ]
    
    for (let j = 0; j < destinations; j++) {
      headerCells.push(
        <th key={`dest-${j}`} className="p-3 text-white font-bold border border-white/20 bg-gradient-to-r from-blue-500/20 to-cyan-500/20">
          Destino {j + 1}
        </th>
      )
    }
    headerCells.push(
      <th key="supply-header" className="p-3 text-white font-bold border border-white/20 bg-gradient-to-r from-green-500/20 to-emerald-500/20">Oferta</th>
    )

    rows.push(
      <tr key="header">
        {headerCells}
      </tr>
    )

    // Data rows
    for (let i = 0; i < sources; i++) {
      const cells = [
        <td key={`source-${i}`} className="p-3 text-white font-bold border border-white/20 bg-gradient-to-r from-purple-500/20 to-pink-500/20">
          Fuente {i + 1}
        </td>
      ]

      for (let j = 0; j < destinations; j++) {
        cells.push(
          <td key={`cost-${i}-${j}`} className="p-2 border border-white/20">
            <input
              type="number"
              value={costs[i]?.[j] || ''}
              onChange={(e) => updateCosts(i, j, e.target.value)}
              className="w-full p-2 bg-white/10 border border-white/20 rounded text-white text-center focus:bg-white/20 focus:border-blue-400/50 transition-all"
              placeholder="0"
            />
          </td>
        )
      }

      cells.push(
        <td key={`supply-${i}`} className="p-2 border border-white/20">
          <input
            type="number"
            value={supply[i] || ''}
            onChange={(e) => updateSupply(i, e.target.value)}
            className="w-full p-2 bg-green-500/20 border border-white/20 rounded text-white text-center focus:bg-green-500/30 focus:border-green-400/50 transition-all"
            placeholder="0"
          />
        </td>
      )

      rows.push(
        <tr key={`row-${i}`}>
          {cells}
        </tr>
      )
    }

    // Demand row
    const demandCells = [
      <td key="demand-label" className="p-3 text-white font-bold border border-white/20 bg-gradient-to-r from-orange-500/20 to-yellow-500/20">Demanda</td>
    ]

    for (let j = 0; j < destinations; j++) {
      demandCells.push(
        <td key={`demand-${j}`} className="p-2 border border-white/20">
          <input
            type="number"
            value={demand[j] || ''}
            onChange={(e) => updateDemand(j, e.target.value)}
            className="w-full p-2 bg-orange-500/20 border border-white/20 rounded text-white text-center focus:bg-orange-500/30 focus:border-orange-400/50 transition-all"
            placeholder="0"
          />
        </td>
      )
    }
    demandCells.push(<td key="demand-empty" className="p-3 border border-white/20"></td>)

    rows.push(
      <tr key="demand-row">
        {demandCells}
      </tr>
    )

    return rows
  }, [sources, destinations, costs, supply, demand, updateCosts, updateSupply, updateDemand])

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
        {/* Título */}
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-600 bg-clip-text text-transparent">
            📍 Método Esquina Noroeste
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Método heurístico para encontrar solución básica factible inicial en problemas de transporte
          </p>
        </motion.div>

        {/* Características del método */}
        <motion.div 
          className="bg-gradient-to-br from-slate-800/50 via-slate-700/30 to-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10 mb-8 relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Efectos de fondo */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-cyan-500/5"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"></div>
          
          <div className="relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-lg">
                <Target className="text-emerald-400" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-white">Características del Método Esquina Noroeste</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Enfoque */}
              <motion.div 
                className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 backdrop-blur-sm rounded-xl p-6 border border-emerald-500/20 text-center group hover:from-emerald-500/20 hover:to-teal-500/20 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="mb-4 flex justify-center">
                  <div className="p-3 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full group-hover:scale-110 transition-transform">
                    <Target className="text-emerald-400" size={32} />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-emerald-400 mb-2">Enfoque</h3>
                <p className="text-gray-300 text-sm">Heurístico</p>
                <p className="text-xs text-gray-400 mt-2">Método sistemático y directo</p>
              </motion.div>

              {/* Eficiencia */}
              <motion.div 
                className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/20 text-center group hover:from-yellow-500/20 hover:to-orange-500/20 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="mb-4 flex justify-center">
                  <div className="p-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full group-hover:scale-110 transition-transform">
                    <Zap className="text-yellow-400" size={32} />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-yellow-400 mb-2">Eficiencia</h3>
                <p className="text-gray-300 text-sm">Rápido</p>
                <p className="text-xs text-gray-400 mt-2">Solución en pocos pasos</p>
              </motion.div>

              {/* Complejidad */}
              <motion.div 
                className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-sm rounded-xl p-6 border border-blue-500/20 text-center group hover:from-blue-500/20 hover:to-cyan-500/20 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="mb-4 flex justify-center">
                  <div className="p-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full group-hover:scale-110 transition-transform">
                    <TrendingUp className="text-blue-400" size={32} />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-blue-400 mb-2">Complejidad</h3>
                <p className="text-gray-300 text-sm">Simple</p>
                <p className="text-xs text-gray-400 mt-2">Fácil de implementar</p>
              </motion.div>

              {/* Aplicación */}
              <motion.div 
                className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 text-center group hover:from-purple-500/20 hover:to-pink-500/20 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <div className="mb-4 flex justify-center">
                  <div className="p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full group-hover:scale-110 transition-transform">
                    <Layers className="text-purple-400" size={32} />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-purple-400 mb-2">Aplicación</h3>
                <p className="text-gray-300 text-sm">Transporte</p>
                <p className="text-xs text-gray-400 mt-2">Problemas de distribución</p>
              </motion.div>
            </div>

            {/* Información adicional */}
            <div className="mt-8 grid md:grid-cols-2 gap-6">
              <motion.div 
                className="bg-white/5 rounded-xl p-6 border border-white/10"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                <h3 className="text-lg font-semibold text-emerald-400 mb-3">Características:</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    Comienza en la esquina superior izquierda
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                    Asigna el máximo posible en cada celda
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                    Garantiza una solución básica factible
                  </li>
                </ul>
              </motion.div>
              
              <motion.div 
                className="bg-white/5 rounded-xl p-6 border border-white/10"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 }}
              >
                <h3 className="text-lg font-semibold text-teal-400 mb-3">Proceso:</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    Inicia en celda (1,1)
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    Asigna min(oferta, demanda)
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    Avanza hacia la derecha o abajo
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Calculadora optimizada */}
        <motion.div 
          className="bg-gradient-to-br from-slate-800/50 via-slate-700/30 to-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10 mb-8 relative overflow-hidden"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {/* Efectos de fondo */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-purple-500/5"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
          
          <div className="relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg">
                <Calculator className="text-blue-400" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-white">Calculadora del Método</h2>
            </div>

            {/* Controles de tamaño optimizados */}
            <div className="flex gap-6 mb-8">
              <div className="flex items-center gap-3">
                <span className="text-white font-medium">Fuentes:</span>
                <button 
                  onClick={() => adjustSize('sources', 'remove')} 
                  className="p-1 bg-red-500/20 hover:bg-red-500/30 rounded transition-colors"
                  disabled={sources <= 2}
                >
                  <Minus size={16} className="text-red-400" />
                </button>
                <span className="text-white font-bold w-8 text-center">{sources}</span>
                <button 
                  onClick={() => adjustSize('sources', 'add')} 
                  className="p-1 bg-green-500/20 hover:bg-green-500/30 rounded transition-colors"
                  disabled={sources >= 10}
                >
                  <Plus size={16} className="text-green-400" />
                </button>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-white font-medium">Destinos:</span>
                <button 
                  onClick={() => adjustSize('destinations', 'remove')} 
                  className="p-1 bg-red-500/20 hover:bg-red-500/30 rounded transition-colors"
                  disabled={destinations <= 2}
                >
                  <Minus size={16} className="text-red-400" />
                </button>
                <span className="text-white font-bold w-8 text-center">{destinations}</span>
                <button 
                  onClick={() => adjustSize('destinations', 'add')} 
                  className="p-1 bg-green-500/20 hover:bg-green-500/30 rounded transition-colors"
                  disabled={destinations >= 10}
                >
                  <Plus size={16} className="text-green-400" />
                </button>
              </div>
            </div>

            {/* Tabla optimizada */}
            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse">
                <thead>
                  {tableRows[0]}
                </thead>
                <tbody>
                  {tableRows.slice(1)}
                </tbody>
              </table>
            </div>

            {/* Botones optimizados */}
            <div className="flex gap-4 justify-center">
              <motion.button
                onClick={northwestCornerMethod}
                disabled={!isValidInput}
                className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:from-gray-500 disabled:to-gray-600 text-white rounded-xl font-medium transition-all duration-300 disabled:cursor-not-allowed shadow-lg hover:shadow-emerald-500/25"
                whileHover={isValidInput ? { scale: 1.05, y: -2 } : {}}
                whileTap={isValidInput ? { scale: 0.95 } : {}}
              >
                <Play size={20} />
                Calcular Método
              </motion.button>
              <motion.button
                onClick={reset}
                className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-gray-500/25"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <RotateCcw size={20} />
                Limpiar Todo
              </motion.button>
            </div>
          </div>
        </motion.div>

        {showResult && (
          /* Resultados */
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Iteraciones */}
            <div className="bg-gradient-to-br from-slate-800/50 via-slate-700/30 to-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-cyan-500/5"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"></div>
              
              <div className="relative">
                <h3 className="text-2xl font-bold text-white mb-6">Proceso de Asignación Paso a Paso</h3>
                <div className="space-y-6">
                  {result.iterations.map((iteration, idx) => (
                    <div key={idx} className="bg-white/5 rounded-xl p-6 border border-white/10">
                      <h4 className="text-lg font-bold text-emerald-400 mb-4">
                        {iteration.step === 0 ? "Estado Inicial" : `Paso ${iteration.step}: ${iteration.description}`}
                      </h4>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-sm">
                          <thead>
                            <tr>
                              <th className="p-2 text-white border border-white/20 bg-gradient-to-r from-slate-700/50 to-slate-600/50"></th>
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
                                    iteration.step > 0 && iteration.currentCell.i === i && iteration.currentCell.j === j 
                                      ? 'bg-yellow-500/30 text-yellow-200' 
                                      : iteration.allocation[i][j] > 0 
                                        ? 'bg-cyan-500/20 text-cyan-200 font-bold' 
                                        : 'text-gray-400'
                                  }`}>
                                    {iteration.allocation[i][j] || '-'}
                                  </td>
                                ))}
                                <td className="p-2 text-center border border-white/20 text-green-200 font-bold">
                                  {iteration.supply[i]}
                                </td>
                              </tr>
                            ))}
                            <tr>
                              <td className="p-2 text-white font-bold border border-white/20 bg-orange-500/20">Demanda</td>
                              {Array(destinations).fill().map((_, j) => (
                                <td key={j} className="p-2 text-center border border-white/20 text-orange-200 font-bold">
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
            </div>

            {/* Solución Final */}
            <div className="bg-gradient-to-br from-slate-800/50 via-slate-700/30 to-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-purple-500/5"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
              
              <div className="relative">
                <h3 className="text-2xl font-bold text-white mb-6">Solución Final</h3>
                <div className="overflow-x-auto mb-6">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="p-3 text-white font-bold border border-white/20 bg-gradient-to-r from-slate-700/50 to-slate-600/50"></th>
                        {Array(destinations).fill().map((_, j) => (
                          <th key={j} className="p-3 text-white font-bold border border-white/20 bg-gradient-to-r from-blue-500/20 to-cyan-500/20">
                            Destino {j + 1}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {Array(sources).fill().map((_, i) => (
                        <tr key={i}>
                          <td className="p-3 text-white font-bold border border-white/20 bg-gradient-to-r from-purple-500/20 to-pink-500/20">
                            Fuente {i + 1}
                          </td>
                          {Array(destinations).fill().map((_, j) => (
                            <td key={j} className={`p-3 text-center border border-white/20 ${
                              result.finalAllocation[i][j] > 0 ? 'bg-cyan-500/20 text-cyan-200 font-bold text-lg' : 'text-gray-400'
                            }`}>
                              {result.finalAllocation[i][j] > 0 ? result.finalAllocation[i][j] : '0'}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Cálculo detallado del costo */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <h4 className="text-lg font-bold text-blue-400 mb-4">Cálculo del Costo Total</h4>
                    <div className="space-y-2">
                      {result.finalAllocation.map((row, i) => 
                        row.map((allocation, j) => {
                          if (allocation > 0) {
                            const cost = allocation * result.costMatrix[i][j];
                            return (
                              <div key={`${i}-${j}`} className="flex justify-between items-center text-sm">
                                <span className="text-gray-300">
                                  F{i+1} → D{j+1}: {allocation} × {result.costMatrix[i][j]}
                                </span>
                                <span className="text-cyan-400 font-bold">{cost}</span>
                              </div>
                            );
                          }
                          return null;
                        })
                      ).flat().filter(Boolean)}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-xl p-6 border border-emerald-500/20">
                    <h4 className="text-lg font-bold text-emerald-400 mb-4">Resultado</h4>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-2">{result.totalCost}</div>
                      <div className="text-emerald-400">Costo Total Mínimo</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
})

EsquinaNoroeste.displayName = 'EsquinaNoroeste'

export default EsquinaNoroeste
