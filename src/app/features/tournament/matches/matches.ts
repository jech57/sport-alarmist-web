import { Component, ViewChild } from '@angular/core';
import { CommonModule, KeyValue } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AddBarComponent } from '../../../shared/components/add-bar/add-bar.component';
import { ConfirmDialog } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { ConfirmButtonComponent } from '../../../shared/components/confirm-button/confirm-button.component';
import { DiscardButtonComponent } from '../../../shared/components/discard-button/discard-button.component';
import { EditButtonComponent } from '../../../shared/components/edit-button/edit-button.component';
import { DeleteButtonComponent } from '../../../shared/components/delete-button/delete-button.component';
import { TournamentCreateService } from '../../tournament-create/tournament-create.service';
import type { Match, MatchDate } from '../../tournament-create/tournament-create.service';
import { MatchesService } from './matches.service';
import { WarningToastComponent } from '../../../shared/components/warning-toast/warning-toast.component';
import { SuccessToastComponent } from '../../../shared/components/success-toast/success-toast.component';
import { IllustrationBandCalendario } from '../../../shared/illustrations/illustration-band-calendario/illustration-band-calendario';

@Component({
  selector: 'app-matches',
  imports: [
    CommonModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    AddBarComponent,
    ConfirmButtonComponent,
    DiscardButtonComponent,
    EditButtonComponent,
    DeleteButtonComponent,
    IllustrationBandCalendario
  ],
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

  // nombres de los equipos reales del torneo seleccionado (Equipos), para
  // los selects de "Equipo 1"/"Equipo 2" al agregar un partido
  private teamNames: string[] = [];

  // qué fecha tiene el formulario de "agregar partido" abierto (null = ninguna)
  addingMatchDateId: string | null = null;

  // si estamos editando un partido existente en vez de creando uno nuevo
  editingMatchId: string | null = null;

  // convierte el ISO string de cada fecha a Date, para el [value] del picker
  // (uno por fila - ya NO hay una sola variable compartida entre todas)
  asDate(iso: string): Date {
    return new Date(iso);
  }

  // orden para el keyvalue pipe: de hoy en adelante, de más cercana a más
  // lejana; las que ya pasaron van al final. Sin esto, keyvalue ordena por
  // el dateId (un uuid random), o sea sin ningún orden real.
  sortDateEntries = (a: KeyValue<string, MatchDate>, b: KeyValue<string, MatchDate>): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dateA = new Date(a.value.date);
    const dateB = new Date(b.value.date);
    const aIsPast = dateA < today;
    const bIsPast = dateB < today;

    if (aIsPast !== bIsPast) return aIsPast ? 1 : -1;
    return dateA.getTime() - dateB.getTime();
  };

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
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.tournament$ = this.tournamentStore.getSelected$();
    this.tournamentStore.getSelectedId$().subscribe((id) => (this.selectedTournamentId = id));
    this.tournament$.subscribe((tournament) => {
      this.teamNames = tournament ? Object.values(tournament.teamsList ?? {}).map((team) => team.name) : [];
    });
  }

  // el equipo ya elegido en el otro select no debe aparecer como opcion
  teamsFor(field: 'team1' | 'team2'): string[] {
    const otherValue = field === 'team1' ? this.newMatch.team2 : this.newMatch.team1;
    return this.teamNames.filter((team) => team !== otherValue);
  }

  // deshabilita en "Añadir fecha" los días que ya tienen una fecha creada
  dateFilter = (d: Date | null): boolean => {
    if (!d || !this.selectedTournamentId) return true;
    return !this.matchesService.hasDateOnDay(this.selectedTournamentId, d);
  };

  // qué fecha se está reagendando ahora, para que dateFilterForEdit no la
  // bloquee a sí misma (la setea openDatePickerFor antes de abrir)
  private editingDateId: string | null = null;

  // idem que dateFilter pero excluyendo editingDateId. Tiene que ser UNA
  // sola función estable (no una que el template cree de nuevo llamando
  // dateFilterExcluding(entry.key) en cada change detection): con una
  // referencia nueva en cada ciclo, un click sintético/instantáneo la
  // alcanza a tiempo, pero un click real de mouse (que toma más) cae
  // justo cuando Material está re-creando el calendario por el input
  // que cambió, y el click se pierde sin seleccionar nada.
  dateFilterForEdit = (d: Date | null): boolean => {
    if (!d || !this.selectedTournamentId) return true;
    return !this.matchesService.hasDateOnDay(this.selectedTournamentId, d, this.editingDateId ?? undefined);
  };

  clearTeam(field: 'team1' | 'team2'): void {
    this.newMatch[field] = '';
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

  onDeleteDate(dateId: string): void {
    if (!this.selectedTournamentId) return;

    this.dialog
      .open(ConfirmDialog, {
        panelClass: 'tournament-create-panel',
        data: {
          title: '¿Desea borrar esta fecha?',
          message: 'Esto eliminará los partidos asociados. Esta acción no se puede deshacer.'
        }
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (!confirmed || !this.selectedTournamentId) return;

        this.matchesService.deleteMatchDate(this.selectedTournamentId, dateId);

        this.snackBar.openFromComponent(SuccessToastComponent, {
          data: { message: 'Fecha eliminada' },
          panelClass: 'app-toast-panel',
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom'
        });
      });
  }

  onDeleteMatch(dateId: string, matchId: string): void {
    if (!this.selectedTournamentId) return;

    this.dialog
      .open(ConfirmDialog, {
        panelClass: 'tournament-create-panel',
        data: {
          title: '¿Desea borrar este partido?',
          message: 'Esta acción no se puede deshacer.'
        }
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (!confirmed || !this.selectedTournamentId) return;

        this.matchesService.deleteMatch(this.selectedTournamentId, dateId, matchId);

        this.snackBar.openFromComponent(SuccessToastComponent, {
          data: { message: 'Partido eliminado' },
          panelClass: 'app-toast-panel',
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom'
        });
      });
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

  openDatePickerFor(picker: MatDatepicker<Date>, dateId: string): void {
    // el [value] del input ya viene directo de entry.value.date (ver html),
    // asi que no hay nada que precargar aqui - solo abrir
    this.editingDateId = dateId;
    picker.open();
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
      const result = this.matchesService.addMatchDate(this.selectedTournamentId, this.selectedDate);

      this.snackBar.openFromComponent(SuccessToastComponent, {
        data: { message: result?.isNew ? 'Fecha creada exitosamente' : 'Esa fecha ya estaba en la lista' },
        panelClass: 'app-toast-panel',
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'bottom'
      });
    }

    this.selectedDate = null; // se borra despues de usarla, para que la proxima vez el calendario abra limpio
  }
}