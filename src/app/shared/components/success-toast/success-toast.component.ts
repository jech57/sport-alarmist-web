import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-success-toast',
  standalone: true,
  template: `
    <div class="success-toast">
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg" class="success-toast__icon">
        <circle cx="12" cy="12" r="9" stroke="#3ecf5e" stroke-width="1.6" />
        <path d="M8 12.5l2.5 2.5L16 9.5" stroke="#3ecf5e" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      <span>{{ data.message }}</span>
    </div>
  `,
  styles: [`
    .success-toast {
      display: flex;
      align-items: flex-start; // asi el icono queda arriba cuando el texto hace wrap en varias lineas
      gap: 12px;
      padding: 12px 20px;
      font-size: 16px;
      line-height: 22px; // mismo alto que el icono (22px) - asi la primera linea alinea exacto, sin adivinar margin-top
      color: #ffffff;
    }

    .success-toast__icon {
      flex-shrink: 0; // no se achica cuando el texto es largo
    }
  `]
})
export class SuccessToastComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: { message: string }) {}
}