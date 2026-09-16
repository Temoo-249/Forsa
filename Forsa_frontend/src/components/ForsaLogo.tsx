'use client';

import React from 'react';

interface ForsaLogoProps {
  className?: string;
  size?: number;
  withText?: boolean;
  animated?: boolean;
}

export const ForsaLogo: React.FC<ForsaLogoProps> = ({ 
  className = "w-10 h-10", 
  size,
  withText = false,
  animated = true
}) => {
  return (
    <div className={`inline-flex items-center gap-3 group select-none ${className}`}>
      <div className={`relative w-full h-full flex items-center justify-center shrink-0 ${animated ? 'transition-all duration-300 ease-out group-hover:scale-105 group-active:scale-95' : ''}`}>
        <img
          src="/logo.svg?v=forsa2026"
          alt="شعار فرصة FORSA"
          width={size || undefined}
          height={size || undefined}
          className="w-full h-full object-contain filter drop-shadow-xs transition-all duration-300"
          style={{ imageRendering: 'auto' }}
        />
      </div>

      {withText && (
        <div className="flex flex-col text-right leading-none select-none">
          <span className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-1.5 transition-colors group-hover:text-blue-600">
            فرصة
            <span className="inline-block w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
          </span>
          <span className="text-[10px] font-black tracking-widest text-blue-600 uppercase font-mono mt-0.5">
            FORSA
          </span>
        </div>
      )}
    </div>
  );
};

