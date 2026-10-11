import { Component } from '@angular/core';
import { PROFILE } from '../data';

@Component({
  selector: 'app-about',
  standalone: true,
  template: `
    <section id="about" class="section about">
      <div class="container about-grid">
        <h2>From signals to screens.</h2>
        <div class="about-body">
          <p>
            I studied Electronics and Communication Engineering, then moved into web development. Today I build Angular 19
            and TypeScript interfaces at Intelizest Consulting: components, services, routing, forms with validation and
            REST API integration.
          </p>
          <p>
            Before that I spent six months as a web developer intern at astTECS, building PHP and MySQL applications with
            login systems and data modules. I also build WordPress websites for small businesses as a freelancer, and I
            keep exploring new AI tools.
          </p>
          <dl class="facts">
            <div>
              <dt>Based in</dt>
              <dd>{{ profile.location }}</dd>
            </div>
            <div>
              <dt>Currently</dt>
              <dd>Angular Frontend Developer at Intelizest Consulting</dd>
            </div>
            <div>
              <dt>Background</dt>
              <dd>B.Tech in Electronics and Communication Engineering</dd>
            </div>
            <div>
              <dt>Also</dt>
              <dd>Freelance WordPress developer</dd>
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
