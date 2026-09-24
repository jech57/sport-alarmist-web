import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { InfoTooltipComponent } from '../../shared/components/info-tooltip/info-tooltip.component';
import { TournamentCreateService } from './tournament-create.service';
import { SuccessToastComponent } from '../../shared/components/success-toast/success-toast.component';

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
  templateUrl: './tournament-create-dialog.html',
  styleUrls: ['./tournament-create-dialog.scss']
})
export class TournamentCreateDialog {
  name = '';
  enableRegistrations = false;

  constructor(
    private dialogRef: MatDialogRef<TournamentCreateDialog>,
    private tournamentStore: TournamentCreateService,
    private snackBar: MatSnackBar
  ) {}

  cancel() {
    this.dialogRef.close();
  }

  add() {
    if (!this.name.trim()) {
      return;
    }

    this.tournamentStore.add(this.name, this.enableRegistrations);

    this.snackBar.openFromComponent(SuccessToastComponent, {
      data: { message: 'Torneo creado exitosamente' },
      panelClass: 'app-toast-panel',
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom'
    });

    this.dialogRef.close();
  }
}