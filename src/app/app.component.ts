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
import { CustomCursorComponent } from './shared/custom-cursor.component';
import { ZenGameModalComponent } from './shared/zen-game-modal.component'; // <-- 1. Import Zen modal

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CustomCursorComponent,
    ParticleCanvasComponent,
    ZenGameModalComponent,      // <-- 2. Register
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
    <app-custom-cursor />
    <app-particle-canvas />
    <app-zen-game-modal />     <!-- 3. Add Component -->
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