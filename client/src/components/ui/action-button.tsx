import React from 'react';

interface ActionButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  color?: 'blue' | 'green';
}

export function ActionButton({ onClick, children, color = 'blue' }: ActionButtonProps) {
  const baseClasses = "w-full text-center py-4 px-4 text-white font-bold rounded border-2 cursor-pointer transition-colors mb-3";
  const colorClasses = color === 'blue' 
    ? "bg-blue-500 border-blue-600 hover:bg-blue-600" 
    : "bg-green-500 border-green-600 hover:bg-green-600";
  
  return (
    <a
      onClick={onClick}
      className={`${baseClasses} ${colorClasses}`}
      style={{
        display: 'block',
        visibility: 'visible',
        pointerEvents: 'auto',
        position: 'relative',
        zIndex: 10
      }}
    >
      {children}
    </a>
  );
}