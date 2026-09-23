import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-success-toast',
  standalone: true,
  template: `
    <div class="success-toast">
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="9" stroke=var(--color-green-success) stroke-width="1.6" />
        <path d="M8 12.5l2.5 2.5L16 9.5" stroke=var(--color-green-success) stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      <span>{{ data.message }}</span>
    </div>
  `,
  styles: [`
    .success-toast {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 20px;
      font-size: 16px;
      color: #ffffff;
    }
  `]
})
export class SuccessToastComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: { message: string }) {}
}