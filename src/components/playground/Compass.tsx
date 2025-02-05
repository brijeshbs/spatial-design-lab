export class Compass {
  private size: number;
  private x: number;
  private y: number;

  constructor({ size, x, y }: { size: number; x: number; y: number }) {
    this.size = size;
    this.x = x;
    this.y = y;
  }

  draw(ctx: CanvasRenderingContext2D) {
    // Save current context state
    ctx.save();
    
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
    
    // Restore context state
    ctx.restore();
  }
}