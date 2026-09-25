import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddBarComponent } from '../../../shared/components/add-bar/add-bar.component';
import { ConfirmButtonComponent } from '../../../shared/components/confirm-button/confirm-button.component';
import { DiscardButtonComponent } from '../../../shared/components/discard-button/discard-button.component';
import { DeleteButtonComponent } from '../../../shared/components/delete-button/delete-button.component';
import { InfoTooltipComponent } from '../../../shared/components/info-tooltip/info-tooltip.component';
import { TeamBadgePickerDialog } from '../../../shared/components/team-badge-picker-dialog/team-badge-picker-dialog';
import { InfoDialog } from '../../../shared/components/info-dialog/info-dialog';
import { IconTeamBadgeTriangulo } from '../../../shared/illustrations/icon-team-badge-triangulo/icon-team-badge-triangulo';
import { IconTeamBadgeEstrella } from '../../../shared/illustrations/icon-team-badge-estrella/icon-team-badge-estrella';
import { WarningToastComponent } from '../../../shared/components/warning-toast/warning-toast.component';
import { SuccessToastComponent } from '../../../shared/components/success-toast/success-toast.component';
import { TournamentCreateService } from '../../tournament-create/tournament-create.service';
import type { TeamBadge } from '../../tournament-create/tournament-create.service';
import { IllustrationBandTrofeo } from '../../../shared/illustrations/illustration-band-trofeo/illustration-band-trofeo';

@Component({
  selector: 'app-teams',
  imports: [
    CommonModule,
    FormsModule,
    AddBarComponent,
    ConfirmButtonComponent,
    DiscardButtonComponent,
    DeleteButtonComponent,
    InfoTooltipComponent,
    IconTeamBadgeTriangulo,
    IconTeamBadgeEstrella,
    IllustrationBandTrofeo
  ],
  templateUrl: './teams.html',
  styleUrl: './teams.scss',
})
export class Teams {
  tournament$: ReturnType<TournamentCreateService['getSelected$']>;

  addingTeam = false;
  newTeam: { name: string; password: string; badge: TeamBadge | null } = { name: '', password: '', badge: null };

  // ids de equipos cuya contraseña está destapada (ícono del ojo)
  visiblePasswords = new Set<string>();

  private selectedTournamentId: string | null = null;

  constructor(
    private tournamentStore: TournamentCreateService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.tournament$ = this.tournamentStore.getSelected$();
    this.tournamentStore.getSelectedId$().subscribe((id) => (this.selectedTournamentId = id));
  }

  onAddTeam(): void {
    this.addingTeam = true;
  }

  openBadgePicker(): void {
    this.dialog
      .open<TeamBadgePickerDialog, void, TeamBadge | null>(TeamBadgePickerDialog, {
        panelClass: 'tournament-create-panel'
      })
      .afterClosed()
      .subscribe((badge) => {
        if (badge) this.newTeam.badge = badge;
      });
  }

  confirmAddTeam(): void {
    if (!this.selectedTournamentId) return;

    if (!this.newTeam.name.trim()) {
      this.snackBar.openFromComponent(WarningToastComponent, {
        data: { message: 'Por favor ingresa el nombre del equipo' },
        panelClass: 'app-toast-panel',
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'bottom'
      });
      return;
    }

    this.tournamentStore.addTeam(
      this.selectedTournamentId,
      this.newTeam.name.trim(),
      this.newTeam.password,
      this.newTeam.badge ?? undefined
    );

    this.snackBar.openFromComponent(SuccessToastComponent, {
      data: { message: 'Equipo creado exitosamente' },
      panelClass: 'app-toast-panel',
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom'
    });

    this.newTeam = { name: '', password: '', badge: null };
    this.addingTeam = false;
  }

  cancelAddTeam(): void {
    this.newTeam = { name: '', password: '', badge: null };
    this.addingTeam = false;
  }

  removeTeam(teamId: string): void {
    if (!this.selectedTournamentId) return;
    this.tournamentStore.removeTeam(this.selectedTournamentId, teamId);
  }

  togglePasswordVisibility(teamId: string): void {
    if (this.visiblePasswords.has(teamId)) {
      this.visiblePasswords.delete(teamId);
    } else {
      this.visiblePasswords.add(teamId);
    }
  }

  maskedPassword(password: string): string {
    return '•'.repeat(Math.max(password.length, 8));
  }

  // nodo 170:6800: mismo modal siempre, solo cambia el nombre del equipo.
  // TODO: reemplazar el mensaje fijo cuando exista el roster real de jugadores.
  openPlayersDialog(teamName: string): void {
    this.dialog.open(InfoDialog, {
      panelClass: 'tournament-create-panel',
      data: {
        title: `Jugadores de ${teamName}`,
        message: 'Este equipo no tiene jugadores inscritos todavía. Espera a que ellos se unan mediante la app móvil.'
      }
    });
  }
}
