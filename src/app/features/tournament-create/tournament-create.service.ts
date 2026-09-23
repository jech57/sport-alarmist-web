import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Tournament {
  name: string;
  matches: Record<string, unknown>;
  teams: Record<string, unknown>;
  settings: {
    enable_registration: boolean;
  };
}

@Injectable({ providedIn: 'root' })
export class TournamentCreateService {
  // En memoria: se vacía solo al recargar/cerrar la app.
  private tournaments: Record<string, Tournament> = {};
  private tournaments$ = new BehaviorSubject<Record<string, Tournament>>({});
  private selectedId$ = new BehaviorSubject<string | null>(null);

  getAll$(): Observable<Record<string, Tournament>> {
    return this.tournaments$.asObservable();
  }

  getSelectedId$(): Observable<string | null> {
    return this.selectedId$.asObservable();
  }

  select(id: string): void {
    this.selectedId$.next(id);
  }

  add(name: string, enableRegistrations: boolean): string {
    const id = crypto.randomUUID();

    this.tournaments[id] = {
      name,
      matches: {},
      teams: {},
      settings: {
        enable_registration: enableRegistrations
      }
    };

    this.tournaments$.next({ ...this.tournaments });

    // el torneo recien creado queda seleccionado
    this.selectedId$.next(id);

    return id;
  }
}