import { NgFor, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { Component, Input } from '@angular/core';

type SocialIcon = 'x' | 'linkedin' | 'facebook' | 'instagram' | 'youtube';

export interface SocialGlassLink {
  label: string;
  href: string;
  icon: SocialIcon;
}

@Component({
  selector: 'app-social-glass-bar',
  standalone: true,
  imports: [NgFor, NgSwitch, NgSwitchCase, NgSwitchDefault],
  template: `
    <div class="social-bar-wrapper">
      <nav class="social-glass-bar" aria-label="Social links">
        <a
          *ngFor="let link of links; trackBy: trackByHref"
          class="social-link"
          [href]="link.href"
          [attr.aria-label]="link.label"
        >
          <span class="social-icon" aria-hidden="true">
            <ng-container [ngSwitch]="link.icon">
              <svg *ngSwitchCase="'x'" viewBox="0 0 24 24" focusable="false">
                <path d="M4 4h4.1l4.1 5.7L16.9 4H20l-6.5 8.3L20 20h-4.1l-4.4-6.1L6.4 20H4l6.8-8.6L4 4Zm4.8 0L15 12.1 19.2 4h-2.4l-4 5.5L6.2 4H4.8Z"></path>
              </svg>
              <svg *ngSwitchCase="'linkedin'" viewBox="0 0 24 24" focusable="false">
                <path d="M6.1 8.5H3.6V20h2.5V8.5ZM4.8 3.4A1.6 1.6 0 1 0 4.8 6.6 1.6 1.6 0 0 0 4.8 3.4ZM20.4 20h-2.5v-5.7c0-1.5-.1-3.3-2.1-3.3s-2.4 1.6-2.4 3.2V20h-2.5V8.5h2.4v1.6h.1c.4-.8 1.5-1.7 3-1.7 3.2 0 3.8 2.1 3.8 4.9V20Z"></path>
              </svg>
              <svg *ngSwitchCase="'facebook'" viewBox="0 0 24 24" focusable="false">
                <path d="M14.2 8.2h2.2V5.1c-.4-.1-1.6-.2-2.9-.2-2.8 0-4.7 1.7-4.7 4.9V12H6.4v3.2h2.4V20h3.2v-4.8h2.6l.4-3.2h-3v-1.9c0-.9.2-1.5 1.6-1.5Z"></path>
              </svg>
              <svg *ngSwitchCase="'instagram'" viewBox="0 0 24 24" focusable="false">
                <path d="M7.4 3h9.2A4.4 4.4 0 0 1 21 7.4v9.2A4.4 4.4 0 0 1 16.6 21H7.4A4.4 4.4 0 0 1 3 16.6V7.4A4.4 4.4 0 0 1 7.4 3Zm0 2A2.4 2.4 0 0 0 5 7.4v9.2A2.4 2.4 0 0 0 7.4 19h9.2a2.4 2.4 0 0 0 2.4-2.4V7.4A2.4 2.4 0 0 0 16.6 5H7.4Zm4.6 2.2A5.4 5.4 0 1 1 12 18.4a5.4 5.4 0 0 1 0-10.8Zm0 2A3.4 3.4 0 1 0 12 16.6a3.4 3.4 0 0 0 0-6.8Zm5.4-.8a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2Z"></path>
              </svg>
              <svg *ngSwitchCase="'youtube'" viewBox="0 0 24 24" focusable="false">
                <path d="M21.8 7.6a2.8 2.8 0 0 0-2-2C18 5.1 12 5.1 12 5.1s-6 0-7.8.5a2.8 2.8 0 0 0-2 2A29 29 0 0 0 2 12a29 29 0 0 0 .2 4.4 2.8 2.8 0 0 0 2 2c1.8.5 7.8.5 7.8.5s6 0 7.8-.5a2.8 2.8 0 0 0 2-2A29 29 0 0 0 22 12a29 29 0 0 0-.2-4.4ZM10 15.1V8.9l5.4 3.1L10 15.1Z"></path>
              </svg>
              <svg *ngSwitchDefault viewBox="0 0 24 24" focusable="false">
                <path d="M12 4l8 8-8 8-8-8 8-8Z"></path>
              </svg>
            </ng-container>
          </span>
        </a>
      </nav>
    </div>
  `,
  styles: [`
    :host {
      position: fixed;
      top: 50%;
      right: 8px;
      left: auto;
      z-index: 60;
      display: block;
      transform: translateY(-50%);
      color-scheme: light;
      --bar-glow: rgba(111, 50, 152, 0.08);
      --icon-color: #364152;
      --icon-hover-color: #1f2937;
      --icon-surface: rgba(255, 255, 255, 0.5);
      --icon-border: rgba(255, 255, 255, 0.7);
      overflow: hidden;
    }

    .social-bar-wrapper {
      overflow: hidden !important;
      scrollbar-width: none;
      -ms-overflow-style: none;
    }

    .social-bar-wrapper::-webkit-scrollbar {
      display: none;
    }

    .social-glass-bar {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      width: 44px;
      padding: 7px 3px;
      border: 1px solid rgba(255, 255, 255, 0.82);
      border-radius: 999px;
      background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.42), rgba(255, 255, 255, 0.16) 48%, rgba(255, 255, 255, 0.1)),
        linear-gradient(135deg, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.04) 52%, rgba(255, 255, 255, 0.14));
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.82),
        inset 0 -1px 0 rgba(255, 255, 255, 0.22),
        inset 0 0 0 1px rgba(255, 255, 255, 0.16),
        inset 0 0 22px rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(16px) saturate(155%);
      -webkit-backdrop-filter: blur(16px) saturate(155%);
      position: relative;
      overflow: hidden;
      scrollbar-width: none;
      -ms-overflow-style: none;
      isolation: isolate;
    }

    .social-glass-bar::-webkit-scrollbar {
      display: none;
    }

    .social-glass-bar,
    .social-bar-wrapper {
      overflow: hidden !important;
      scrollbar-width: none;
      -ms-overflow-style: none;
    }

    .social-glass-bar *,
    .social-bar-wrapper * {
      overflow-x: hidden !important;
      overflow-y: hidden !important;
    }

    .social-glass-bar::before {
      content: '';
      position: absolute;
      inset: 1px;
      border-radius: inherit;
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.12), transparent 36%, rgba(255, 255, 255, 0.08) 100%);
      pointer-events: none;
      opacity: 0.85;
    }

    .social-glass-bar::after {
      content: '';
      position: absolute;
      inset: 2px;
      border-radius: inherit;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.18), transparent 36%, rgba(255, 255, 255, 0.12));
      pointer-events: none;
      opacity: 0.55;
    }

    .social-link {
      position: relative;
      z-index: 1;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      color: var(--icon-color);
      background: var(--icon-surface);
      border: 1px solid var(--icon-border);
      box-shadow:
        0 4px 10px rgba(15, 23, 42, 0.06),
        inset 0 1px 0 rgba(255, 255, 255, 0.5);
      transition:
        transform 180ms ease,
        background-color 180ms ease,
        box-shadow 180ms ease,
        color 180ms ease;
    }

    .social-link:hover,
    .social-link:focus-visible {
      transform: scale(1.04);
      background: rgba(255, 255, 255, 0.64);
      box-shadow:
        0 10px 20px var(--bar-glow),
        0 6px 14px rgba(15, 23, 42, 0.06),
        inset 0 1px 0 rgba(255, 255, 255, 0.62);
      color: var(--icon-hover-color);
    }

    .social-link:focus-visible {
      outline: 2px solid rgba(111, 50, 152, 0.2);
      outline-offset: 2px;
    }

    .social-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 16px;
      height: 16px;
    }

    svg {
      width: 16px;
      height: 16px;
      display: block;
      fill: currentColor;
      opacity: 0.96;
    }

    @media (max-width: 640px) {
      :host {
        right: 6px;
        left: auto;
      }

      .social-glass-bar {
        width: 44px;
        padding: 6px 2px;
        gap: 4px;
      }

      .social-link {
        width: 28px;
        height: 28px;
      }

      .social-icon,
      svg {
        width: 14px;
        height: 14px;
      }
    }
  `]
})
export class SocialGlassBarComponent {
  @Input() links: SocialGlassLink[] = [
    { label: 'X', href: 'https://x.com/RTIH_AP', icon: 'x' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/rtih-ap/posts/?feedView=all', icon: 'linkedin' },
    { label: 'Facebook', href: 'https://www.facebook.com/people/Rtih-Vijayawada/61581654933681/', icon: 'facebook' },
    { label: 'Instagram', href: 'https://www.instagram.com/rtih_ap/', icon: 'instagram' },
    { label: 'YouTube', href: 'https://www.youtube.com/@RTIH-AP', icon: 'youtube' }
  ];

  trackByHref = (_: number, link: SocialGlassLink) => link.href + link.label;
}
