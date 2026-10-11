import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, ViewChild } from '@angular/core';
import { PROFILE } from '../data';

@Component({
  selector: 'app-hero',
  standalone: true,
  template: `
    <section id="top" class="hero" #hero>
      <div class="hero-glow-1"></div>
      <div class="hero-glow-2"></div>

      <div class="container hero-inner">
        <div class="status-badge">
          <span class="pulse-dot"></span>
          Available for Full-Time Roles & Freelance Projects
        </div>

        <h1 class="hero-title">
          Hi, I'm <span class="gradient-text">{{ profile.shortName }}</span>
        </h1>

        <p class="hero-role">
          Angular Frontend Developer based in Tirupati. Trained as an electronics engineer,
          now crafting performant, reactive web applications with Angular 19 and TypeScript.
        </p>

        <div class="hero-actions">
          <a class="btn btn-primary" [href]="profile.resume" download>Download Resume</a>
          <a class="btn btn-ghost" href="#contact">Get in Touch</a>
        </div>
      </div>

      <canvas #waveCanvas class="wave-canvas"></canvas>
    </section>
  `,
})
export class HeroComponent implements AfterViewInit, OnDestroy {
  readonly profile = PROFILE;

  @ViewChild('waveCanvas', { static: true })
  private canvasRef!: ElementRef<HTMLCanvasElement>;

  private frame = 0;
  private width = 0;
  private height = 140;
  private mouseX = 0.5;

  constructor(private readonly zone: NgZone) {}

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      this.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.width = this.width * window.devicePixelRatio;
      canvas.height = this.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resize();
    window.addEventListener('resize', resize);

    window.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX / window.innerWidth;
    });

    this.zone.runOutsideAngular(() => {
      let t = 0;
      const render = () => {
        t += 0.02;
        ctx.clearRect(0, 0, this.width, this.height);

        // Multi-frequency wave drawing
        ctx.beginPath();
        ctx.lineWidth = 2.5;

        const grad = ctx.createLinearGradient(0, 0, this.width, 0);
        grad.addColorStop(0, '#6366f1');
        grad.addColorStop(0.5, '#06b6d4');
        grad.addColorStop(1, 'rgba(99, 102, 241, 0.1)');
        ctx.strokeStyle = grad;

        const mid = this.height / 2;
        for (let x = 0; x <= this.width; x += 6) {
          const envelope = Math.sin((x / this.width) * Math.PI);
          const y =
            mid +
            envelope *
              (Math.sin(x * 0.012 + t + this.mouseX * 3) * 22 +
                Math.sin(x * 0.028 - t * 0.8) * 12);

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        this.frame = requestAnimationFrame(render);
      };
      this.frame = requestAnimationFrame(render);
    });
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.frame);
  }
}