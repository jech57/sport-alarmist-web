import { Injectable } from '@angular/core';
import { TournamentCreateService } from '../../tournament-create/tournament-create.service';

@Injectable({ providedIn: 'root' })
export class MatchesService {
  constructor(private tournamentStore: TournamentCreateService) {}

  addMatchDate(tournamentId: string, date: Date): string | null {
    const tournament = this.tournamentStore.get(tournamentId);
    if (!tournament) {
      return null;
    }

    const dateId = crypto.randomUUID();

    // OJO: nueva referencia (spread), no mutar tournament.matches directo.
    // El pipe "keyvalue" es puro: solo recalcula si la referencia cambia,
    // no si el contenido cambia por dentro del mismo objeto.
    tournament.matches = {
      ...tournament.matches,
      [dateId]: {
        date: date.toISOString(),
        count: 0
      }
    };

    console.log(JSON.stringify(tournament, null, 2));

    this.tournamentStore.notifyChange();

    return dateId;
  }
}