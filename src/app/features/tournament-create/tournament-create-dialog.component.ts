import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { InfoTooltipComponent } from '../../shared/components/info-tooltip/info-tooltip.component';

@Component({
  selector: 'app-tournament-create-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    ButtonComponent,
    InfoTooltipComponent
  ],
  templateUrl: './tournament-create-dialog.component.html',
  styleUrls: ['./tournament-create-dialog.component.scss']
})
export class TournamentCreateDialogComponent {
  name = '';
  enableRegistrations = false;

  constructor(private dialogRef: MatDialogRef<TournamentCreateDialogComponent>) {}

  cancel() {
    this.dialogRef.close();
  }

  add() {
    this.dialogRef.close({ name: this.name, enableRegistrations: this.enableRegistrations });
  }
}