import React, { ReactNode, useState } from 'react';

type ActionButtonProps = {
  children: ReactNode;
  onClick: () => void;
  color?: 'blue' | 'green' | 'red'; 
  className?: string;
  style?: React.CSSProperties;
};

export function ActionButton({ 
  children, 
  onClick, 
  color = 'blue',
  className = '',
  style = {}
}: ActionButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  
  // Aplicar colores según la prop
  const colorStyles = {
    blue: 'bg-blue-500 text-white font-bold border-2 border-blue-600 hover:bg-blue-700',
    green: 'bg-green-500 text-white font-bold border-2 border-green-600 hover:bg-green-700',
    red: 'bg-red-500 text-white font-bold border-2 border-red-600 hover:bg-red-700',
  };

  // Efectos de animación
  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);
  const handleMouseLeave = () => setIsPressed(false);

  return (
    <a
      onClick={onClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      className={`
        w-full 
        text-center 
        py-4 
        px-4 
        rounded-lg 
        cursor-pointer 
        block 
        relative 
        overflow-hidden
        shadow-md
        transform 
        transition-all 
        duration-300 
        ease-in-out
        ${colorStyles[color]} 
        ${isPressed ? 'scale-[0.98] opacity-90' : 'scale-100 hover:scale-[1.02]'}
        ${className}
      `}
      style={{ 
        display: 'block', 
        visibility: 'visible',
        pointerEvents: 'auto',
        zIndex: 10,
        ...style
      }}
    >
      {/* Efecto de brillo */}
      <span 
        className={`
          absolute 
          inset-0 
          transition-opacity 
          duration-700 
          ease-in-out
          bg-gradient-to-r 
          ${color === 'blue' ? 'from-blue-400 to-blue-600' : 
            color === 'green' ? 'from-green-400 to-green-600' : 
            'from-red-400 to-red-600'} 
          opacity-0 
          ${isPressed ? 'opacity-40' : 'hover:opacity-20'}
        `}
      />
      
      {/* Contenido del botón */}
      <span className="relative z-10 font-bold tracking-wide">
        {children}
      </span>
    </a>
  );
}