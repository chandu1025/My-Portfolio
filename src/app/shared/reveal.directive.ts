import { AfterViewInit, Directive, ElementRef, Input, NgZone, OnDestroy } from '@angular/core';

@Directive({ selector: '[appReveal]', standalone: true })
export class RevealDirective implements AfterViewInit, OnDestroy {
  @Input('appReveal') variant = '';   // 'left' | 'right' | 'zoom' | '' (up)
  @Input() revealDelay = 0;           // ms, for staggering

  private observer?: IntersectionObserver;
  private cleanup?: () => void;

  constructor(private readonly el: ElementRef<HTMLElement>, private readonly zone: NgZone) {}

  ngAfterViewInit(): void {
    const node = this.el.nativeElement;
    node.dataset['reveal'] = this.variant || 'up';
    node.style.setProperty('--d', `${this.revealDelay}ms`);
    node.classList.add('reveal');

    if (typeof IntersectionObserver === 'undefined') {
      node.classList.add('revealed');
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          node.classList.add('revealed');
          this.observer?.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    this.observer.observe(node);

    // Spotlight follows the mouse without triggering Angular change detection
    this.zone.runOutsideAngular(() => {
      const move = (e: MouseEvent) => {
        const r = node.getBoundingClientRect();
        node.style.setProperty('--mouse-x', `${e.clientX - r.left}px`);
        node.style.setProperty('--mouse-y', `${e.clientY - r.top}px`);
      };
      node.addEventListener('mousemove', move, { passive: true });
      this.cleanup = () => node.removeEventListener('mousemove', move);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.cleanup?.();
  }
}