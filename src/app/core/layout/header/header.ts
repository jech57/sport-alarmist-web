import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { TournamentCreateDialog } from '../../../features/tournament-create/tournament-create-dialog';
import { TournamentCreateService } from '../../../features/tournament-create/tournament-create.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class Header {
  // Con la lista vacía, el CTA central de Home ya cubre esta acción: el
  // botón del header solo se muestra cuando hay contenido renderizado.
  hasTournaments$: Observable<boolean>;

  constructor(private dialog: MatDialog, private tournamentStore: TournamentCreateService) {
    this.hasTournaments$ = this.tournamentStore.getAll$().pipe(
      map((tournaments) => Object.keys(tournaments).length > 0)
    );
  }

  onAddTournament() {
    this.dialog.open(TournamentCreateDialog, {
      panelClass: 'tournament-create-panel',
      // autoFocus: false
    });
  }
}