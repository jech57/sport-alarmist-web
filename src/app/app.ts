import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { Header } from './core/layout/header/header';
import { DotTexture } from './shared/background/dot-texture/dot-texture';
import { TournamentPanelComponent } from './shared/components/tournament-panel/tournament-panel.component';
import { TournamentCreateService } from './features/tournament-create/tournament-create.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, Header, DotTexture, TournamentPanelComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  // Sin torneos no hay nada que listar: el panel no se muestra (*ngIf en
  // app.html) y el layout flex le da todo el ancho a la columna de
  // contenido automáticamente.
  hasTournaments$: Observable<boolean>;

  constructor(private tournamentStore: TournamentCreateService) {
    this.hasTournaments$ = this.tournamentStore.hasAny$();
  }
}
