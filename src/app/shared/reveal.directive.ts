import { AfterViewInit, Directive, ElementRef, HostListener, OnDestroy } from '@angular/core';

@Directive({ selector: '[appReveal]', standalone: true })
export class RevealDirective implements AfterViewInit, OnDestroy {
  private observer?: IntersectionObserver;

  constructor(private readonly el: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    const node = this.el.nativeElement;
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
      { threshold: 0.12 }
    );
    this.observer.observe(node);
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(e: MouseEvent): void {
    const rect = this.el.nativeElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    this.el.nativeElement.style.setProperty('--mouse-x', `${x}px`);
    this.el.nativeElement.style.setProperty('--mouse-y', `${y}px`);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}