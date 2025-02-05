interface CompassProps {
  size: number;
  rotation: number;
  onRotate: (rotation: number) => void;
}

export const Compass = ({ size, rotation, onRotate }: CompassProps) => {
  const handleRotateLeft = () => {
    onRotate((rotation - 90 + 360) % 360);
  };

  const handleRotateRight = () => {
    onRotate((rotation + 90) % 360);
  };

  return (
    <div className="relative" style={{ width: size * 2.5, height: size * 2.5 }}>
      <div 
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ 
          width: size, 
          height: size,
          transform: `rotate(${rotation}deg)` // Removed the negative sign to fix rotation direction
        }}
      >
        <div className="absolute inset-0 rounded-full bg-white border-2 border-mane-primary shadow-md">
          <div className="absolute top-2 left-1/2 -translate-x-1/2 font-bold text-mane-primary">N</div>
          <div className="absolute h-1/2 w-0.5 bg-mane-accent left-1/2 -translate-x-1/2 origin-bottom" />
        </div>
      </div>
      <button
        onClick={handleRotateLeft}
        className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 transition-colors shadow-md"
        aria-label="Rotate Left"
      >
        <svg 
          viewBox="0 0 24 24" 
          width="24" 
          height="24" 
          stroke="currentColor" 
          strokeWidth="2" 
          fill="none" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
        </svg>
      </button>
      <button
        onClick={handleRotateRight}
        className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 transition-colors shadow-md"
        aria-label="Rotate Right"
      >
        <svg 
          viewBox="0 0 24 24" 
          width="24" 
          height="24" 
          stroke="currentColor" 
          strokeWidth="2" 
          fill="none" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="transform -scale-x-100"
        >
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
        </svg>
      </button>
    </div>
  );
};