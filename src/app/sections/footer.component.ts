import { Component } from '@angular/core';
import { PROFILE } from '../data';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="site-footer on-dark">
      <div class="container footer-inner">
        <p>&copy; {{ year }} {{ profile.fullName }}. Built with Angular 19.</p>

<div class="footer-socials">
  @if (profile.github) {
    <a [href]="profile.github" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><i class="bi bi-github"></i></a>
  }
  @if (profile.linkedin) {
    <a [href]="profile.linkedin" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i class="bi bi-linkedin"></i></a>
  }
  @if (profile.whatsappNumber) {
    <a [href]="'https://wa.me/' + profile.whatsappNumber" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><i class="bi bi-whatsapp"></i></a>
  }
  @if (profile.instagram) {
    <a [href]="profile.instagram" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i class="bi bi-instagram"></i></a>
  }
</div>

        <a href="#top">Back to top</a>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  readonly profile = PROFILE;
  readonly year = new Date().getFullYear();
}