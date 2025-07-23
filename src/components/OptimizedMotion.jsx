import React from 'react';
import { motion } from 'framer-motion';

// HOC que optimiza los componentes motion para mejor rendimiento durante scroll
const withScrollOptimization = (WrappedComponent) => {
  return React.forwardRef((props, ref) => {
    return (
      <WrappedComponent
        {...props}
        ref={ref}
        transformTemplate={(props) => `translateZ(0) ${props}`} // Fuerza la aceleración de GPU
        style={{ 
          ...props.style,
          willChange: 'transform', // Indica al navegador que el elemento cambiará
        }}
      />
    );
  });
};

// Componentes motion optimizados para scroll
export const OptimizedMotionDiv = withScrollOptimization(motion.div);
export const OptimizedMotionSection = withScrollOptimization(motion.section);

export default withScrollOptimization;
