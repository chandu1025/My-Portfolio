import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appTilt3d]',
  standalone: true,
})
export class Tilt3dDirective {
  @Input() maxTilt = 18; // Max rotation angle in degrees
  @Input() perspective = 1000;

  private card: HTMLElement;

  constructor(private el: ElementRef<HTMLElement>) {
    this.card = this.el.nativeElement;
    this.card.style.transformStyle = 'preserve-3d';
    this.card.style.transition = 'transform 0.15s ease-out, box-shadow 0.25s ease';
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(e: MouseEvent): void {
    const rect = this.card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -this.maxTilt;
    const rotateY = ((x - centerX) / centerX) * this.maxTilt;

    this.card.style.transform = `perspective(${this.perspective}px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.03, 1.03, 1.03)`;

    // Calculate light reflection flare coordinate
    const flareX = (x / rect.width) * 100;
    const flareY = (y / rect.height) * 100;
    this.card.style.setProperty('--flare-x', `${flareX}%`);
    this.card.style.setProperty('--flare-y', `${flareY}%`);
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.card.style.transform = `perspective(${this.perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    this.card.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
  }

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.card.style.transition = 'transform 0.1s ease-out';
  }
}