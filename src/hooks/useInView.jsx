import { useState, useEffect, useRef, useCallback } from 'react';

// Hook optimizado para detectar cuando un elemento entra en la viewport
const useInView = (options = {}) => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef(null);

  // Memoizar el callback del observer
  const observerCallback = useCallback(([entry]) => {
    setIsInView(entry.isIntersecting);
  }, []);

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.1,
      rootMargin: '100px',
      ...options
    });

    observer.observe(currentRef);

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [observerCallback, options]);

  return [ref, isInView];
};

export default useInView;
