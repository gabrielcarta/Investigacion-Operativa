import { throttle } from './performance';

// Clase que se aplica mientras el usuario está haciendo scroll
const SCROLLING_CLASS = 'is-scrolling';
// Tiempo que permanece activa la clase después del último evento de scroll
const SCROLLING_TIMEOUT = 150;

let scrollingTimer = null;

// Función que detecta eventos de scroll y aplica optimizaciones
const setupScrollOptimizer = () => {
  // Manejador optimizado del evento scroll
  const handleScroll = throttle(() => {
    // Añadir clase mientras se está haciendo scroll
    document.body.classList.add(SCROLLING_CLASS);
    
    // Limpiar temporizador previo
    if (scrollingTimer) {
      clearTimeout(scrollingTimer);
    }
    
    // Configurar temporizador para quitar la clase
    scrollingTimer = setTimeout(() => {
      document.body.classList.remove(SCROLLING_CLASS);
    }, SCROLLING_TIMEOUT);
  }, 100);
  
  // Registrar evento
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  // Limpiar al desmontar
  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
};

export default setupScrollOptimizer;
