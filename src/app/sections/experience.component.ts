import { Component } from '@angular/core';
import { JOBS } from '../data';
import { RevealDirective } from '../shared/reveal.directive';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [RevealDirective],
  template: `
    <section id="experience" class="section experience">
      <div class="container">
        <div appReveal>
          <h2>Where I've worked.</h2>
        </div>
        <div class="timeline">
          @for (job of jobs; track job.company) {
            <article class="job glass-panel" appReveal>
              <header>
                <h3>{{ job.role }}</h3>
                <p class="job-meta">
                  <strong>{{ job.company }}</strong>
                  @if (job.place) {
                    <span>• {{ job.place }}</span>
                  }
                  <span>• {{ job.period }}</span>
                  @if (job.current) {
                    <span class="badge">Current Role</span>
                  }
                </p>
              </header>
              <ul>
                @for (point of job.points; track point) {
                  <li>{{ point }}</li>
                }
              </ul>
            </article>
          }
        </div>
      </div>
    </section>
  `,
})
export class ExperienceComponent {
  readonly jobs = JOBS;
}