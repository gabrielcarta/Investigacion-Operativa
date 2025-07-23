import { useState, useEffect } from 'react';
import useInView from '../hooks/useInView';

const OptimizedImage = ({ src, alt, className, width, height }) => {
  const [imgRef, isInView] = useInView();
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Solo cargar la imagen cuando está en viewport
  const imageSrc = isInView ? src : null;

  return (
    <div 
      ref={imgRef}
      className={`${className} overflow-hidden relative`}
      style={{ 
        width: width || '100%', 
        height: height || 'auto',
        background: isLoaded ? 'none' : '#1e293b' // Color de fondo mientras carga
      }}
    >
      {isInView && (
        <img 
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setIsLoaded(true)}
          loading="lazy"
        />
      )}
    </div>
  );
};

export default OptimizedImage;
