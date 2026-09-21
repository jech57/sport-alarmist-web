import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home').then((m) => m.Home),
  },
  {
    path: 'torneos/nuevo',
    loadComponent: () =>
      import('./features/tournament-new/tournament-new').then((m) => m.TournamentNew),
  },
  {
    path: 'torneos/:id',
    loadComponent: () =>
      import('./features/tournament/tournament/tournament').then((m) => m.Tournament),
    children: [
      { path: '', redirectTo: 'partidos', pathMatch: 'full' },
      {
        path: 'partidos',
        loadComponent: () =>
          import('./features/tournament/matches/matches').then((m) => m.Matches),
      },
      {
        path: 'equipos',
        loadComponent: () =>
          import('./features/tournament/teams/teams').then((m) => m.Teams),
      },
      {
        path: 'ajustes',
        loadComponent: () =>
          import('./features/tournament/settings/settings').then((m) => m.Settings),
      },
    ],
  },
];
