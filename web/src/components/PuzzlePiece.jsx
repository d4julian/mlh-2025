import React from 'react';

export default function PuzzlePiece({ piece, isActive, onMouseDown }) {
  return (
    <div
      className="absolute cursor-move"
      style={{
        transform: `translate(${piece.x}px, ${piece.y}px)`,
        transition: isActive ? 'none' : 'all 0.2s'
      }}
      onMouseDown={onMouseDown}
    >
      <div className="relative puzzle-piece">
        <svg 
          className="h-40"
          viewBox="0 0 292.111 292.11"
          style={{fill: piece.color}}
        >
          <path d="M228.246,292.11H129.05l10.79-24.609c1.559-3.546,2.339-7.309,2.339-11.208 c0-15.467-12.585-28.053-28.053-28.053c-15.47,0-28.052,12.586-28.052,28.053c0,3.899,0.783,7.674,2.33,11.208l10.772,24.604 H0.005V63.868h90.699c0.174-0.257,0.274-0.538,0.274-0.76c0-0.034,0-0.072-0.006-0.106c-0.854-0.726-1.529-1.307-2.43-2.19 C81.916,53.99,78.319,45.15,78.319,35.81C78.319,16.065,94.387,0,114.131,0s35.81,16.065,35.81,35.81 c0,9.352-3.594,18.191-10.124,24.896l-2.242,1.987c-0.083,0.192-0.111,0.332-0.111,0.403c0,0.257,0.1,0.521,0.263,0.761h90.519 v90.622c0.252,0.137,0.572,0.245,0.887,0.245c0.543-0.577,1.212-1.366,2.178-2.338c6.822-6.619,15.668-10.216,24.988-10.216 c19.738,0,35.807,16.071,35.807,35.81c0,19.75-16.068,35.812-35.807,35.812c-9.332,0-18.178-3.597-24.908-10.138l-1.978-2.162 c-0.366-0.057-0.841,0.041-1.167,0.206V292.11z" />
        </svg>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-800 font-bold text-xl">
          {piece.text}
        </div>
      </div>
    </div>
  );
}
