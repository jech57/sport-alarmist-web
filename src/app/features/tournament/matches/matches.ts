import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddBarComponent } from '../../../shared/components/add-bar/add-bar.component';
import { TournamentCreateService } from '../../tournament-create/tournament-create.service';
import { MatchesService } from './matches.service';
import { WarningToastComponent } from '../../../shared/components/warning-toast/warning-toast.component';
import { SuccessToastComponent } from '../../../shared/components/success-toast/success-toast.component';

@Component({
  selector: 'app-matches',
  imports: [CommonModule, FormsModule, MatDatepickerModule, MatNativeDateModule, MatButtonModule, AddBarComponent],
  templateUrl: './matches.html',
  styleUrl: './matches.scss',
})
export class Matches {
  tournament$: ReturnType<TournamentCreateService['getSelected$']>;

  // fechas anteriores a hoy quedan deshabilitadas en el calendario
  minDate = new Date();
  selectedDate: Date | null = null;

  private selectedTournamentId: string | null = null;

  private readonly monthNames = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];

  // Formateo manual: el pipe "date" con locale 'es' explícito falla si ese
  // locale no está registrado en la app (registerLocaleData), y falla en
  // silencio para esa interpolación puntual sin romper el resto de la vista.
  formatDate(iso: string): string {
    const d = new Date(iso);
    return `${d.getDate()} de ${this.monthNames[d.getMonth()]} de ${d.getFullYear()}`;
  }

  // distingue "Cancelar" de "OK sin fecha seleccionada" en (closed),
  // que dispara igual para ambos casos
  private wasCancelled = false;

  constructor(
    private tournamentStore: TournamentCreateService,
    private matchesService: MatchesService,
    private snackBar: MatSnackBar
  ) {
    this.tournament$ = this.tournamentStore.getSelected$();
    this.tournamentStore.getSelectedId$().subscribe((id) => (this.selectedTournamentId = id));
  }

  onAddMatch(): void {
    // TODO: abrir flujo de agregar partido
  }

  onCancelClick(): void {
    this.wasCancelled = true;
  }

  onPickerClosed(): void {
    if (this.wasCancelled) {
      this.wasCancelled = false;
      this.selectedDate = null;
      return;
    }

    if (!this.selectedDate) {
      this.snackBar.openFromComponent(WarningToastComponent, {
        data: { message: 'Por favor selecciona una fecha' },
        panelClass: 'app-toast-panel',
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'bottom'
      });
    } else if (this.selectedTournamentId) {
      this.matchesService.addMatchDate(this.selectedTournamentId, this.selectedDate);

      this.snackBar.openFromComponent(SuccessToastComponent, {
        data: { message: 'Fecha creada exitosamente' },
        panelClass: 'app-toast-panel',
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'bottom'
      });
    }

    this.selectedDate = null; // se borra despues de usarla, para que la proxima vez el calendario abra limpio
  }
}