import { AfterViewInit, Component, HostListener, OnDestroy, signal } from '@angular/core';
import { PROFILE } from '../data';


@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <header class="site-header" [class.scrolled]="scrolled()" [class.menu-open]="open()">
      <div class="container header-inner">
        <a class="brand" href="#top" (click)="close()" aria-label="Gnana Chandra, back to top">
  <span class="brand-mark">
    @if (!photoFailed()) {
      <img src="profile.png" alt="" (error)="photoFailed.set(true)" />
    } @else {
      <span aria-hidden="true">GC</span>
    }
  </span> 
         <span class="brand-name">{{ profile.shortName }}</span>
        </a>

        <nav id="primary-nav" class="nav" [class.open]="open()" aria-label="Primary">
          @for (link of links; track link.id) {
            <a [href]="'#' + link.id" [class.active]="active() === link.id" (click)="close()">{{ link.label }}</a>
          }
          <a class="btn btn-sun nav-resume" [href]="profile.resume" download>Download resume</a>
        </nav>

        <button
          class="menu-btn"
          type="button"
          (click)="toggle()"
          [attr.aria-expanded]="open()"
          aria-controls="primary-nav"
          aria-label="Toggle menu"
        >
          <span></span><span></span>
        </button>
      </div>
    </header>
  `,
})
export class HeaderComponent implements AfterViewInit, OnDestroy {
  readonly photoFailed = signal(false);
  readonly profile = PROFILE;
  readonly links = [
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'experience', label: 'Experience' },
    { id: 'work', label: 'Work' },
    { id: 'education', label: 'Education' },
    { id: 'contact', label: 'Contact' },
  ];

  readonly scrolled = signal(false);
  readonly open = signal(false);
  readonly active = signal('');

  private observer?: IntersectionObserver;

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 24);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close();
  }

  ngAfterViewInit(): void {
    this.onScroll();
    if (typeof IntersectionObserver === 'undefined') return;
    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) this.active.set(entry.target.id);
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    document.querySelectorAll('main section[id]').forEach((s) => this.observer?.observe(s));
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  toggle(): void {
    this.open.update((v) => !v);
  }

  close(): void {
    this.open.set(false);
  }
}

