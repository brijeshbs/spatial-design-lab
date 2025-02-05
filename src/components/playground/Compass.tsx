export class Compass {
  private size: number;
  private x: number;
  private y: number;
  private rotation: number;

  constructor({ size, x, y, rotation = 0 }: { size: number; x: number; y: number; rotation?: number }) {
    this.size = size;
    this.x = x;
    this.y = y;
    this.rotation = rotation;
  }

  rotate(degrees: number) {
    this.rotation = (this.rotation + degrees) % 360;
  }

  draw(ctx: CanvasRenderingContext2D) {
    // Save current context state
    ctx.save();
    
    // Translate to compass center and apply rotation
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.translate(-this.x, -this.y);
    
    // Draw compass circle
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size/2, 0, 2 * Math.PI);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.strokeStyle = "#2C3E50";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw compass needle
    ctx.beginPath();
    ctx.moveTo(this.x, this.y + this.size/3);
    ctx.lineTo(this.x, this.y - this.size/3);
    ctx.strokeStyle = "#E74C3C";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw N indicator
    ctx.fillStyle = "#2C3E50";
    ctx.font = "bold 14px Inter";
    ctx.textAlign = "center";
    ctx.fillText("N", this.x, this.y - this.size/2 - 5);

    // Draw rotation buttons
    const buttonRadius = 15;
    const buttonDistance = this.size/2 + 25;
    
    // Left rotation button
    ctx.beginPath();
    ctx.arc(this.x - buttonDistance, this.y, buttonRadius, 0, 2 * Math.PI);
    ctx.fillStyle = "#3498DB";
    ctx.fill();
    ctx.fillStyle = "white";
    ctx.fillText("⟲", this.x - buttonDistance, this.y + 5);

    // Right rotation button
    ctx.beginPath();
    ctx.arc(this.x + buttonDistance, this.y, buttonRadius, 0, 2 * Math.PI);
    ctx.fillStyle = "#3498DB";
    ctx.fill();
    ctx.fillStyle = "white";
    ctx.fillText("⟳", this.x + buttonDistance, this.y + 5);
    
    // Restore context state
    ctx.restore();
  }

  isRotationButtonClicked(x: number, y: number): 'left' | 'right' | null {
    const buttonDistance = this.size/2 + 25;
    const buttonRadius = 15;
    
    // Check left button
    const leftDist = Math.sqrt(
      Math.pow(x - (this.x - buttonDistance), 2) + 
      Math.pow(y - this.y, 2)
    );
    if (leftDist <= buttonRadius) return 'left';
    
    // Check right button
    const rightDist = Math.sqrt(
      Math.pow(x - (this.x + buttonDistance), 2) + 
      Math.pow(y - this.y, 2)
    );
    if (rightDist <= buttonRadius) return 'right';
    
    return null;
  }
}