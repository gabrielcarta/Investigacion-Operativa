import { useState } from 'react'

const RadialMenu = () => {
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    { icon: '🏠', label: 'Home', angle: -90 },
    { icon: '👤', label: 'Perfil', angle: -45 },
    { icon: '📧', label: 'Contacto', angle: 0 },
    { icon: '⚙️', label: 'Config', angle: 45 },
    { icon: '📱', label: 'Social', angle: 90 },
  ]

  console.log('RadialMenu rendering, isOpen:', isOpen)

  return (
    <div className="relative w-96 h-96 flex items-center justify-center">
      {/* Botón principal SIMPLIFICADO */}
      <button
        onClick={() => {
          console.log('BUTTON CLICKED! Current state:', isOpen)
          setIsOpen(!isOpen)
        }}
        className="w-60 h-60 rounded-full border-2 border-white/20 bg-white/5 backdrop-blur-sm flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform"
        style={{ zIndex: 1000 }}
      >
        {/* SVG */}
        <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 48 48" className="mb-2">
          <circle cx="24" cy="24" r="24" fill="#3a6c87"></circle>
          <path fill="#fff" d="M17.77 7.004a.5.5 0 0 0-.001 0 .5.5 0 0 0-.397.244 1.597 1.597 0 0 1-1.363.744.5.5 0 0 0-.006 0h-2.58a.5.5 0 0 0-.156.021 1.507 1.507 0 0 0-1.272 1.479c0 .822.678 1.5 1.5 1.5a.5.5 0 0 0 .053 0 .5.5 0 0 0 .053 0h2.402a.5.5 0 0 0 .006 0h3.494c.282 0 .5.218.5.5 0 .282-.218.5-.5.5a.5.5 0 0 0-.039 0h-2.951a.5.5 0 0 0-.149.019h-.002c-1.308.109-2.363 1.166-2.363 2.477a.5.5 0 0 0 .508.506.5.5 0 0 0 .492-.505c0-.804.662-1.465 1.524-1.49a2.415 2.415 0 0 0-.524 1.49.5.5 0 0 0 .508.505.5.5 0 0 0 .492-.505c0-.82.688-1.495 1.574-1.495h.891a.5.5 0 0 0 .023 0 .5.5 0 0 0 .016 0c.823 0 1.5-.677 1.5-1.5 0-.765-.588-1.398-1.332-1.484a.5.5 0 0 0-.133-.016h-3.5a.5.5 0 0 0-.03 0 .5.5 0 0 0-.005 0h-.504a.493.493 0 0 1-.5-.5c0-.282.218-.5.5-.5h.504a.5.5 0 0 0 .006 0h.002a.5.5 0 0 0 .111-.014c.86-.037 1.655-.478 2.102-1.207a.5.5 0 0 0-.453-.77zm-4.275 1.99h.598a1.472 1.472 0 0 0-.094.5c0 .177.037.343.094.5h-.492a.5.5 0 0 0-.051 0 .5.5 0 0 1-.002 0 .5.5 0 0 1-.002 0 .5.5 0 0 0-.05 0 .493.493 0 0 1-.5-.5c0-.282.217-.5.5-.5zm-.996 7.006a.5.5 0 0 0-.5.5c0 9.243-.2 13.606-.543 16.184-.343 2.577-.827 3.402-1.44 5.687a.5.5 0 0 0 .483.63h27a.5.5 0 0 0 .432-.755c-.734-1.247-1.18-1.995-1.488-4.191-.309-2.196-.444-5.811-.444-12.555a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5c0 6.098-.107 9.575-.347 11.82-.036-.218-.077-.388-.11-.636-.343-2.578-.543-6.941-.543-16.184a.5.5 0 0 0-.5-.5h-12zm.483 1h11.035c0 .753.01 1.308.013 2H12.968c.003-.692.013-1.247.014-2zm-.022 3h11.078c.048 6.653.214 10.563.514 12.817.317 2.383.793 3.425 1.307 5.183h-14.72c.514-1.758.99-2.8 1.307-5.183.3-2.254.466-6.164.514-12.817zm14.031 2h8.026c0 .716.01 1.286.013 1.938h-8.054c.004-.67.015-1.194.015-1.938zm-.023 2.938h8.068c.04 4.47.16 7.428.416 9.258.26 1.843.7 2.833 1.23 3.804h-9.808c-.232-.825-.446-1.493-.638-2.125a.5.5 0 0 0 .035-.096c.462-1.828.646-4.926.697-10.842zm4.102 3.062a2.999 2.999 0 0 0-1.57.4.5.5 0 0 0-.184.684l.816 1.414h-1.633a.5.5 0 0 0-.5.5c0 1.071.573 2.064 1.5 2.6a.5.5 0 0 0 .684-.184l.816-1.416.817 1.416a.5.5 0 0 0 .683.184 3.004 3.004 0 0 0 1.5-2.6.5.5 0 0 0-.5-.5h-1.633l.817-1.414a.5.5 0 0 0-.184-.683 3 3 0 0 0-1.43-.4zm-.024 1c.16 0 .302.086.455.127l-.502.871-.496-.86c.182-.047.353-.142.543-.138zm-1.914 2.498h1l-.5.867a1.9 1.9 0 0 1-.5-.867zm2.734 0h1a1.9 1.9 0 0 1-.5.867l-.5-.867z"></path>
        </svg>
        
        {/* Texto */}
        <div className="text-center">
          <h2 className="text-sm font-medium text-white">Métodos de optimización</h2>
          <p className="text-xs text-gray-400 mt-1">Elige una opción</p>
        </div>
      </button>

      {/* Opciones del menú - VERSION SIMPLIFICADA */}
      {isOpen && (
        <div className="absolute inset-0">
          {menuItems.map((item, index) => {
            console.log(`Showing menu item: ${item.label}`)
            const distance = 150
            const angleRad = (item.angle * Math.PI) / 180
            const x = Math.cos(angleRad) * distance
            const y = Math.sin(angleRad) * distance

            return (
              <div
                key={item.label}
                className="absolute w-16 h-16 bg-red-500 border-2 border-white rounded-full flex flex-col items-center justify-center cursor-pointer"
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 999
                }}
                onClick={() => {
                  console.log(`Menu item clicked: ${item.label}`)
                  setIsOpen(false)
                }}
              >
                <span className="text-sm">{item.icon}</span>
                <span className="text-[8px] text-white">{item.label}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default RadialMenu