import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { EmptyStateDoodle } from '../../shared/illustrations/empty-state-doodle/empty-state-doodle';
import { TournamentCreateDialog } from '../tournament-create/tournament-create-dialog';
import { TournamentCreateService } from '../tournament-create/tournament-create.service';
import { Tournament } from '../tournament/tournament/tournament';

@Component({
  selector: 'app-home',
  imports: [CommonModule, EmptyStateDoodle, Tournament],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  tournament$: ReturnType<TournamentCreateService['getSelected$']>;

  constructor(
    private dialog: MatDialog,
    private tournamentStore: TournamentCreateService
  ) {
    this.tournament$ = this.tournamentStore.getSelected$();
  }

  openCreateTournament() {
    this.dialog.open(TournamentCreateDialog, {
      panelClass: 'tournament-create-panel',
      autoFocus: false
    });
  }
}