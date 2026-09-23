import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './core/layout/header/header';
import { DotTexture } from './shared/background/dot-texture/dot-texture';
import { TournamentPanelComponent } from './shared/components/tournament-panel/tournament-panel.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, DotTexture, TournamentPanelComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
}
