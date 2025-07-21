import React from 'react';

const FloatingShapes = ({ count = 6, className = "" }) => {
  const shapes = ['🌟', '✨', '🎪', '🎈', '🎯', '🎨', '🎵', '🌈', '⭐', '💫'];
  
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-float"
          style={{
            left: `${15 + (i * 12)}%`,
            top: `${10 + (i * 8)}%`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${3 + (i * 0.5)}s`
          }}
        >
          <div className="text-2xl opacity-60">
            {shapes[i % shapes.length]}
          </div>
        </div>
      ))}
      
      {/* Additional geometric shapes */}
      {[...Array(4)].map((_, i) => (
        <div
          key={`geo-${i}`}
          className="absolute animate-pulse"
          style={{
            left: `${60 + (i * 10)}%`,
            top: `${20 + (i * 15)}%`,
            animationDelay: `${i * 0.8}s`,
            animationDuration: `${2 + (i * 0.3)}s`
          }}
        >
          <div 
            className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-40"
            style={{
              transform: `rotate(${i * 45}deg)`
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default FloatingShapes;