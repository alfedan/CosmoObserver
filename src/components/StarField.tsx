import React from 'react';

export function StarField() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {[...Array(100)].map((_, i) => {
        const top = `${Math.random() * 100}%`;
        const left = `${Math.random() * 100}%`;
        const size = Math.random() < 0.5 ? 'small' : Math.random() < 0.8 ? 'medium' : 'large';
        const delay = Math.random() < 0.3 ? 'twinkle-delay-1' : Math.random() < 0.6 ? 'twinkle-delay-2' : '';
        
        return (
          <div
            key={i}
            className={`star star-${size} twinkle ${delay}`}
            style={{ top, left }}
          />
        );
      })}
    </div>
  );
}