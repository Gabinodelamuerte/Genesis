import React from 'react';

export function GenesisLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <img 
      src="/logo.png" 
      alt="Genesis Logo" 
      className={`${className} rounded-xl object-contain`}
      referrerPolicy="no-referrer"
    />
  );
}
