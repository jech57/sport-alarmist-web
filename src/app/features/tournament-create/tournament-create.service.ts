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

export interface Tournament {
  name: string;
  matches: Record<string, MatchDate>;
  teams: {
    quantity: number;
  };
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
    // TEMPORAL: la primera vez que se crea un torneo, sembramos uno mock
    // aparte con 2 equipos ya listos, para poder probar Partidos sin tener
    // que ir a agregar equipos a mano. Buscar "TEMPORAL" para quitarlo luego.
    const isFirstTournament = Object.keys(this.tournaments).length === 0;

    const id = crypto.randomUUID();

    this.tournaments[id] = {
      name,
      matches: {},
      teams: {
        quantity: 0
      },
      settings: {
        enable_registration: enableRegistrations
      }
    };

    if (isFirstTournament) {
      const mockId = crypto.randomUUID();
      this.tournaments[mockId] = {
        name: 'Torneo de prueba (2 equipos)',
        matches: {},
        teams: {
          quantity: 2
        },
        settings: {
          enable_registration: false
        }
      };
    }

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
}