import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TournamentCreateService } from '../../../features/tournament-create/tournament-create.service';

@Component({
  selector: 'app-tournament-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tournament-panel.component.html',
  styleUrls: ['./tournament-panel.component.scss']
})
export class TournamentPanelComponent {
  tournaments$: ReturnType<TournamentCreateService['getAll$']>;
  selectedId$: ReturnType<TournamentCreateService['getSelectedId$']>;

  constructor(private tournamentStore: TournamentCreateService) {
    this.tournaments$ = this.tournamentStore.getAll$();
    this.selectedId$ = this.tournamentStore.getSelectedId$();
  }

  select(id: string) {
    this.tournamentStore.select(id);
  }
}