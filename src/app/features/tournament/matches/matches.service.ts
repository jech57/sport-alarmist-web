import { Injectable } from '@angular/core';
import { TournamentCreateService } from '../../tournament-create/tournament-create.service';
import type { Match } from '../../tournament-create/tournament-create.service';

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
        count: 0,
        matches: {}
      }
    };

    this.tournamentStore.notifyChange();

    return dateId;
  }

  addMatch(tournamentId: string, dateId: string, match: Match): string | null {
    const tournament = this.tournamentStore.get(tournamentId);
    const dateEntry = tournament?.matches[dateId];
    if (!tournament || !dateEntry) {
      return null;
    }

    const matchId = crypto.randomUUID();

    // misma regla: nueva referencia, no mutar in-place (rompe pipes puros)
    const updatedDateEntry = {
      ...dateEntry,
      count: dateEntry.count + 1,
      matches: {
        ...dateEntry.matches,
        [matchId]: match
      }
    };

    tournament.matches = {
      ...tournament.matches,
      [dateId]: updatedDateEntry
    };

    this.tournamentStore.notifyChange();

    return matchId;
  }

  updateMatchDate(tournamentId: string, dateId: string, date: Date): void {
    const tournament = this.tournamentStore.get(tournamentId);
    const dateEntry = tournament?.matches[dateId];
    if (!tournament || !dateEntry) {
      return;
    }

    tournament.matches = {
      ...tournament.matches,
      [dateId]: { ...dateEntry, date: date.toISOString() }
    };

    this.tournamentStore.notifyChange();
  }

  updateMatch(tournamentId: string, dateId: string, matchId: string, match: Match): void {
    const tournament = this.tournamentStore.get(tournamentId);
    const dateEntry = tournament?.matches[dateId];
    if (!tournament || !dateEntry || !dateEntry.matches[matchId]) {
      return;
    }

    tournament.matches = {
      ...tournament.matches,
      [dateId]: {
        ...dateEntry,
        matches: {
          ...dateEntry.matches,
          [matchId]: match
        }
      }
    };

    this.tournamentStore.notifyChange();
  }
}