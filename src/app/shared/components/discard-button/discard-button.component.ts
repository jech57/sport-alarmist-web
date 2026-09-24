import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-discard-button',
  imports: [],
  templateUrl: './discard-button.component.html',
  styleUrl: './discard-button.component.scss',
})
export class DiscardButtonComponent {
  @Output() discard = new EventEmitter<void>();
}