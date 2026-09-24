import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Matches } from '../matches/matches';
import { Teams } from '../teams/teams';
import { Settings } from '../settings/settings';

type Tab = 'partidos' | 'equipos' | 'ajustes';

@Component({
  selector: 'app-tournament',
  imports: [CommonModule, Matches, Teams, Settings],
  templateUrl: './tournament.html',
  styleUrl: './tournament.scss',
})
export class Tournament {
  activeTab: Tab = 'partidos';

  setTab(tab: Tab) {
    this.activeTab = tab;
  }
}