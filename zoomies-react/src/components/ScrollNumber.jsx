import React, { useState, useEffect } from 'react';

const ScrollNumber = ({ value, duration = 2000, delay = 0, className = '' }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(true);
      const startTime = Date.now();
      const startValue = 0;
      const endValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.]/g, '')) : value;
      
      const animate = () => {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = startValue + (endValue - startValue) * easeOutQuart;
        
        setDisplayValue(Math.floor(currentValue));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setDisplayValue(endValue);
        }
      };
      
      requestAnimationFrame(animate);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, duration, delay]);

  // Format the number with commas and preserve currency symbols
  const formatValue = (num) => {
    if (typeof value === 'string' && value.includes('$')) {
      return `$${num.toLocaleString()}`;
    }
    return num.toLocaleString();
  };

  return (
    <span className={`scroll-number ${className}`} style={{ opacity: isAnimating ? 1 : 0 }}>
      {formatValue(displayValue)}
    </span>
  );
};

export default ScrollNumber; 