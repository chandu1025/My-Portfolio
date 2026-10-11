import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PROFILE } from '../data';

/**
 * To receive messages straight to your inbox, create a free form at https://formspree.io,
 * then replace YOUR_FORM_ID below. Until then, the form opens the visitor's email app instead.
 */
const FORM_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';

type Status = 'idle' | 'sending' | 'sent' | 'error';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <section id="contact" class="section contact on-dark">
      <div class="container contact-grid">
        <div class="contact-copy">
          <h2>Let's work together.</h2>
          <p>
            Hiring for an Angular role, or need a website for your business? Send a message and I'll reply by email.
          </p>
          <ul class="contact-links">
            <li><a [href]="'mailto:' + profile.email">{{ profile.email }}</a></li>
            <li><a [href]="'tel:' + profile.phone">{{ profile.phone }}</a></li>
            <li><a [href]="profile.linkedin" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
            <li><a [href]="profile.github" target="_blank" rel="noopener noreferrer">GitHub</a></li>
          </ul>
          <a class="btn btn-sun" [href]="profile.resume" download>Download resume</a>
        </div>

        <form class="contact-form" [formGroup]="form" (ngSubmit)="submit()" novalidate>
          <div class="field">
            <label for="name">Your name</label>
            <input id="name" type="text" formControlName="name" autocomplete="name"
                   [attr.aria-invalid]="f.name.touched && f.name.invalid" />
            @if (f.name.touched && f.name.invalid) {
              <p class="field-error">Enter your name.</p>
            }
          </div>

          <div class="field">
            <label for="email">Your email</label>
            <input id="email" type="email" formControlName="email" autocomplete="email"
                   [attr.aria-invalid]="f.email.touched && f.email.invalid" />
            @if (f.email.touched && f.email.invalid) {
              <p class="field-error">Enter a valid email address, like name&#64;example.com.</p>
            }
          </div>

          <div class="field">
            <label for="message">Message</label>
            <textarea id="message" rows="5" formControlName="message"
                      [attr.aria-invalid]="f.message.touched && f.message.invalid"></textarea>
            @if (f.message.touched && f.message.invalid) {
              <p class="field-error">Write at least 10 characters.</p>
            }
          </div>

          <button class="btn btn-sun" type="submit" [disabled]="status() === 'sending'">
            {{ status() === 'sending' ? 'Sending...' : 'Send message' }}
          </button>

          <div role="status" aria-live="polite">
            @if (status() === 'sent') {
              <p class="form-note">Message ready. Thanks for reaching out.</p>
            }
            @if (status() === 'error') {
              <p class="form-note error">
                The message didn't send. Try again, or email {{ profile.email }} directly.
              </p>
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
      const subject = encodeURIComponent(`Portfolio message from ${value.name}`);
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
