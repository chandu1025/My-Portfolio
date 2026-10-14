import { Component } from '@angular/core';
import { PROFILE } from '../data';
import { RevealDirective } from '../shared/reveal.directive';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RevealDirective],
  template: `
    <section id="about" class="section about">
      <div class="container about-grid">
        <div appReveal>
          <h2>From signals to clean code.</h2>
        </div>
        <div class="about-body glass-panel" style="padding: 2.25rem;" appReveal>
          <p>
            I completed my B.Tech in Electronics and Communication Engineering, transitioning directly
            into web software engineering. Today I build production frontend architectures at Intelizest Consulting:
            creating reactive components, modular services, client-side routing, and robust form validation connected to REST APIs.
          </p>
          <p>
            Prior to my current position, I completed a six-month web development internship at astTECS developing
            PHP and MySQL web portals, authentication systems, and database workflows. I also develop responsive
            WordPress client sites and explore AI tools to accelerate development velocity.
          </p>
          <dl class="facts">
            <div>
<dt><i class="bi bi-geo-alt" aria-hidden="true"></i>Location</dt>
              <dd>{{ profile.location }}</dd>
            </div>
            <div>
<dt><i class="bi bi-briefcase" aria-hidden="true"></i>Current Role</dt>
              <dd>Angular Frontend Developer at Intelizest</dd>
            </div>
            <div>
<dt><i class="bi bi-mortarboard" aria-hidden="true"></i>Engineering Degree</dt>
              <dd>B.Tech in Electronics & Communication</dd>
            </div>
            <div>
<dt><i class="bi bi-hammer" aria-hidden="true"></i>Freelance</dt>
              <dd>Web & WordPress Solutions</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  `,
})
export class AboutComponent {
  readonly profile = PROFILE;
}