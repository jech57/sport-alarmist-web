import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-add-bar',
  imports: [CommonModule, ButtonComponent],
  templateUrl: './add-bar.component.html',
  styleUrl: './add-bar.component.scss',
})
export class AddBarComponent {
  @Input() variant: 'button' | 'circle' = 'button';
  @Input() label = 'Añadir';
  @Output() addClick = new EventEmitter<void>();
}