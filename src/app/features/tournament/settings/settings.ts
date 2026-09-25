import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InfoTooltipComponent } from '../../../shared/components/info-tooltip/info-tooltip.component';
import { SuccessToastComponent } from '../../../shared/components/success-toast/success-toast.component';
import { WarningToastComponent } from '../../../shared/components/warning-toast/warning-toast.component';
import { TournamentCreateService } from '../../tournament-create/tournament-create.service';
import { EmptyStateDoodle } from '../../../shared/illustrations/empty-state-doodle/empty-state-doodle';

@Component({
  selector: 'app-settings',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    ButtonComponent,
    InfoTooltipComponent,
    EmptyStateDoodle
  ],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class Settings {
  name = '';
  enableRegistrations = false;

  private selectedTournamentId: string | null = null;

  constructor(private tournamentStore: TournamentCreateService, private snackBar: MatSnackBar) {
    this.tournamentStore.getSelectedId$().subscribe((id) => (this.selectedTournamentId = id));
    this.tournamentStore.getSelected$().subscribe((tournament) => {
      if (!tournament) return;
      this.name = tournament.name;
      this.enableRegistrations = tournament.settings.enable_registration;
    });
  }

  cancel(): void {
    if (!this.selectedTournamentId) return;
    const tournament = this.tournamentStore.get(this.selectedTournamentId);
    if (!tournament) return;

    this.name = tournament.name;
    this.enableRegistrations = tournament.settings.enable_registration;
  }

  save(): void {
    if (!this.selectedTournamentId) return;

    if (!this.name.trim()) {
      this.snackBar.openFromComponent(WarningToastComponent, {
        data: { message: 'Por favor ingresa el nombre del torneo' },
        panelClass: 'app-toast-panel',
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'bottom'
      });
      return;
    }

    this.tournamentStore.updateSettings(this.selectedTournamentId, this.name.trim(), this.enableRegistrations);

    this.snackBar.openFromComponent(SuccessToastComponent, {
      data: { message: 'Cambios guardados exitosamente' },
      panelClass: 'app-toast-panel',
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom'
    });
  }
}
