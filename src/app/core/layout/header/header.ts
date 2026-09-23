import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { TournamentCreateDialog } from '../../../features/tournament-create/tournament-create-dialog';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class Header {
  constructor(private dialog: MatDialog) {}

  onAddTournament() {
    this.dialog.open(TournamentCreateDialog, {
      panelClass: 'tournament-create-panel',
      // autoFocus: false
    });
  }
}