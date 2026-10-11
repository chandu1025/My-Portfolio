import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, ViewChild } from '@angular/core';
import { PROFILE } from '../data';

@Component({
  selector: 'app-hero',
  standalone: true,
  template: `
    <section id="top" class="hero on-dark" #hero>
      <div class="container hero-inner">
        <p class="status hero-after">
          <span class="status-dot" aria-hidden="true"></span>
          Open to full-time roles and freelance projects
        </p>

        <h1 class="hero-name">
          <span class="visually-hidden">{{ profile.shortName }}</span>
          <span class="line" aria-hidden="true"><span>Gnana</span></span>
          <span class="line" aria-hidden="true"><span>Chandra</span></span>
        </h1>

        <p class="hero-role hero-after">
          Angular frontend developer in Tirupati. Trained as an electronics engineer, now building fast, responsive
          interfaces with Angular 19 and TypeScript.
        </p>

        <div class="hero-actions hero-after">
          <a class="btn btn-sun" [href]="profile.resume" download>Download resume</a>
          <a class="btn btn-ghost" href="#contact">Contact me</a>
        </div>
      </div>

      <svg class="wave" #svg aria-hidden="true" focusable="false">
        <path #wave pathLength="1" d="M0 75 L1200 75" />
      </svg>
    </section>
  `,
})
export class HeroComponent implements AfterViewInit, OnDestroy {
  readonly profile = PROFILE;

  @ViewChild('hero', { static: true }) private heroRef!: ElementRef<HTMLElement>;
  @ViewChild('svg', { static: true }) private svgRef!: ElementRef<SVGSVGElement>;
  @ViewChild('wave', { static: true }) private waveRef!: ElementRef<SVGPathElement>;

  private frame = 0;
  private amp = 1;
  private targetAmp = 1;
  private phase = 0;
  private width = 0;
  private readonly height = 150;
  private cleanup: Array<() => void> = [];

  constructor(private readonly zone: NgZone) {}

  ngAfterViewInit(): void {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.draw(0);
    if (reduce) return;

    this.zone.runOutsideAngular(() => {
      const hero = this.heroRef.nativeElement;

      const onMove = (e: PointerEvent) => {
        const rect = hero.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        this.targetAmp = 0.7 + (1 - py) * 1.1;
        this.phase = px * 6;
      };
      const onLeave = () => {
        this.targetAmp = 1;
      };
      hero.addEventListener('pointermove', onMove);
      hero.addEventListener('pointerleave', onLeave);
      this.cleanup.push(() => hero.removeEventListener('pointermove', onMove));
      this.cleanup.push(() => hero.removeEventListener('pointerleave', onLeave));

      const loop = (t: number) => {
        if (window.scrollY < window.innerHeight) {
          this.amp += (this.targetAmp - this.amp) * 0.06;
          this.draw(t);
        }
        this.frame = requestAnimationFrame(loop);
      };
      this.frame = requestAnimationFrame(loop);
    });
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.frame);
    this.cleanup.forEach((fn) => fn());
  }

  /** A busy signal on the left that settles into a clean flat line on the right. */
  private draw(t: number): void {
    const w = document.documentElement.clientWidth || 1200;
    if (w !== this.width) {
      this.width = w;
      this.svgRef.nativeElement.setAttribute('viewBox', `0 0 ${w} ${this.height}`);
    }
    const mid = this.height / 2;
    let d = '';
    for (let x = 0; x <= w; x += 5) {
      const envelope = 1 - this.smoothstep(0.3, 0.92, x / w);
      const y =
        mid +
        envelope *
          this.amp *
          (Math.sin(x * 0.018 + t * 0.0017 + this.phase) * 30 +
            Math.sin(x * 0.047 - t * 0.0011) * 14 +
            Math.sin(x * 0.11 + t * 0.0023) * 5);
      d += (x === 0 ? 'M' : 'L') + x + ' ' + y.toFixed(1);
    }
    this.waveRef.nativeElement.setAttribute('d', d);
  }

  private smoothstep(a: number, b: number, x: number): number {
    const k = Math.min(1, Math.max(0, (x - a) / (b - a)));
    return k * k * (3 - 2 * k);
  }
}
