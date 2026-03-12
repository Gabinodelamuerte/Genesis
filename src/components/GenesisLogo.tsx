import React from 'react';

export function GenesisLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <img 
      src="https://image.noelshack.com/fichiers/2026/11/4/1773322661-image-12.png" 
      alt="Genesis Logo" 
      className={`${className} rounded-xl object-contain`}
      referrerPolicy="no-referrer"
    />
  );
}
