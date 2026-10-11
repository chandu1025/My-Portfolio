import { Component } from '@angular/core';
import { PROJECTS, SITES } from '../data';
import { RevealDirective } from '../shared/reveal.directive';
import { Tilt3dDirective } from '../shared/tilt-3d.directive';

@Component({
  selector: 'app-work',
  standalone: true,
  imports: [RevealDirective, Tilt3dDirective],
  template: `
    <section id="work" class="section work">
      <div class="container">
        <div appReveal>
          <h2>Featured projects.</h2>
        </div>

        <div class="projects">
          @for (project of projects; track project.title) {
            <!-- 3D Gyroscope tilt attached here -->
            <article class="project glass-panel" appReveal appTilt3d [maxTilt]="14">
              <div class="project-head">
                <h3>{{ project.title }}</h3>
                <p>{{ project.summary }}</p>
                <ul class="chips">
                  @for (tech of project.stack; track tech) {
                    <li>{{ tech }}</li>
                  }
                </ul>
              </div>
              <ul class="project-points">
                @for (point of project.points; track point) {
                  <li>{{ point }}</li>
                }
              </ul>
            </article>
          }
        </div>

        <div appReveal>
          <h3 class="sub-heading">Live websites</h3>
          <p class="sub-intro">Production client sites built and delivered for small businesses.</p>
        </div>

        <div class="sites">
          @for (site of sites; track site.url) {
            <article class="site-card glass-panel" appReveal appTilt3d [maxTilt]="12">
              <div class="browser-bar">
                <i></i><i></i><i></i>
                <span>{{ site.host }}</span>
              </div>
              <div class="site-info">
                <h4>{{ site.name }}</h4>
                <p>{{ site.summary }}</p>
                <a class="btn btn-ghost" [href]="site.url" target="_blank" rel="noopener noreferrer">
                  Visit Website ↗
                </a>
              </div>
            </article>
          }
        </div>
      </div>
    </section>
  `,
})
export class WorkComponent {
  readonly projects = PROJECTS;
  readonly sites = SITES;
}