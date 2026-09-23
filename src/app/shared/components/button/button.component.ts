import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { IconTrophy } from '../../illustrations/icon-trophy/icon-trophy';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, MatButtonModule, IconTrophy],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input() label = '';
  @Input() icon?: string;
  @Input() variant: 'primary' | 'secondary' | 'outline' | 'cancel' | 'neutral' = 'primary';
  @Input() disabled = false;
}