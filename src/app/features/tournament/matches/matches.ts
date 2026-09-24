import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddBarComponent } from '../../../shared/components/add-bar/add-bar.component';
import { TournamentCreateService } from '../../tournament-create/tournament-create.service';
import type { Match } from '../../tournament-create/tournament-create.service';
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

  @ViewChild('picker') private picker!: MatDatepicker<Date>;

  private selectedTournamentId: string | null = null;

  // TODO: reemplazar por los equipos reales del torneo cuando exista
  // el servicio de Equipos. Por ahora son solo placeholders.
  readonly placeholderTeams = ['Equipo A', 'Equipo B', 'Equipo C', 'Equipo D'];

  // qué fecha tiene el formulario de "agregar partido" abierto (null = ninguna)
  addingMatchDateId: string | null = null;

  // si estamos editando un partido existente en vez de creando uno nuevo
  editingMatchId: string | null = null;

  // valor precargado en el mini-calendario de editar fecha
  editDateValue: Date | null = null;

  // ids de fechas colapsadas (sus partidos ocultos)
  private collapsedDateIds = new Set<string>();

  newMatch = {
    team1: '',
    team2: '',
    hour: '',
    minute: '',
    ampm: 'AM' as 'AM' | 'PM',
    place: ''
  };

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

  // (closed) del datepicker dispara para CUALQUIER forma de cerrarlo:
  // Cancelar, OK, click afuera, Escape. Necesitamos flags explícitos para
  // saber cuál botón se usó, porque solo "OK sin fecha" debe mostrar warning.
  private wasCancelled = false;
  private wasApplied = false;

  constructor(
    private tournamentStore: TournamentCreateService,
    private matchesService: MatchesService,
    private snackBar: MatSnackBar
  ) {
    this.tournament$ = this.tournamentStore.getSelected$();
    this.tournamentStore.getSelectedId$().subscribe((id) => (this.selectedTournamentId = id));
  }

  // el equipo ya elegido en el otro select no debe aparecer como opcion
  teamsFor(field: 'team1' | 'team2'): string[] {
    const otherValue = field === 'team1' ? this.newMatch.team2 : this.newMatch.team1;
    return this.placeholderTeams.filter((team) => team !== otherValue);
  }

  onAddMatch(dateId: string): void {
    this.addingMatchDateId = dateId;
    this.editingMatchId = null;
    this.newMatch = { team1: '', team2: '', hour: '', minute: '', ampm: 'AM', place: '' };
  }

  onEditMatch(dateId: string, matchId: string, match: Match): void {
    this.addingMatchDateId = dateId;
    this.editingMatchId = matchId;

    // "07:30 AM" -> hour="07", minute="30", ampm="AM"
    const [time, ampm] = match.time.split(' ');
    const [hour, minute] = time.split(':');

    this.newMatch = {
      team1: match.team1,
      team2: match.team2,
      hour,
      minute,
      ampm: (ampm as 'AM' | 'PM') ?? 'AM',
      place: match.place
    };
  }

  setAmPm(value: 'AM' | 'PM'): void {
    this.newMatch.ampm = value;
  }

  onlyDigits(event: Event, field: 'hour' | 'minute'): void {
    const input = event.target as HTMLInputElement;
    const digitsOnly = input.value.replace(/\D/g, '');
    input.value = digitsOnly;
    this.newMatch[field] = digitsOnly;
  }

  // se corrige al salir del campo (blur), no mientras se escribe, para no
  // interrumpir al usuario a mitad de tecleo (ej. escribir "12" en dos pasos)
  clampHour(): void {
    const value = parseInt(this.newMatch.hour, 10);
    if (isNaN(value)) {
      this.newMatch.hour = '';
      return;
    }
    const clamped = Math.min(12, Math.max(1, value));
    this.newMatch.hour = String(clamped).padStart(2, '0');
  }

  clampMinute(): void {
    const value = parseInt(this.newMatch.minute, 10);
    if (isNaN(value)) {
      this.newMatch.minute = '';
      return;
    }
    const clamped = Math.min(59, Math.max(0, value));
    this.newMatch.minute = String(clamped).padStart(2, '0');
  }

  cancelAddMatch(): void {
    this.addingMatchDateId = null;
    this.editingMatchId = null;
  }

  confirmAddMatch(dateId: string): void {
    this.clampHour();
    this.clampMinute();

    const { team1, team2, hour, minute, ampm, place } = this.newMatch;

    if (!team1 || !team2 || !hour || !minute || !place) {
      this.snackBar.openFromComponent(WarningToastComponent, {
        data: { message: 'Por favor llena todos los campos' },
        panelClass: 'app-toast-panel',
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'bottom'
      });
      return;
    }

    if (!this.selectedTournamentId) {
      return;
    }

    const matchData: Match = {
      team1,
      team2,
      time: `${hour}:${minute} ${ampm}`,
      place,
      confirmed: false
    };

    if (this.editingMatchId) {
      this.matchesService.updateMatch(this.selectedTournamentId, dateId, this.editingMatchId, matchData);

      this.snackBar.openFromComponent(SuccessToastComponent, {
        data: { message: 'Partido editado exitosamente. Los jugadores serán notificados de los cambios.' },
        panelClass: 'app-toast-panel',
        duration: 4000,
        horizontalPosition: 'end',
        verticalPosition: 'bottom'
      });
    } else {
      this.matchesService.addMatch(this.selectedTournamentId, dateId, matchData);

      this.snackBar.openFromComponent(SuccessToastComponent, {
        data: { message: 'Partido creado exitosamente. Los jugadores serán notificados para que configuren sus alarmas.' },
        panelClass: 'app-toast-panel',
        duration: 4000,
        horizontalPosition: 'end',
        verticalPosition: 'bottom'
      });
    }

    this.addingMatchDateId = null;
    this.editingMatchId = null;
  }

  onEditDateClick(currentDateIso: string): void {
    // precarga el calendario con la fecha actual del grupo
    this.editDateValue = new Date(currentDateIso);
  }

  onDateChanged(dateId: string, newDate: Date | null): void {
    if (!newDate || !this.selectedTournamentId) {
      return;
    }
    this.matchesService.updateMatchDate(this.selectedTournamentId, dateId, newDate);

    this.snackBar.openFromComponent(SuccessToastComponent, {
      data: { message: 'Fecha editada exitosamente' },
      panelClass: 'app-toast-panel',
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom'
    });
  }

  toggleCollapse(dateId: string): void {
    if (this.collapsedDateIds.has(dateId)) {
      this.collapsedDateIds.delete(dateId);
    } else {
      this.collapsedDateIds.add(dateId);
    }
  }

  isCollapsed(dateId: string): boolean {
    return this.collapsedDateIds.has(dateId);
  }

  onCancelClick(): void {
    this.wasCancelled = true;
  }

  onApplyClick(): void {
    this.wasApplied = true;
  }

  onPickerClosed(): void {
    const wasApplied = this.wasApplied;
    this.wasCancelled = false;
    this.wasApplied = false;

    // Cerrado por click afuera, Escape, etc. (ni Cancelar ni OK) -> no hacemos
    // nada, ni warning ni toast. Solo OK explícito dispara la validación.
    if (!wasApplied) {
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

      // Material cierra el calendario al hacer click en OK sin importar si
      // hay fecha o no (es su comportamiento interno, no lo podemos evitar).
      // Lo reabrimos enseguida para que, en la práctica, no se sienta como
      // que se cerró.
      this.picker.open();
      return;
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