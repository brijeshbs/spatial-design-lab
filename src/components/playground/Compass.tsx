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
          transform: `rotate(${-rotation}deg)` 
        }}
      >
        <div className="absolute inset-0 rounded-full bg-white border-2 border-mane-primary shadow-md">
          <div className="absolute top-2 left-1/2 -translate-x-1/2 font-bold text-mane-primary">N</div>
          <div className="absolute h-1/2 w-0.5 bg-mane-accent left-1/2 -translate-x-1/2 origin-bottom" />
        </div>
      </div>
      <button
        onClick={handleRotateLeft}
        className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-mane-secondary text-white flex items-center justify-center hover:bg-mane-secondary/80 transition-colors shadow-md"
        aria-label="Rotate Left"
      >
        ↺
      </button>
      <button
        onClick={handleRotateRight}
        className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-mane-secondary text-white flex items-center justify-center hover:bg-mane-secondary/80 transition-colors shadow-md"
        aria-label="Rotate Right"
      >
        ↻
      </button>
    </div>
  );
};