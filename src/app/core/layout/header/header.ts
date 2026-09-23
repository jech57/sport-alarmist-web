import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { MatDialog } from '@angular/material/dialog';
import { TournamentCreateDialogComponent } from '../../../features/tournament-create/tournament-create-dialog.component';

@Component({
  selector: 'app-header',
  imports: [MatToolbarModule, ButtonComponent],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {

  constructor(private dialog: MatDialog) {}
  
    onAddTournament() {
    const ref = this.dialog.open(TournamentCreateDialogComponent, {
      panelClass: 'tournament-create-panel'
    });
 
    ref.afterClosed().subscribe((result) => {
      if (result) {
        // result = { name, enableRegistrations }
        // TODO: crear el torneo con estos datos
      }
    });
  }
}

