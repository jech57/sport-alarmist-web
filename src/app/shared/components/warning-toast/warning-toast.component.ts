import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-warning-toast',
  standalone: true,
  template: `
    <div class="warning-toast">
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 3.5L2.5 20h19L12 3.5z" stroke="var(--color-yellow-warning)" stroke-width="1.6" stroke-linejoin="round" />
        <line x1="12" y1="9.5" x2="12" y2="13.5" stroke="var(--color-yellow-warning)" stroke-width="1.6" stroke-linecap="round" />
        <circle cx="12" cy="16.3" r="0.9" fill="var(--color-yellow-warning)" />
      </svg>
      <span>{{ data.message }}</span>
    </div>
  `,
  styles: [`
    .warning-toast {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 20px;
      font-size: 16px;
      color: #ffffff;
    }
  `]
})
export class WarningToastComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: { message: string }) {}
}