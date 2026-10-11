import { Component } from '@angular/core';
import { PROJECTS, SITES } from '../data';

@Component({
  selector: 'app-work',
  standalone: true,
  template: `
    <section id="work" class="section work">
      <div class="container">
        <h2>Things I've built.</h2>

        <div class="projects">
          @for (project of projects; track project.title) {
            <article class="project">
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

        <h3 class="sub-heading">Live websites</h3>
        <p class="sub-intro">Freelance WordPress projects you can open right now.</p>

        <div class="sites">
          @for (site of sites; track site.url) {
            <article class="site-card">
              <div class="browser" aria-hidden="true">
                <div class="browser-bar">
                  <i></i><i></i><i></i>
                  <span>{{ site.host }}</span>
                </div>
                <div class="browser-body">
                  @if (site.image) {
                    <img [src]="site.image" alt="" loading="lazy" />
                  } @else {
                    <span>{{ site.name }}</span>
                  }
                </div>
              </div>
              <div class="site-info">
                <h4>{{ site.kind }}</h4>
                <p>{{ site.summary }}</p>
                <a class="btn btn-ghost" [href]="site.url" target="_blank" rel="noopener noreferrer">
                  Visit {{ site.host }}
                  <span class="visually-hidden">(opens in a new tab)</span>
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
