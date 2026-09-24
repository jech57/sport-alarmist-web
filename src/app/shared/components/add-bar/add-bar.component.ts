import { Component, Input, Output, EventEmitter, HostBinding } from '@angular/core';
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

  // "circle" necesita block para estirarse a todo el ancho (la línea divisora).
  // "button" debe quedar inline-block, o rompe el anclaje del datepicker.
  @HostBinding('style.display')
  get hostDisplay(): string {
    return this.variant === 'circle' ? 'block' : 'inline-block';
  }
}