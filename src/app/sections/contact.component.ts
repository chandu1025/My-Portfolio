
import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { PROFILE } from '../data';
import { RevealDirective } from '../shared/reveal.directive';

// Your Formspree form ID (without spaces)
const FORMSPREE_ID = 'mwlvnrbv';
const FORM_ENDPOINT = `https://formspree.io/f/${FORMSPREE_ID}`;

type Status = 'idle' | 'sending' | 'sent' | 'error';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, RevealDirective],
  template: `
    <section id="contact" class="section contact">
      <div class="container contact-grid">

        <!-- Contact information -->
        <div class="contact-copy" appReveal>
          <h2>Let's build together.</h2>

          <p>
            Whether you are hiring for an Angular developer role or
            looking to build a custom web interface, feel free to reach out.
          </p>

          <ul class="contact-links">
            <li>
              <a [href]="'mailto:' + profile.email">
                <i class="bi bi-envelope" aria-hidden="true"></i>
                {{ profile.email }}
              </a>
            </li>

            <li>
              <a [href]="'tel:' + profile.phone">
                <i class="bi bi-telephone" aria-hidden="true"></i>
                {{ profile.phone }}
              </a>
            </li>

            @if (profile.whatsappNumber) {
              <li>
                <a
                  [href]="'https://wa.me/' + profile.whatsappNumber"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i class="bi bi-whatsapp" aria-hidden="true"></i>
                  WhatsApp
                </a>
              </li>
            }

            @if (profile.linkedin) {
              <li>
                <a
                  href="https://www.linkedin.com/in/gnana-chandra/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i class="bi bi-linkedin" aria-hidden="true"></i>
                  LinkedIn
                </a>
              </li>
            }

            @if (profile.github) {
              <li>
                <a
                  href="https://github.com/chandu1025"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i class="bi bi-github" aria-hidden="true"></i>
                  GitHub
                </a>
              </li>
            }

            @if (profile.instagram) {
              <li>
                <a
                  href="https://www.instagram.com/chandu_jetty/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i class="bi bi-instagram" aria-hidden="true"></i>
                  Instagram
                </a>
              </li>
            }
          </ul>

          <a class="btn btn-primary" [href]="profile.resume" download>
            <i class="bi bi-download" aria-hidden="true"></i>
            Download Resume
          </a>
        </div>

        <!-- Contact form -->
        <form
          class="contact-form glass-panel"
          [formGroup]="form"
          (ngSubmit)="submit()"
          novalidate
          appReveal
        >
          <div class="field">
            <label for="name">Your Name</label>

            <input
              id="name"
              type="text"
              formControlName="name"
              autocomplete="name"
              [attr.aria-invalid]="f.name.touched && f.name.invalid"
            />

            @if (f.name.touched && f.name.invalid) {
              <p class="field-error">
                Please enter your name (at least 2 characters).
              </p>
            }
          </div>

          <div class="field-row">
            <div class="field">
              <label for="email">Your Email</label>

              <input
                id="email"
                type="email"
                formControlName="email"
                autocomplete="email"
                [attr.aria-invalid]="f.email.touched && f.email.invalid"
              />

              @if (f.email.touched && f.email.invalid) {
                <p class="field-error">
                  Please enter a valid email address.
                </p>
              }
            </div>

            <div class="field">
              <label for="phone">
                Mobile Number <span class="optional">(optional)</span>
              </label>

              <input
                id="phone"
                type="tel"
                inputmode="tel"
                formControlName="phone"
                autocomplete="tel"
                placeholder="+91 98765 43210"
                [attr.aria-invalid]="f.phone.touched && f.phone.invalid"
              />

              @if (f.phone.touched && f.phone.invalid) {
                <p class="field-error">
                  Enter a valid phone number.
                </p>
              }
            </div>
          </div>

          <div class="field">
            <label for="message">Message</label>

            <textarea
              id="message"
              rows="5"
              formControlName="message"
              [attr.aria-invalid]="f.message.touched && f.message.invalid"
            ></textarea>

            @if (f.message.touched && f.message.invalid) {
              <p class="field-error">
                Please write at least 10 characters.
              </p>
            }
          </div>

          <!-- Honeypot field to discourage bots -->
          <input
            class="hp"
            type="text"
            formControlName="website"
            tabindex="-1"
            autocomplete="off"
            aria-hidden="true"
          />

          <button
            class="btn btn-primary"
            type="submit"
            [disabled]="status() === 'sending'"
          >
            <i class="bi bi-send" aria-hidden="true"></i>
            {{ status() === 'sending' ? 'Sending...' : 'Send Message' }}
          </button>

          <div role="status" aria-live="polite">
            @if (status() === 'sent') {
              <p class="form-note">
                Message sent. Thank you, I'll get back to you soon.
              </p>
            }

            @if (status() === 'error') {
              <p class="form-note error">
                The message didn't send. Please try again or email
                {{ profile.email }} directly.
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

    // Optional phone number: digits, spaces, hyphens and optional +
    phone: [
      '',
      [Validators.pattern(/^\+?[0-9][0-9\s-]{5,17}[0-9]$/)],
    ],

    message: ['', [Validators.required, Validators.minLength(10)]],

    // Honeypot: should remain empty
    website: [''],
  });

  get f() {
    return this.form.controls;
  }

  async submit(): Promise<void> {
    const v = this.form.getRawValue();

    // Silently reject submissions that fill the honeypot.
    if (v.website) {
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // Prevent duplicate submissions while a request is in progress.
    if (this.status() === 'sending') {
      return;
    }

    // Fallback if Formspree has not been configured.
    if (!FORMSPREE_ID || FORMSPREE_ID === 'mwlvnrbv') {
      const subject = encodeURIComponent(
        `Portfolio inquiry from ${v.name}`,
      );

      const body = encodeURIComponent(
        `${v.message}\n\nName: ${v.name}\nEmail: ${v.email}${
          v.phone ? `\nMobile: ${v.phone}` : ''
        }`,
      );

      window.location.href =
        `mailto:${this.profile.email}?subject=${subject}&body=${body}`;

      return;
    }

    this.status.set('sending');

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: v.name,
          email: v.email,
          phone: v.phone || 'Not provided',
          message: v.message,
          _subject: `Portfolio inquiry from ${v.name}`,
          _gotcha: v.website,
        }),
      });

      if (!response.ok) {
        throw new Error('Form submission failed');
      }

      this.status.set('sent');
      this.form.reset();
    } catch (error) {
      console.error('Contact form submission failed:', error);
      this.status.set('error');
    }
  }
}
