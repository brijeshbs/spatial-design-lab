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

  draw(ctx: CanvasRenderingContext2D) {
    const compassX = window.innerWidth - 80;
    const compassY = window.innerHeight - 80;
    
    // Save current context state
    ctx.save();
    
    // Draw compass circle with fixed screen position
    ctx.beginPath();
    ctx.arc(compassX, compassY, this.size/2, 0, 2 * Math.PI);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.strokeStyle = "#2C3E50";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Apply rotation only to the compass needle and N indicator
    ctx.translate(compassX, compassY);
    ctx.rotate((-this.rotation * Math.PI) / 180);
    ctx.translate(-compassX, -compassY);

    // Draw compass needle
    ctx.beginPath();
    ctx.moveTo(compassX, compassY + this.size/3);
    ctx.lineTo(compassX, compassY - this.size/3);
    ctx.strokeStyle = "#E74C3C";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw N indicator
    ctx.fillStyle = "#2C3E50";
    ctx.font = "bold 14px Inter";
    ctx.textAlign = "center";
    ctx.fillText("N", compassX, compassY - this.size/2 + 15);

    // Reset rotation for buttons
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // Draw rotation buttons
    const buttonRadius = 15;
    const buttonDistance = this.size/2 + 25;
    
    // Left rotation button
    ctx.beginPath();
    ctx.arc(compassX - buttonDistance, compassY, buttonRadius, 0, 2 * Math.PI);
    ctx.fillStyle = "#3498DB";
    ctx.fill();
    ctx.fillStyle = "white";
    ctx.fillText("⟲", compassX - buttonDistance, compassY + 5);

    // Right rotation button
    ctx.beginPath();
    ctx.arc(compassX + buttonDistance, compassY, buttonRadius, 0, 2 * Math.PI);
    ctx.fillStyle = "#3498DB";
    ctx.fill();
    ctx.fillStyle = "white";
    ctx.fillText("⟳", compassX + buttonDistance, compassY + 5);
    
    // Restore context state
    ctx.restore();
  }

  isRotationButtonClicked(x: number, y: number): 'left' | 'right' | null {
    const compassX = window.innerWidth - 80;
    const compassY = window.innerHeight - 80;
    const buttonDistance = this.size/2 + 25;
    const buttonRadius = 15;
    
    // Check left button
    const leftDist = Math.sqrt(
      Math.pow(x - (compassX - buttonDistance), 2) + 
      Math.pow(y - compassY, 2)
    );
    if (leftDist <= buttonRadius) return 'left';
    
    // Check right button
    const rightDist = Math.sqrt(
      Math.pow(x - (compassX + buttonDistance), 2) + 
      Math.pow(y - compassY, 2)
    );
    if (rightDist <= buttonRadius) return 'right';
    
    return null;
  }
}