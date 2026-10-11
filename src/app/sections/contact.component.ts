import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PROFILE } from '../data';
import { RevealDirective } from '../shared/reveal.directive';

const FORM_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';

type Status = 'idle' | 'sending' | 'sent' | 'error';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, RevealDirective],
  template: `
    <section id="contact" class="section contact">
      <div class="container contact-grid">
        <div class="contact-copy" appReveal>
          <h2>Let's build together.</h2>
          <p>
            Whether you are hiring for an Angular developer role or looking to build a custom web interface, feel free to reach out.
          </p>
          <ul class="contact-links">
            <li><a [href]="'mailto:' + profile.email">✉ {{ profile.email }}</a></li>
            <li><a [href]="'tel:' + profile.phone">☏ {{ profile.phone }}</a></li>
            <li><a [href]="profile.linkedin" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a></li>
            <li><a [href]="profile.github" target="_blank" rel="noopener noreferrer">GitHub ↗</a></li>
          </ul>
          <a class="btn btn-primary" [href]="profile.resume" download>Download Resume</a>
        </div>

        <form class="contact-form glass-panel" [formGroup]="form" (ngSubmit)="submit()" novalidate appReveal>
          <div class="field">
            <label for="name">Your Name</label>
            <input id="name" type="text" formControlName="name" autocomplete="name" />
            @if (f.name.touched && f.name.invalid) {
              <p class="field-error">Please enter your name.</p>
            }
          </div>

          <div class="field">
            <label for="email">Your Email</label>
            <input id="email" type="email" formControlName="email" autocomplete="email" />
            @if (f.email.touched && f.email.invalid) {
              <p class="field-error">Please enter a valid email address.</p>
            }
          </div>

          <div class="field">
            <label for="message">Message</label>
            <textarea id="message" rows="5" formControlName="message"></textarea>
            @if (f.message.touched && f.message.invalid) {
              <p class="field-error">Please write at least 10 characters.</p>
            }
          </div>

          <button class="btn btn-primary" type="submit" [disabled]="status() === 'sending'">
            {{ status() === 'sending' ? 'Sending...' : 'Send Message' }}
          </button>

          <div role="status" aria-live="polite">
            @if (status() === 'sent') {
              <p class="form-note">Message sent successfully. I'll get back to you soon.</p>
            }
            @if (status() === 'error') {
              <p class="form-note error">Message failed to send. Please email {{ profile.email }} directly.</p>
            }
          </div>
        </form>
      </div>
    </section>
  `,
})
export class ContactComponent {
  private readonly fb = inject(FormBuilder);
  readonly profile = PROFILE;
  readonly status = signal<Status>('idle');

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  get f() {
    return this.form.controls;
  }

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();

    if (FORM_ENDPOINT.includes('YOUR_FORM_ID')) {
      const subject = encodeURIComponent(`Portfolio inquiry from ${value.name}`);
      const body = encodeURIComponent(`${value.message}\n\nFrom: ${value.name} (${value.email})`);
      window.location.href = `mailto:${this.profile.email}?subject=${subject}&body=${body}`;
      this.status.set('sent');
      return;
    }

    this.status.set('sending');
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(value),
      });
      if (!res.ok) throw new Error('Request failed');
      this.status.set('sent');
      this.form.reset();
    } catch {
      this.status.set('error');
    }
  }
}