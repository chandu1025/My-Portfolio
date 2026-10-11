import { Component } from '@angular/core';
import { PROFILE } from '../data';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="site-footer on-dark">
      <div class="container footer-inner">
        <p>&copy; {{ year }} {{ profile.fullName }}. Built with Angular 19.</p>
        <a href="#top">Back to top</a>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  readonly profile = PROFILE;
  readonly year = new Date().getFullYear();
}
