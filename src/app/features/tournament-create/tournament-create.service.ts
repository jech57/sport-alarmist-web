import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Match {
  team1: string;
  team2: string;
  time: string; // ej. "07:30 AM"
  place: string;
  confirmed: boolean;
}

export interface MatchDate {
  date: string; // ISO string
  count: number; // cantidad de partidos en esa fecha
  matches: Record<string, Match>;
}

// Hasta que exista carga real de imágenes, el "escudo" es una de estas dos
// (nodo 170:6767, simulador de explorador de archivos).
export type TeamBadge = 'triangulo' | 'estrella';

export interface Team {
  name: string;
  password: string;
  players: number; // TODO: reemplazar por el roster real cuando exista esa pantalla
  badge?: TeamBadge;
}

export interface Tournament {
  name: string;
  matches: Record<string, MatchDate>;
  teams: {
    quantity: number;
  };
  teamsList: Record<string, Team>;
  settings: {
    enable_registration: boolean;
  };
}

const STORAGE_KEY = 'tournaments';
const SELECTED_KEY = 'tournaments:selectedId';

@Injectable({ providedIn: 'root' })
export class TournamentCreateService {
  // Ahora persiste en sessionStorage: sobrevive a refrescos y URLs escritas
  // a mano, pero se vacía al cerrar la pestaña (no es una base de datos real).
  private tournaments: Record<string, Tournament> = this.loadTournaments();
  private tournaments$ = new BehaviorSubject<Record<string, Tournament>>(this.tournaments);
  private selectedId$ = new BehaviorSubject<string | null>(this.loadSelectedId());

  private loadTournaments(): Record<string, Tournament> {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  private loadSelectedId(): string | null {
    try {
      return sessionStorage.getItem(SELECTED_KEY);
    } catch {
      return null;
    }
  }

  private persist(): void {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(this.tournaments));
    } catch {
      // si sessionStorage falla (modo incógnito estricto, etc.), seguimos solo en memoria
    }
  }

  getAll$(): Observable<Record<string, Tournament>> {
    return this.tournaments$.asObservable();
  }

  hasAny$(): Observable<boolean> {
    return this.tournaments$.pipe(map((tournaments) => Object.keys(tournaments).length > 0));
  }

  getSelectedId$(): Observable<string | null> {
    return this.selectedId$.asObservable();
  }

  getSelected$(): Observable<Tournament | null> {
    return combineLatest([this.tournaments$, this.selectedId$]).pipe(
      map(([tournaments, selectedId]) => (selectedId ? tournaments[selectedId] ?? null : null))
    );
  }

  get(id: string): Tournament | undefined {
    return this.tournaments[id];
  }

  select(id: string): void {
    this.selectedId$.next(id);
    try {
      sessionStorage.setItem(SELECTED_KEY, id);
    } catch {
      // sin persistencia si falla, no rompe la app
    }
  }

  add(name: string, enableRegistrations: boolean): string {
    const id = crypto.randomUUID();

    this.tournaments[id] = {
      name,
      matches: {},
      teams: {
        quantity: 0
      },
      teamsList: {},
      settings: {
        enable_registration: enableRegistrations
      }
    };

    this.persist();
    this.tournaments$.next({ ...this.tournaments });

    this.selectedId$.next(id);
    try {
      sessionStorage.setItem(SELECTED_KEY, id);
    } catch {
      // sin persistencia si falla, no rompe la app
    }

    return id;
  }

  // Para otros servicios (ej. MatchesService) que mutan directamente el
  // objeto devuelto por get(id) y necesitan persistir + notificar el cambio.
  notifyChange(): void {
    this.persist();
    this.tournaments$.next({ ...this.tournaments });
  }

  updateSettings(tournamentId: string, name: string, enableRegistrations: boolean): void {
    const tournament = this.tournaments[tournamentId];
    if (!tournament) return;

    tournament.name = name;
    tournament.settings.enable_registration = enableRegistrations;
    this.notifyChange();
  }

  addTeam(tournamentId: string, name: string, password: string, badge?: TeamBadge): void {
    const tournament = this.tournaments[tournamentId];
    if (!tournament) return;

    // torneos creados antes de que teamsList existiera en el modelo no lo
    // traen en su JSON guardado en sessionStorage: se completa acá.
    if (!tournament.teamsList) tournament.teamsList = {};

    const id = crypto.randomUUID();
    tournament.teamsList[id] = { name, password, players: 0, badge };
    tournament.teams.quantity = Object.keys(tournament.teamsList).length;
    this.notifyChange();
  }

  removeTeam(tournamentId: string, teamId: string): void {
    const tournament = this.tournaments[tournamentId];
    if (!tournament || !tournament.teamsList) return;

    delete tournament.teamsList[teamId];
    tournament.teams.quantity = Object.keys(tournament.teamsList).length;
    this.notifyChange();
  }
}