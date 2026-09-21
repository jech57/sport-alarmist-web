import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-tournament',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, MatTabsModule],
  templateUrl: './tournament.html',
  styleUrl: './tournament.scss',
})
export class Tournament {
}
