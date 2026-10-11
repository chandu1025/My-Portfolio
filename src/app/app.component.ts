import { Component } from '@angular/core';
import { HeaderComponent } from './sections/header.component';
import { HeroComponent } from './sections/hero.component';
import { AboutComponent } from './sections/about.component';
import { SkillsComponent } from './sections/skills.component';
import { ExperienceComponent } from './sections/experience.component';
import { WorkComponent } from './sections/work.component';
import { EducationComponent } from './sections/education.component';
import { ContactComponent } from './sections/contact.component';
import { FooterComponent } from './sections/footer.component';
import { ParticleCanvasComponent } from './shared/particle-canvas.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    ParticleCanvasComponent,
    HeaderComponent,
    HeroComponent,
    AboutComponent,
    SkillsComponent,
    ExperienceComponent,
    WorkComponent,
    EducationComponent,
    ContactComponent,
    FooterComponent,
  ],
  template: `
    <app-particle-canvas />
    <a class="skip-link" href="#about">Skip to content</a>
    <app-header />
    <main style="position: relative; z-index: 1;">
      <app-hero />
      <app-about />
      <app-skills />
      <app-experience />
      <app-work />
      <app-education />
      <app-contact />
    </main>
    <app-footer />
  `,
})
export class AppComponent {}