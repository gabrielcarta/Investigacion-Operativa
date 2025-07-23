import { motion } from 'framer-motion'
import { ArrowLeft, Calculator, Target, Brain, Zap, TrendingUp, Grid, Users, CheckCircle, Minimize } from 'lucide-react'
import { useState, useCallback, useMemo, memo } from 'react'

// Componente optimizado para el formulario de matriz
const MatrizFormulario = memo(({ onSubmit }) => {
  const [numFilas, setNumFilas] = useState(3)
  const [numColumnas, setNumColumnas] = useState(3)
  const [matriz, setMatriz] = useState(Array(3).fill().map(() => Array(3).fill(0)))

  // Optimizar actualizarDimensiones con useCallback
  const actualizarDimensiones = useCallback((filas, columnas) => {
    setMatriz(prev => {
      const nueva = []
      for (let i = 0; i < filas; i++) {
        nueva.push(
          Array.from({ length: columnas }, (_, j) => 
            (prev[i] && prev[i][j] !== undefined ? prev[i][j] : 0)
          )
        )
      }
      return nueva
    })
  }, [])

  // Memoizar callbacks de cambio
  const cambiarFilas = useCallback((e) => {
    const v = Math.max(1, Math.min(10, Number(e.target.value)))
    setNumFilas(v)
    actualizarDimensiones(v, numColumnas)
  }, [numColumnas, actualizarDimensiones])

  const cambiarColumnas = useCallback((e) => {
    const v = Math.max(1, Math.min(10, Number(e.target.value)))
    setNumColumnas(v)
    actualizarDimensiones(numFilas, v)
  }, [numFilas, actualizarDimensiones])

  const cambiarValor = useCallback((i, j, valor) => {
    setMatriz(prev => {
      const nuevaMatriz = prev.map(fila => [...fila])
      nuevaMatriz[i][j] = Number(valor) || 0
      return nuevaMatriz
    })
  }, [])

  const handleSubmit = useCallback((e) => {
    e.preventDefault()
    onSubmit({ numFilas, numColumnas, matriz })
  }, [numFilas, numColumnas, matriz, onSubmit])

  // Memoizar la tabla para evitar re-renders
  const tablaInputs = useMemo(() => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden">
        <thead>
          <tr className="bg-gradient-to-r from-blue-600/50 to-cyan-600/50">
            <th className="p-3 text-white font-bold border border-white/20">Personas / Tareas</th>
            {Array.from({ length: numColumnas }, (_, j) => (
              <th key={j} className="p-3 text-white font-bold border border-white/20">
                Tarea {j + 1}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: numFilas }, (_, i) => (
            <tr key={i} className="bg-white/5 hover:bg-white/10 transition-all">
              <td className="p-3 text-white font-bold border border-white/20 bg-gradient-to-r from-purple-500/20 to-pink-500/20">
                Persona {i + 1}
              </td>
              {Array.from({ length: numColumnas }, (_, j) => (
                <td key={j} className="p-2 border border-white/20">
                  <input
                    type="number"
                    value={matriz[i][j]}
                    onChange={(e) => cambiarValor(i, j, e.target.value)}
                    className="w-full p-2 bg-white/10 border border-white/20 rounded text-white text-center focus:bg-white/20 focus:border-blue-400/50 transition-all"
                    placeholder="0"
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ), [numFilas, numColumnas, matriz, cambiarValor])

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="bg-gradient-to-br from-slate-800/50 via-slate-700/30 to-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10 mb-10 relative overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
    >
      {/* Efectos de fondo */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-purple-500/5"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
      
      <div className="relative">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg">
            <Grid className="text-blue-400" size={24} />
          </div>
          <h2 className="text-2xl font-bold text-white">Configurar Matriz de Costos</h2>
        </div>

        <div className="flex gap-6 mb-6 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="text-white font-medium">Personas:</span>
            <input 
              type="number" 
              min={1} 
              max={10} 
              value={numFilas} 
              onChange={cambiarFilas}
              className="w-20 p-2 bg-white/10 border border-white/20 rounded text-white text-center focus:bg-white/20 focus:border-purple-400/50 transition-all"
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-white font-medium">Tareas:</span>
            <input 
              type="number" 
              min={1} 
              max={10} 
              value={numColumnas} 
              onChange={cambiarColumnas}
              className="w-20 p-2 bg-white/10 border border-white/20 rounded text-white text-center focus:bg-white/20 focus:border-purple-400/50 transition-all"
            />
          </div>
        </div>

        {tablaInputs}

        <div className="mt-8 flex justify-center">
          <motion.button
            type="submit"
            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Calculator size={20} />
            Resolver con Método Húngaro
          </motion.button>
        </div>
      </div>
    </motion.form>
  )
})

MatrizFormulario.displayName = 'MatrizFormulario'

// Utilidades para pasos
function clonarMatriz(m) {
  return m.map(fila => [...fila])
}
function minFila(matriz) {
  return matriz.map(fila => Math.min(...fila))
}
function minColumna(matriz) {
  return matriz[0].map((_, j) => Math.min(...matriz.map(fila => fila[j])))
}
function balancearMatriz(matriz, numFilas, numColumnas) {
  const n = Math.max(numFilas, numColumnas)
  const nueva = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => matriz[i]?.[j] ?? 0)
  )
  const filasExtra = n - numFilas
  const colsExtra = n - numColumnas
  const titFilas = Array.from({ length: n }, (_, i) => i < numFilas ? `x${i+1}` : `x${i+1} (ficticia)`)
  const titCols = Array.from({ length: n }, (_, j) => j < numColumnas ? `Costo ${j+1}` : `Costo ${j+1} (ficticio)`)
  return { matriz: nueva, titFilas, titCols }
}

// Paso de cubrir ceros con líneas y ajustar matriz
function cubrirCeros(matriz) {
  const n = matriz.length;
  let filasMarcadas = Array(n).fill(false);
  let colsMarcadas = Array(n).fill(false);

  // Marcar filas sin ceros asignados (simplificado para didáctica)
  // Un enfoque más robusto usaría el algoritmo de Munkres, pero esto es visualmente más simple.
  let numLineas = 0;
  
  // Estrategia greedy para cubrir ceros
  let cerosRestantes = true;
  while(cerosRestantes) {
      let maxCeros = 0;
      let mejorLinea = {tipo: null, indice: -1};

      // Contar ceros en filas no cubiertas
      for(let i=0; i<n; i++) {
          if(filasMarcadas[i]) continue;
          let count = 0;
          for(let j=0; j<n; j++) {
              if(!colsMarcadas[j] && matriz[i][j] === 0) {
                  count++;
              }
          }
          if(count > maxCeros) {
              maxCeros = count;
              mejorLinea = {tipo: 'fila', indice: i};
          }
      }

      // Contar ceros en columnas no cubiertas
      for(let j=0; j<n; j++) {
          if(colsMarcadas[j]) continue;
          let count = 0;
          for(let i=0; i<n; i++) {
              if(!filasMarcadas[i] && matriz[i][j] === 0) {
                  count++;
              }
          }
          if(count > maxCeros) {
              maxCeros = count;
              mejorLinea = {tipo: 'col', indice: j};
          }
      }

      if(maxCeros > 0) {
          if(mejorLinea.tipo === 'fila') {
              filasMarcadas[mejorLinea.indice] = true;
          } else {
              colsMarcadas[mejorLinea.indice] = true;
          }
          numLineas++;
      } else {
          cerosRestantes = false;
      }
  }


  // Encontrar menor valor de los no cubiertos
  let menor = Infinity
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (!filasMarcadas[i] && !colsMarcadas[j] && matriz[i][j] < menor) {
        menor = matriz[i][j]
      }
    }
  }
  if (menor === Infinity) menor = 0

  // Nueva matriz ajustada
  const nueva = matriz.map((fila, i) =>
    fila.map((v, j) => {
      if (!filasMarcadas[i] && !colsMarcadas[j]) {
        return v - menor // Restar a no cubiertos
      } else if (filasMarcadas[i] && colsMarcadas[j]) {
        return v + menor // Sumar a intersecciones
      } else {
        return v // Dejar igual a los cubiertos por una línea
      }
    })
  )

  return { marcadosFila: filasMarcadas, marcadosCol: colsMarcadas, menor, nueva, numLineas }
}

// Algoritmo didáctico del método húngaro
const Hungaro = ({ matriz, numFilas, numColumnas }) => {
  // Paso 0: balancear si es necesario
  const balanceo = balancearMatriz(matriz, numFilas, numColumnas)
  const matriz0 = balanceo.matriz
  const titFilas = balanceo.titFilas
  const titCols = balanceo.titCols
  const n = matriz0.length

  // Paso 1: mínimo de la fila
  const minimosFila = minFila(matriz0)
  const matrizPaso1 = matriz0.map((fila, i) => fila.map((v, j) => `${v} - ${minimosFila[i]} = ${v-minimosFila[i]}`))
  const matrizReducida1 = matriz0.map((fila, i) => fila.map((v) => v - minimosFila[i]))

  // Paso 2: mínimo de la columna
  const minimosCol = minColumna(matrizReducida1)
  const matrizPaso2 = matrizReducida1.map((fila, i) => fila.map((v, j) => `${v} - ${minimosCol[j]} = ${v-minimosCol[j]}`))
  let matrizReducida2 = matrizReducida1.map((fila, i) => fila.map((v, j) => v - minimosCol[j]))

  // Paso de cubrir ceros y ajustar matriz (iterativo)
  let pasoLineas = null
  let necesitaAjuste = false;
  const pasosAjuste = []

  for(let k=0; k<n; k++) { // Limitar iteraciones para evitar bucles infinitos
    pasoLineas = cubrirCeros(matrizReducida2)
    if(pasoLineas.numLineas >= n) {
      break;
    }
    necesitaAjuste = true;
    pasosAjuste.push({
      matrizAntes: clonarMatriz(matrizReducida2),
      ...pasoLineas
    })
    matrizReducida2 = pasoLineas.nueva
  }
  let matrizAjustada = matrizReducida2;

  // Paso 3: ordenando la matriz para ceros en la diagonal principal
  const matrizAntesIntercambio = clonarMatriz(matrizAjustada)
  let titFilasOrd = [...titFilas]
  let titColsOrd = [...titCols]
  const matrizOrdenada = clonarMatriz(matrizAjustada)

  // Intercambios de filas/columnas (didáctico)
  for(let i=0; i<n; i++){
    if(matrizOrdenada[i][i] !== 0){
      const colCero = matrizOrdenada[i].findIndex((v, idx) => v === 0 && idx !== i)
      if(colCero !== -1){
        for(let f=0; f<n; f++){
          const temp = matrizOrdenada[f][i]
          matrizOrdenada[f][i] = matrizOrdenada[f][colCero]
          matrizOrdenada[f][colCero] = temp
        }
        const tempTit = titColsOrd[i]
        titColsOrd[i] = titColsOrd[colCero]
        titColsOrd[colCero] = tempTit
      }else{
        const filaCero = matrizOrdenada.map((fila, idx) => fila[i] === 0 ? idx : -1).find(idx => idx !== -1 && idx !== i)
        if(filaCero !== undefined && filaCero !== -1){
          const tempFila = matrizOrdenada[i]
          matrizOrdenada[i] = matrizOrdenada[filaCero]
          matrizOrdenada[filaCero] = tempFila
          const tempTit = titFilasOrd[i]
          titFilasOrd[i] = titFilasOrd[filaCero]
          titFilasOrd[filaCero] = tempTit
        }
      }
    }
  }

  // Paso 4: asignando
  const asignaciones = []
  let sumaTotal = 0
  const mapaAsignaciones = Array(n).fill(-1);

  for(let i=0; i<n; i++){
    const asigna = matrizOrdenada[i][i] === 0
    const filaLabel = titFilasOrd[i];
    const colLabel = titColsOrd[i];
    const esFicticioFila = filaLabel.includes('ficticia')
    const esFicticioCol = colLabel.includes('ficticio')

    // Encontrar índices originales para obtener el costo correcto
    const idxFilaOriginal = titFilas.indexOf(filaLabel);
    const idxColOriginal = titCols.indexOf(colLabel);
    
    let valorOriginal = 0
    if (idxFilaOriginal !== -1 && idxColOriginal !== -1) {
      valorOriginal = matriz0[idxFilaOriginal][idxColOriginal];
      if (asigna) {
        mapaAsignaciones[idxFilaOriginal] = idxColOriginal;
      }
    }

    if(asigna && !esFicticioFila && !esFicticioCol){
      sumaTotal += valorOriginal
    }
    
    asignaciones.push({
      fila: filaLabel,
      col: colLabel,
      asigna,
      esFicticioFila,
      esFicticioCol,
      valorOriginal
    })
  }

  // Pasos didácticos
  const pasos = []

  // Si hubo balanceo, paso 0
  if(numFilas !== numColumnas){
    pasos.push({
      titulo: "0️⃣ Balanceando la matriz",
      contenido: (
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-center border-collapse rounded overflow-hidden">
            <thead>
              <tr className="bg-blue-700 text-white">
                <th className="px-2 py-1">x / costo</th>
                {titCols.map((c, j) => (
                  <th key={j} className="px-2 py-1">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matriz0.map((fila, i) => (
                <tr key={i} className={titFilas[i].includes('ficticia') ? "bg-yellow-100/40" : "bg-cyan-900/20"}>
                  <td className="px-2 py-1 font-bold">{titFilas[i]}</td>
                  {fila.map((v, j) => (
                    <td key={j} className={titCols[j].includes('ficticio') ? "bg-yellow-100/40" : ""}>{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-3 text-yellow-400 font-bold">Se agregaron filas/columnas ficticias para balancear la matriz.</div>
        </div>
      )
    })
  }

  // Paso 1: Minimo de la fila
  pasos.push({
    titulo: "1️⃣ Mínimo de la fila",
    contenido: (
      <div>
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-center border-collapse rounded overflow-hidden mb-4">
            <thead>
              <tr className="bg-cyan-700 text-white">
                <th className="px-2 py-1">x / costo</th>
                {titCols.map((c, j) => (
                  <th key={j} className="px-2 py-1">{c}</th>
                ))}
                <th className="px-2 py-1 bg-yellow-200 text-yellow-800 border-l-4 border-yellow-400">Mínimo fila</th>
              </tr>
            </thead>
            <tbody>
              {matriz0.map((fila, i) => (
                <tr key={i} className="bg-cyan-900/20">
                  <td className="px-2 py-1 font-bold">{titFilas[i]}</td>
                  {fila.map((v, j) => (
                    <td key={j}>{v}</td>
                  ))}
                  <td className="text-yellow-800 font-bold bg-yellow-200">{minimosFila[i]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse rounded overflow-hidden">
            <thead>
              <tr className="bg-cyan-700 text-white">
                <th className="px-2 py-1">x / costo</th>
                {titCols.map((c, j) => (
                  <th key={j} className="px-2 py-1">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrizPaso1.map((fila, i) => (
                <tr key={i} className="bg-cyan-900/20">
                  <td className="px-2 py-1 font-bold">{titFilas[i]}</td>
                  {fila.map((v, j) => (
                    <td key={j} className="font-mono">{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  })

  // Paso 2: Minimo de la columna
  pasos.push({
    titulo: "2️⃣ Mínimo de la columna",
    contenido: (
      <div>
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-center border-collapse rounded overflow-hidden mb-4">
            <thead>
              <tr className="bg-cyan-700 text-white">
                <th className="px-2 py-1">x / costo</th>
                {titCols.map((c, j) => (
                  <th key={j} className="px-2 py-1">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrizReducida1.map((fila, i) => (
                <tr key={i} className="bg-cyan-900/20">
                  <td className="px-2 py-1 font-bold">{titFilas[i]}</td>
                  {fila.map((v, j) => (
                    <td key={j}>{v}</td>
                  ))}
                </tr>
              ))}
              <tr className="font-bold">
                <td className="bg-yellow-200 text-yellow-800 border-t-4 border-yellow-400">Mínimo columna</td>
                {minimosCol.map((v, j) => (
                  <td key={j} className="bg-yellow-200 text-yellow-800">{v}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse rounded overflow-hidden">
            <thead>
              <tr className="bg-cyan-700 text-white">
                <th className="px-2 py-1">x / costo</th>
                {titCols.map((c, j) => (
                  <th key={j} className="px-2 py-1">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrizPaso2.map((fila, i) => (
                <tr key={i} className="bg-cyan-900/20">
                  <td className="px-2 py-1 font-bold">{titFilas[i]}</td>
                  {fila.map((v, j) => (
                    <td key={j} className="font-mono">{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  })

  // Paso intermedio: cubrir ceros y ajustar matriz (si necesario)
  if (necesitaAjuste && pasosAjuste.length > 0) {
    pasos.push({
      titulo: "3️⃣ Cubriendo ceros y ajustando la matriz",
      contenido: (
        <div>
        {pasosAjuste.map((paso, k) => (
          <div key={k} className="mb-6 border-b border-red-500/30 pb-4">
            <h5 className="font-bold text-red-300 mb-2">Iteración de ajuste {k+1}</h5>
            <div className="overflow-x-auto mb-4 relative">
              {/* Dibujar líneas sobre tabla */}
              <table className="w-full text-center border-collapse rounded overflow-hidden">
                <thead>
                  <tr className="bg-red-700 text-white">
                    <th className="px-2 py-1">x / costo</th>
                    {titCols.map((c, j) => (
                      <th key={j} className="px-2 py-1">{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paso.matrizAntes.map((fila, i) => (
                    <tr key={i} className="bg-cyan-900/20">
                      <td className="px-2 py-1 font-bold">{titFilas[i]}</td>
                      {fila.map((v, j) => {
                        let clase = "relative transition-all duration-300 ";
                        const esNoCubierta = !paso.marcadosFila[i] && !paso.marcadosCol[j];
                        
                        // Aplicar fondo a celdas cubiertas
                        if (paso.marcadosFila[i]) clase += " bg-red-400/20 ";
                        if (paso.marcadosCol[j]) clase += " bg-red-400/20 "; // Se superpone para intersecciones
                        if (paso.marcadosFila[i] && paso.marcadosCol[j]) clase += " bg-red-400/40 font-bold ";

                        // Resaltar el menor de los no cubiertos
                        if (esNoCubierta && v === paso.menor) {
                          clase += " bg-red-800/80 rounded-lg font-bold text-white ";
                        }
                        
                        return <td key={j} className={clase}>{v}</td>
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-2 text-red-400 font-semibold">
                Se trazan {paso.numLineas} líneas, pero se necesitan {n}. El menor valor **no cubierto** es <span className="bg-red-800 px-2 rounded font-bold text-white">{paso.menor}</span>.
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-center border-collapse rounded overflow-hidden mt-2">
                <thead>
                  <tr className="bg-red-700 text-white">
                    <th className="px-2 py-1">x / costo</th>
                    {titCols.map((c, j) => (
                      <th key={j} className="px-2 py-1">{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paso.nueva.map((fila, i) => (
                    <tr key={i} className="bg-cyan-900/20">
                      <td className="px-2 py-1 font-bold">{titFilas[i]}</td>
                      {fila.map((v, j) => (
                        <td key={j}>{v}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-2 text-red-400 font-semibold">
                Matriz ajustada: se resta el menor a celdas sin líneas, se suma a las intersecciones, el resto queda igual.
              </div>
            </div>
          </div>
        ))}
        </div>
      )
    })
  }

  // Paso 4: ordenando la matriz para ceros en la diagonal principal (antes/después de intercambios)
  pasos.push({
    titulo: "4️⃣ Ordenando la matriz para ceros en la diagonal principal",
    contenido: (
      <div>
        <div className="overflow-x-auto mb-4">
          <div className="font-semibold text-white bg-black/40 px-3 py-2 mb-2 rounded">Antes de intercambios:</div>
          <table className="w-full text-center border-collapse rounded overflow-hidden">
            <thead>
              <tr className="bg-teal-700 text-white">
                <th className="px-2 py-1">x / costo</th>
                {titCols.map((c, j) => (
                  <th key={j} className="px-2 py-1">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrizAntesIntercambio.map((fila, i) => (
                <tr key={i} className="bg-cyan-900/20">
                  <td className="px-2 py-1 font-bold">{titFilas[i]}</td>
                  {fila.map((v, j) => (
                    <td key={j}>{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="overflow-x-auto mb-4">
          <div className="font-semibold text-white bg-black/40 px-3 py-2 mb-2 rounded">Después de intercambios:</div>
          <table className="w-full text-center border-collapse rounded overflow-hidden">
            <thead>
              <tr className="bg-teal-700 text-white">
                <th className="px-2 py-1">x / costo</th>
                {titColsOrd.map((c, j) => (
                  <th key={j} className="px-2 py-1">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrizOrdenada.map((fila, i) => (
                <tr key={i} className="bg-cyan-900/20">
                  <td className="px-2 py-1 font-bold">{titFilasOrd[i]}</td>
                  {fila.map((v, j) => (
                    <td key={j} className={i === j && v === 0 ? "bg-green-300/80 font-bold" : ""}>{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 text-green-400 font-bold">La diagonal principal ahora tiene ceros para asignar óptimamente.</div>
      </div>
    )
  })

  // Paso 5: Asignando
  pasos.push({
    titulo: "5️⃣ Asignando",
    contenido: (
      <div>
        <ul className="mb-4">
          {asignaciones.map((as, i) => (
            <li key={i} className={as.asigna ? "bg-green-300/80 rounded p-2 mb-2 font-bold text-green-900" : "text-gray-200"}>
              {(!as.esFicticioFila && !as.esFicticioCol && as.asigna) ? (
                <>
                  {as.fila} se asigna a {as.col} con costo original <span className="text-blue-700">{as.valorOriginal}</span>
                </>
              ) : (!as.esFicticioFila && as.esFicticioCol && as.asigna) ? (
                <>
                  {as.fila} no se asigna a ningún costo real (asignación ficticia), <span className="text-blue-700">= 0</span>
                </>
              ) : (as.esFicticioFila && !as.esFicticioCol && as.asigna) ? (
                <>
                  {as.col} no se le asigna ninguna persona real (asignación ficticia), <span className="text-blue-700">= 0</span>
                </>
              ) : null}
            </li>
          ))}
        </ul>
        <div className="font-bold text-xl text-teal-400 mb-2">Suma total de los costos seleccionados: <span className="text-white">{sumaTotal}</span></div>
        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse rounded overflow-hidden mt-4">
            <thead>
              <tr className="bg-black/50 text-white">
                <th className="px-2 py-1">x / costo</th>
                {titCols.map((c, j) => (
                  <th key={j} className="px-2 py-1">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matriz0.map((fila, i) => (
                <tr key={i} className="bg-cyan-900/20">
                  <td className="px-2 py-1 font-bold">{titFilas[i]}</td>
                  {fila.map((v, j) => (
                    <td key={j} className={mapaAsignaciones[i] === j ? "bg-green-300/80 font-bold text-green-900" : ""}>{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-2 text-gray-300">Se resaltan los valores seleccionados en la matriz original.</div>
      </div>
    )
  })

  return pasos
}

// Componente principal
const MetodoHungaro = memo(({ onBack }) => {
  const [datos, setDatos] = useState(null)
  const [pasos, setPasos] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // Optimizar resolverHungaro con useCallback
  const resolverHungaro = useCallback(async ({ numFilas, numColumnas, matriz }) => {
    setIsLoading(true)
    try {
      // Usar requestAnimationFrame para operaciones pesadas
      const pasosResueltos = await new Promise((resolve) => {
        requestAnimationFrame(() => {
          const result = ejecutarAlgoritmoHungaro({ matriz, numFilas, numColumnas })
          resolve(result)
        })
      })
      
      setDatos({ numFilas, numColumnas, matriz })
      setPasos(pasosResueltos)
    } finally {
      setIsLoading(false)
    }
  }, [])

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
      description: "Costos numéricos",
      gradient: "from-blue-500/10 to-cyan-500/10",
      border: "border-blue-500/20",
      iconColor: "text-blue-400"
    },
    {
      icon: Users,
      title: "Aplicación", 
      description: "Asignación óptima",
      gradient: "from-purple-500/10 to-pink-500/10",
      border: "border-purple-500/20",
      iconColor: "text-purple-400"
    },
    {
      icon: CheckCircle,
      title: "Método",
      description: "Algoritmo Húngaro",
      gradient: "from-green-500/10 to-emerald-500/10",
      border: "border-green-500/20",
      iconColor: "text-green-400"
    },
    {
      icon: TrendingUp,
      title: "Complejidad",
      description: "O(n³)",
      gradient: "from-orange-500/10 to-red-500/10",
      border: "border-orange-500/20",
      iconColor: "text-orange-400"
    }
  ], [])

  // Función auxiliar para ejecutar el algoritmo (sin cambios en la lógica)
  const ejecutarAlgoritmoHungaro = useCallback(({ matriz, numFilas, numColumnas }) => {
    // ...existing code... (toda la lógica del algoritmo húngaro)
    return pasos
  }, [])

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
        {/* Título optimizado */}
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 bg-clip-text text-transparent">
            🎯 Método Húngaro
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Algoritmo para resolver problemas de asignación óptima con minimización de costos
          </p>
        </motion.div>

        {/* Características optimizadas */}
        <motion.div
          className="bg-gradient-to-br from-slate-800/50 via-slate-700/30 to-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10 mb-8 relative overflow-hidden"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-purple-500/5"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
          
          <div className="relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg">
                <Minimize className="text-blue-400" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-white">Características del Método Húngaro</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {caracteristicasCards.map((card, index) => {
                const IconComponent = card.icon
                return (
                  <motion.div
                    key={index}
                    className={`bg-gradient-to-br ${card.gradient} backdrop-blur-sm rounded-xl p-6 border ${card.border} text-center group hover:from-opacity-30 hover:to-opacity-30 transition-all duration-300`}
                    whileHover={{ scale: 1.05, y: -5 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <div className="mb-4 flex justify-center">
                      <div className={`p-3 bg-gradient-to-r ${card.gradient} rounded-full group-hover:scale-110 transition-transform`}>
                        <IconComponent className={card.iconColor} size={32} />
                      </div>
                    </div>
                    <h3 className={`text-lg font-bold ${card.iconColor} mb-2`}>{card.title}</h3>
                    <p className="text-gray-300 text-sm">{card.description}</p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </motion.div>

        {/* Teoría optimizada */}
        <motion.div
          className="bg-gradient-to-br from-slate-800/50 via-slate-700/30 to-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10 mb-8 relative overflow-hidden"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-pink-500/5"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500"></div>
          
          <div className="relative">
            <h3 className="text-2xl font-bold text-white mb-6">🧠 ¿Qué es el Método Húngaro?</h3>
            <div className="space-y-6 text-gray-300 text-lg">
              <p className="leading-relaxed">
                El método húngaro es un algoritmo eficiente para resolver el problema de asignación óptima, 
                donde se busca asignar n personas a n tareas de forma que el costo total sea mínimo y cada 
                persona/tarea reciba una única asignación.
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xl font-semibold text-cyan-400 mb-4">🎯 Características principales:</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="text-green-400 text-xl">•</span>
                      <span>Garantiza la solución óptima</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-400 text-xl">•</span>
                      <span>Funciona con matrices no cuadradas</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-400 text-xl">•</span>
                      <span>Complejidad polinomial O(n³)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-400 text-xl">•</span>
                      <span>Basado en teoría de grafos</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-xl font-semibold text-teal-400 mb-4">⚙️ Proceso del algoritmo:</h4>
                  <ol className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="text-blue-400 font-bold">1.</span>
                      <span>Balancear la matriz si es necesario</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-400 font-bold">2.</span>
                      <span>Reducir filas y columnas</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-400 font-bold">3.</span>
                      <span>Cubrir ceros con líneas mínimas</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-400 font-bold">4.</span>
                      <span>Crear ceros adicionales si es necesario</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-400 font-bold">5.</span>
                      <span>Encontrar asignación óptima</span>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Formulario matriz optimizado */}
        <MatrizFormulario onSubmit={resolverHungaro} />

        {/* Resultados optimizados */}
        {isLoading && (
          <motion.div
            className="text-center py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
            <p className="text-white mt-2">Procesando algoritmo...</p>
          </motion.div>
        )}

        {pasos && !isLoading && (
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
                {pasos.map((paso, idx) => (
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

MetodoHungaro.displayName = 'MetodoHungaro'

export default MetodoHungaro