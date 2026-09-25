import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { IconTeamBadgeTriangulo } from '../../illustrations/icon-team-badge-triangulo/icon-team-badge-triangulo';
import { IconTeamBadgeEstrella } from '../../illustrations/icon-team-badge-estrella/icon-team-badge-estrella';
import type { TeamBadge } from '../../../features/tournament-create/tournament-create.service';

@Component({
  selector: 'app-team-badge-picker-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, IconTeamBadgeTriangulo, IconTeamBadgeEstrella],
  templateUrl: './team-badge-picker-dialog.html',
  styleUrls: ['./team-badge-picker-dialog.scss']
})
export class TeamBadgePickerDialog {
  // TEMPORAL: simulador de explorador de archivos (nodo 170:6767) — no hay
  // carga real de imágenes todavía, así que las únicas dos "opciones" son
  // los badges que ya existen como assets (triángulo/estrella).
  selected: TeamBadge | null = null;

  constructor(private dialogRef: MatDialogRef<TeamBadgePickerDialog, TeamBadge | null>) {}

  select(badge: TeamBadge): void {
    this.selected = badge;
  }

  close(): void {
    this.dialogRef.close(null);
  }

  confirm(): void {
    this.dialogRef.close(this.selected);
  }
}
