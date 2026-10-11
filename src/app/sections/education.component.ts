import { Component } from '@angular/core';
import { CERTIFICATION, EDUCATION } from '../data';

@Component({
  selector: 'app-education',
  standalone: true,
  template: `
    <section id="education" class="section education">
      <div class="container">
        <h2>Education and certification.</h2>
        <ul class="edu-list">
          @for (item of education; track item.title) {
            <li>
              <p class="edu-period">{{ item.period }}</p>
              <div>
                <h3>{{ item.title }}</h3>
                <p>{{ item.place }}</p>
                <p class="edu-score">{{ item.score }}</p>
              </div>
            </li>
          }
          <li>
            <p class="edu-period">{{ certification.date }}</p>
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
