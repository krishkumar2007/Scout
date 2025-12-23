import React from 'react';

// --- Primitives ---

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'success', loading?: boolean }> = ({ 
  className = '', 
  variant = 'primary', 
  children, 
  loading = false,
  disabled,
  ...props 
}) => {
  const baseStyles = "w-full font-black text-lg py-4 rounded-2xl transition-all active:translate-y-1 border-b-4 active:border-b-0 uppercase tracking-wide flex items-center justify-center gap-2 select-none";
  
  const variants = {
    primary: "bg-scout-red text-white border-scout-redDark hover:bg-red-500",
    secondary: "bg-scout-yellow text-black border-scout-yellowDark hover:bg-yellow-400",
    success: "bg-scout-green text-white border-scout-greenDark hover:bg-green-500",
    outline: "bg-transparent text-zinc-400 border-zinc-700 border-2 hover:bg-zinc-800 hover:text-white hover:border-zinc-600"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${loading || disabled ? 'opacity-70 cursor-not-allowed transform-none active:border-b-4' : ''} ${className}`} 
      disabled={loading || disabled}
      {...props}
    >
      {loading ? (
        <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full block"></span>
      ) : children}
    </button>
  );
};

export const Card: React.FC<{ children: React.ReactNode, className?: string, title?: string, icon?: string }> = ({ children, className = '', title, icon }) => (
  <div className={`bg-scout-card rounded-3xl p-5 border-2 border-zinc-800/80 shadow-xl ${className}`}>
    {(title || icon) && (
      <div className="flex items-center gap-2 mb-4">
        {icon && <span className="text-2xl">{icon}</span>}
        {title && <h3 className="text-xl font-extrabold text-zinc-100">{title}</h3>}
      </div>
    )}
    {children}
  </div>
);

export const ProgressBar: React.FC<{ progress: number, color?: string, label?: string }> = ({ progress, color = "bg-scout-red", label }) => (
  <div className="w-full mb-3">
    {label && <div className="flex justify-between mb-1 text-sm font-bold text-zinc-400">
      <span>{label}</span>
      <span>{progress}/100</span>
    </div>}
    <div className="w-full bg-zinc-800 rounded-full h-4 border border-zinc-700/50 overflow-hidden">
      <div 
        className={`${color} h-4 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(0,0,0,0.3)]`} 
        style={{ width: `${progress}%` }}
      />
    </div>
  </div>
);

export const CircularScore: React.FC<{ score: number, size?: number }> = ({ score, size = 140 }) => {
  const radius = size / 2 - 12;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  
  let color = "text-scout-red";
  let strokeColor = "#FF4D4D";
  if(score > 50) { color = "text-scout-yellow"; strokeColor = "#FFD84D"; }
  if(score > 75) { color = "text-scout-green"; strokeColor = "#22C55E"; }

  return (
    <div className="relative flex items-center justify-center animate-pop" style={{ width: size, height: size }}>
      {/* Background Circle */}
      <svg className="transform -rotate-90 w-full h-full drop-shadow-lg">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#27272a"
          strokeWidth="16"
          fill="transparent"
          strokeLinecap="round"
        />
        {/* Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth="16"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1500 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={`text-5xl font-black ${color}`}>{score}</span>
        <span className="text-[10px] uppercase font-black text-zinc-500 tracking-widest mt-1">Score</span>
      </div>
    </div>
  );
};

// --- Complex Components ---

export const Modal: React.FC<{ isOpen: boolean, onClose: () => void, children: React.ReactNode, title?: string }> = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-zinc-900 border-2 border-zinc-700 w-full max-w-sm rounded-3xl p-6 relative z-10 animate-pop shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          {title && <h2 className="text-xl font-black">{title}</h2>}
          <button onClick={onClose} className="p-2 bg-zinc-800 rounded-full hover:bg-zinc-700">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
};

export const XPOverlay: React.FC<{ xp: number | null, onComplete: () => void }> = ({ xp, onComplete }) => {
  if (xp === null) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-pulse" />
      <div 
        className="relative z-10 flex flex-col items-center justify-center animate-pop"
        onAnimationEnd={() => setTimeout(onComplete, 2000)}
      >
         <div className="text-9xl mb-4 animate-bounce-slow filter drop-shadow-[0_0_20px_rgba(255,216,77,0.5)]">💎</div>
         <div className="text-5xl font-black text-scout-yellow mb-2">+{xp} XP</div>
         <div className="text-white font-bold text-xl uppercase tracking-widest">Level Up Progress!</div>
      </div>
    </div>
  );
};

export const Mascot: React.FC<{ emotion?: 'happy' | 'thinking' | 'waiting', className?: string }> = ({ emotion = 'happy', className = '' }) => {
  const emojis = {
    happy: '🚀',
    thinking: '🤔',
    waiting: '👀'
  };
  return (
    <div className={`text-6xl animate-float filter drop-shadow-xl ${className}`}>
      {emojis[emotion]}
    </div>
  );
};
