import { AfterViewInit, Component, ElementRef, HostListener, NgZone, OnDestroy, ViewChild } from '@angular/core';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  color: string;
}

@Component({
  selector: 'app-particle-canvas',
  standalone: true,
  template: `<canvas #canvas class="galaxy-canvas"></canvas>`,
  styles: [`
    :host {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 0;
      overflow: hidden;
    }
    .galaxy-canvas {
      width: 100%;
      height: 100%;
      display: block;
    }
  `],
})
export class ParticleCanvasComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private animId = 0;
  private particles: Particle[] = [];
  private mouse = { x: -1000, y: -1000, radius: 160 };
  private width = 0;
  private height = 0;

  constructor(private zone: NgZone) {}

  @HostListener('window:mousemove', ['$event'])
  onGlobalMouseMove(e: MouseEvent): void {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
  }

  @HostListener('window:resize')
  onResize(): void {
    this.initCanvasSize();
  }

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.initCanvasSize();
    this.initParticles();

    this.zone.runOutsideAngular(() => {
      this.loop();
    });
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animId);
  }

  private initCanvasSize(): void {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvasRef.nativeElement.width = this.width * window.devicePixelRatio;
    this.canvasRef.nativeElement.height = this.height * window.devicePixelRatio;
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  private initParticles(): void {
    const count = Math.min(Math.floor((this.width * this.height) / 14000), 100);
    const colors = ['#6366f1', '#06b6d4', '#818cf8', '#38bdf8'];
    this.particles = [];

    for (let i = 0; i < count; i++) {
      const radius = Math.random() * 2 + 1;
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        radius,
        baseRadius: radius,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
  }

  private loop(): void {
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // Physics update
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > this.width) p.vx *= -1;
      if (p.y < 0 || p.y > this.height) p.vy *= -1;

      // Mouse gravity interaction
      const dx = this.mouse.x - p.x;
      const dy = this.mouse.y - p.y;
      const dist = Math.hypot(dx, dy);

      if (dist < this.mouse.radius) {
        const force = (this.mouse.radius - dist) / this.mouse.radius;
        p.x -= (dx / dist) * force * 3;
        p.y -= (dy / dist) * force * 3;
        p.radius = p.baseRadius + force * 2.5;
      } else {
        p.radius = p.baseRadius;
      }

      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.shadowBlur = 10;
      this.ctx.shadowColor = p.color;
      this.ctx.fill();
      this.ctx.shadowBlur = 0;

      // Draw interactive synaptic links between neighboring nodes
      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const linkDist = Math.hypot(p.x - p2.x, p.y - p2.y);

        if (linkDist < 120) {
          const alpha = 1 - linkDist / 120;
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.strokeStyle = `rgba(99, 102, 241, ${alpha * 0.35})`;
          this.ctx.lineWidth = 0.8;
          this.ctx.stroke();
        }
      }
    }

    this.animId = requestAnimationFrame(() => this.loop());
  }
}