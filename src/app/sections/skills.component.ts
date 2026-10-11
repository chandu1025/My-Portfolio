import { Component } from '@angular/core';
import { SKILLS } from '../data';

@Component({
  selector: 'app-skills',
  standalone: true,
  template: `
    <section id="skills" class="section skills">
      <div class="container">
        <h2>What I work with.</h2>
        <div class="skill-grid">
          @for (group of skills; track group.title) {
            <article class="skill-card" [class.featured]="group.featured">
              <h3>{{ group.title }}</h3>
              <ul class="chips">
                @for (item of group.items; track item) {
                  <li>{{ item }}</li>
                }
              </ul>
            </article>
          }
        </div>
      </div>
    </section>
  `,
})
export class SkillsComponent {
  readonly skills = SKILLS;
}
