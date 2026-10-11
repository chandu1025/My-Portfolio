import { Component } from '@angular/core';
import { CERTIFICATION, EDUCATION } from '../data';
import { RevealDirective } from '../shared/reveal.directive';

@Component({
  selector: 'app-education',
  standalone: true,
  imports: [RevealDirective],
  template: `
    <section id="education" class="section education">
      <div class="container">
        <div appReveal>
          <h2>Education & certification.</h2>
        </div>
        <ul class="edu-list">
          @for (item of education; track item.title) {
            <li class="edu-item glass-panel" appReveal>
              <span class="edu-period">{{ item.period }}</span>
              <div>
                <h3>{{ item.title }}</h3>
                <p>{{ item.place }}</p>
                <p class="edu-score">{{ item.score }}</p>
              </div>
            </li>
          }
          <li class="edu-item glass-panel" appReveal>
            <span class="edu-period">{{ certification.date }}</span>
            <div>
              <h3>{{ certification.title }}</h3>
              <p>{{ certification.issuer }}</p>
              <p class="edu-score">Certification</p>
            </div>
          </li>
        </ul>
      </div>
    </section>
  `,
})
export class EducationComponent {
  readonly education = EDUCATION;
  readonly certification = CERTIFICATION;
}