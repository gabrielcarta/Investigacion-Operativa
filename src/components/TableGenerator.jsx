import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const TableGenerator = ({ onDataChange }) => {
  const [numVariables, setNumVariables] = useState(2)
  const [numRestricciones, setNumRestricciones] = useState(2)
  const [tipoZ, setTipoZ] = useState('max')
  const [zCoeffs, setZCoeffs] = useState([0, 0])
  const [restricciones, setRestricciones] = useState([])

  // Inicializar restricciones cuando cambian las dimensiones
  useEffect(() => {
    const newRestricciones = []
    for (let r = 0; r < numRestricciones; r++) {
      const coeficientes = new Array(numVariables).fill(0)
      newRestricciones.push({
        coeficientes,
        relacion: '<=',
        resultado: 0
      })
    }
    setRestricciones(newRestricciones)
    
    // Ajustar coeficientes Z
    const newZCoeffs = new Array(numVariables).fill(0)
    for (let i = 0; i < Math.min(zCoeffs.length, numVariables); i++) {
      newZCoeffs[i] = zCoeffs[i]
    }
    setZCoeffs(newZCoeffs)
  }, [numVariables, numRestricciones])

  // Notificar cambios al componente padre
  useEffect(() => {
    const data = {
      numVariables,
      numRestricciones,
      tipoZ,
      zCoeffs,
      restricciones
    }
    onDataChange && onDataChange(data)
  }, [numVariables, numRestricciones, tipoZ, zCoeffs, restricciones, onDataChange])

  const updateZCoeff = (index, value) => {
    const newZCoeffs = [...zCoeffs]
    newZCoeffs[index] = parseFloat(value) || 0
    setZCoeffs(newZCoeffs)
  }

  const updateRestriccion = (rowIndex, field, value) => {
    const newRestricciones = [...restricciones]
    if (field === 'relacion' || field === 'resultado') {
      newRestricciones[rowIndex][field] = field === 'resultado' ? (parseFloat(value) || 0) : value
    } else {
      // field es el índice del coeficiente
      newRestricciones[rowIndex].coeficientes[field] = parseFloat(value) || 0
    }
    setRestricciones(newRestricciones)
  }

  const generateZEquation = () => {
    let equation = ''
    zCoeffs.forEach((coef, i) => {
      if (coef !== 0) {
        const sign = coef > 0 ? (equation === '' ? '' : '+') : '-'
        const coefAbs = Math.abs(coef)
        const coefDisplay = coefAbs === 1 ? '' : coefAbs
        equation += `${sign}${coefDisplay}X₁${i + 1}`
      }
    })
    return equation === '' ? '0' : equation.startsWith('+') ? equation.substring(1) : equation
  }

  const generateRestriccionEquation = (restriccion, index) => {
    let equation = ''
    restriccion.coeficientes.forEach((coef, i) => {
      if (coef !== 0) {
        const sign = coef > 0 ? (equation === '' ? '' : '+') : '-'
        const coefAbs = Math.abs(coef)
        const coefDisplay = coefAbs === 1 ? '' : coefAbs
        equation += `${sign}${coefDisplay}X₁${i + 1}`
      }
    })
    if (equation === '') equation = '0'
    if (equation.startsWith('+')) equation = equation.substring(1)
    
    const relSymbol = restriccion.relacion === '<=' ? '≤' : restriccion.relacion === '>=' ? '≥' : '='
    return `${equation} ${relSymbol} ${restriccion.resultado}`
  }

  return (
    <motion.div 
      className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 mb-8"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <h3 className="text-2xl font-bold text-white mb-6">⚙️ Configuración del Problema</h3>
      
      {/* Controles de dimensión */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-white text-sm font-medium mb-2">Variables</label>
          <input
            type="number"
            value={numVariables}
            onChange={(e) => setNumVariables(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-blue-400 focus:outline-none"
            min="1"
            max="10"
          />
        </div>
        <div>
          <label className="block text-white text-sm font-medium mb-2">Restricciones</label>
          <input
            type="number"
            value={numRestricciones}
            onChange={(e) => setNumRestricciones(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-blue-400 focus:outline-none"
            min="1"
            max="10"
          />
        </div>
      </div>

      {/* Tipo de optimización */}
      <div className="mb-6">
        <label className="block text-white text-sm font-medium mb-2">Tipo de Optimización</label>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="max"
              checked={tipoZ === 'max'}
              onChange={(e) => setTipoZ(e.target.value)}
              className="mr-2"
            />
            <span className="text-white">Maximizar</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="min"
              checked={tipoZ === 'min'}
              onChange={(e) => setTipoZ(e.target.value)}
              className="mr-2"
            />
            <span className="text-white">Minimizar</span>
          </label>
        </div>
      </div>

      {/* Tabla principal */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-white/20 table-fixed">
          <thead>
            <tr className="bg-white/10">
              <th className="border border-white/20 px-3 py-3 text-white text-sm w-24"></th>
              {Array.from({ length: numVariables }, (_, i) => (
                <th key={i} className="border border-white/20 px-3 py-3 text-white text-sm w-20">
                  X₁{i + 1}
                </th>
              ))}
              <th className="border border-white/20 px-3 py-3 text-white text-sm w-24">Relación</th>
              <th className="border border-white/20 px-3 py-3 text-white text-sm w-24">Resultado</th>
              <th className="border border-white/20 px-3 py-3 text-white text-sm w-32">Ecuación</th>
            </tr>
          </thead>
          <tbody>
            {/* Fila Z */}
            <tr className="bg-blue-500/10 h-16">
              <td className="border border-white/20 px-3 py-3 text-white text-sm font-medium">
                {tipoZ === 'max' ? 'Maximizar' : 'Minimizar'}
              </td>
              {zCoeffs.map((coef, i) => (
                <td key={i} className="border border-white/20 px-2 py-3">
                  <input
                    type="number"
                    value={coef}
                    onChange={(e) => updateZCoeff(i, e.target.value)}
                    className="w-full h-10 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:border-blue-400 focus:outline-none text-center"
                    step="0.1"
                  />
                </td>
              ))}
              <td colSpan="2" className="border border-white/20 px-3 py-3"></td>
              <td className="border border-white/20 px-3 py-3 text-white text-sm overflow-hidden">
                <div className="truncate">Z = {generateZEquation()}</div>
              </td>
            </tr>

            {/* Restricciones */}
            {restricciones.map((restriccion, r) => (
              <tr key={r} className="hover:bg-white/5 h-16">
                <td className="border border-white/20 px-3 py-3 text-white text-sm font-medium">
                  R{r + 1}
                </td>
                {restriccion.coeficientes.map((coef, v) => (
                  <td key={v} className="border border-white/20 px-2 py-3">
                    <input
                      type="number"
                      value={coef}
                      onChange={(e) => updateRestriccion(r, v, e.target.value)}
                      className="w-full h-10 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:border-blue-400 focus:outline-none text-center"
                      step="0.1"
                    />
                  </td>
                ))}
                <td className="border border-white/20 px-2 py-3">
                  <select
                    value={restriccion.relacion}
                    onChange={(e) => updateRestriccion(r, 'relacion', e.target.value)}
                    className="w-full h-10 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:border-blue-400 focus:outline-none text-center"
                  >
                    <option value="<=" className="bg-white text-black text-center">≤</option>
                    <option value="=" className="bg-white text-black text-center">=</option>
                    <option value=">=" className="bg-white text-black text-center">≥</option>
                  </select>
                </td>
                <td className="border border-white/20 px-2 py-3">
                  <input
                    type="number"
                    value={restriccion.resultado}
                    onChange={(e) => updateRestriccion(r, 'resultado', e.target.value)}
                    className="w-full h-10 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:border-blue-400 focus:outline-none text-center"
                    step="0.1"
                  />
                </td>
                <td className="border border-white/20 px-3 py-3 text-white text-sm overflow-hidden">
                  <div className="truncate">{generateRestriccionEquation(restriccion, r)}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}

export default TableGenerator
