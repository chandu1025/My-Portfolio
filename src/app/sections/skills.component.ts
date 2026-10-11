import { Component } from '@angular/core';
import { SKILLS } from '../data';
import { RevealDirective } from '../shared/reveal.directive';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [RevealDirective],
  template: `
    <section id="skills" class="section skills">
      <div class="container">
        <div appReveal>
          <h2>Technical skill set.</h2>
        </div>
        <div class="skill-grid">
          @for (group of skills; track group.title) {
            <article class="skill-card glass-panel" [class.featured]="group.featured" appReveal>
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