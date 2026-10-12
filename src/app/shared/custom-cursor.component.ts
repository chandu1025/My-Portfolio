import {
    AfterViewInit,
    Component,
    ElementRef,
    HostListener,
    NgZone,
    OnDestroy,
    ViewChild,
} from '@angular/core';

interface TrailParticle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    alpha: number;
    decay: number;
}

@Component({
    selector: 'app-custom-cursor',
    standalone: true,
    template: `
    <canvas #trailCanvas class="trail-canvas"></canvas>
    <div #cursorDot class="cursor-dot"></div>
  `,
    styles: [`
/* In src/app/shared/custom-cursor.component.ts */
:host {
  pointer-events: none;
  position: fixed;
  inset: 0;
  z-index: 99999; /* Change from 9999 to 99999 */
  overflow: hidden;
}
    .trail-canvas {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      display: block;
    }

    /* Core sharp pointer dot */
    .cursor-dot {
      position: fixed;
      top: 0;
      left: 0;
      width: 6px;
      height: 6px;
      background: #06b6d4;
      border-radius: 50%;
      pointer-events: none;
      will-change: transform;
      box-shadow: 0 0 10px #06b6d4, 0 0 20px rgba(6, 182, 212, 0.8);
      opacity: 0;
      transition: opacity 0.2s ease, transform 0.05s ease-out, background-color 0.2s ease;
    }

    .cursor-dot.hovering {
      background: #a855f7;
      box-shadow: 0 0 14px #a855f7, 0 0 25px rgba(168, 85, 247, 0.9);
      transform: scale(1.6);
    }

    @media (pointer: coarse) {
      :host {
        display: none !important;
      }
    }
  `],
})
export class CustomCursorComponent implements AfterViewInit, OnDestroy {
    @ViewChild('trailCanvas', { static: true })
    private canvasRef!: ElementRef<HTMLCanvasElement>;

    @ViewChild('cursorDot', { static: true })
    private dotRef!: ElementRef<HTMLElement>;

    private ctx!: CanvasRenderingContext2D;
    private particles: TrailParticle[] = [];
    private palette = ['#06b6d4', '#6366f1', '#a855f7', '#38bdf8'];

    private mouseX = -100;
    private mouseY = -100;
    private prevMouseX = -100;
    private prevMouseY = -100;

    private isHovering = false;
    private frameId = 0;
    private cleanupFns: Array<() => void> = [];

    constructor(private readonly zone: NgZone) { }

    @HostListener('window:resize')
    onResize(): void {
        this.setupCanvas();
    }

    ngAfterViewInit(): void {
        if (!window.matchMedia('(pointer: fine)').matches) return;

        const canvas = this.canvasRef.nativeElement;
        this.ctx = canvas.getContext('2d')!;
        this.setupCanvas();

        const dot = this.dotRef.nativeElement;

        this.zone.runOutsideAngular(() => {
            const onMouseMove = (e: MouseEvent) => {
                this.prevMouseX = this.mouseX;
                this.prevMouseY = this.mouseY;
                this.mouseX = e.clientX;
                this.mouseY = e.clientY;

                dot.style.opacity = '1';
                dot.style.transform = `translate3d(${this.mouseX - 3}px, ${this.mouseY - 3}px, 0)`;

                // Detect interactive targets (buttons, links, glass cards, chips)
                const target = e.target as HTMLElement | null;
                this.isHovering = !!target?.closest('a, button, input, textarea, .glass-panel, .chips li, [role="button"]');

                if (this.isHovering) {
                    dot.classList.add('hovering');
                } else {
                    dot.classList.remove('hovering');
                }

                // Spawn particles along the mouse stroke
                const speed = Math.hypot(this.mouseX - this.prevMouseX, this.mouseY - this.prevMouseY);
                const spawnCount = Math.min(Math.floor(speed / 4) + 1, this.isHovering ? 5 : 3);

                for (let i = 0; i < spawnCount; i++) {
                    this.spawnParticle(this.mouseX, this.mouseY);
                }
            };

            const onMouseLeave = () => {
                dot.style.opacity = '0';
            };

            window.addEventListener('mousemove', onMouseMove, { passive: true });
            document.body.addEventListener('mouseleave', onMouseLeave);

            this.cleanupFns.push(
                () => window.removeEventListener('mousemove', onMouseMove),
                () => document.body.removeEventListener('mouseleave', onMouseLeave),
            );

            // 60FPS particle physics rendering loop
            const loop = () => {
                this.renderParticles();
                this.frameId = requestAnimationFrame(loop);
            };
            this.frameId = requestAnimationFrame(loop);
        });
    }

    ngOnDestroy(): void {
        cancelAnimationFrame(this.frameId);
        this.cleanupFns.forEach((fn) => fn());
    }

    private setupCanvas(): void {
        const canvas = this.canvasRef.nativeElement;
        canvas.width = window.innerWidth * window.devicePixelRatio;
        canvas.height = window.innerHeight * window.devicePixelRatio;
        this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    private spawnParticle(x: number, y: number): void {
        // Interpolate slight jitter for natural organic dispersion
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * (this.isHovering ? 1.8 : 0.8) + 0.2;

        this.particles.push({
            x: x + (Math.random() - 0.5) * 4,
            y: y + (Math.random() - 0.5) * 4,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - (this.isHovering ? 0.3 : 0.1), // slight upward float
            size: Math.random() * (this.isHovering ? 3.5 : 2.5) + 1.2,
            color: this.palette[Math.floor(Math.random() * this.palette.length)],
            alpha: 1,
            decay: Math.random() * 0.025 + 0.02, // Lifespan of each spark
        });

        // Limit maximum particles on screen for lightweight memory usage
        if (this.particles.length > 80) {
            this.particles.shift();
        }
    }

    private renderParticles(): void {
        this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];

            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= p.decay;

            if (p.alpha <= 0) {
                this.particles.splice(i, 1);
                continue;
            }

            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size * p.alpha, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.globalAlpha = p.alpha;
            this.ctx.shadowBlur = 8;
            this.ctx.shadowColor = p.color;
            this.ctx.fill();
            this.ctx.restore();
        }
    }
}