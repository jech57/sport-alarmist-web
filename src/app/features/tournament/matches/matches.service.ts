import { Injectable } from '@angular/core';
import { TournamentCreateService } from '../../tournament-create/tournament-create.service';
import type { Match } from '../../tournament-create/tournament-create.service';

@Injectable({ providedIn: 'root' })
export class MatchesService {
  constructor(private tournamentStore: TournamentCreateService) {}

  addMatchDate(tournamentId: string, date: Date): { id: string; isNew: boolean } | null {
    const tournament = this.tournamentStore.get(tournamentId);
    if (!tournament) {
      return null;
    }

    // sin este chequeo, elegir el mismo día dos veces creaba dos grupos
    // separados (cada uno con su propio dateId random) en vez de reusar
    // el que ya existe para ese día.
    const existing = Object.entries(tournament.matches).find(([, entry]) =>
      this.isSameDay(new Date(entry.date), date)
    );
    if (existing) {
      return { id: existing[0], isNew: false };
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

    return { id: dateId, isNew: true };
  }

  private isSameDay(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }

  // para deshabilitar en el datepicker los días que ya tienen fecha creada.
  // excludeDateId: al reagendar una fecha existente, no debe bloquearse a
  // sí misma.
  hasDateOnDay(tournamentId: string, date: Date, excludeDateId?: string): boolean {
    const tournament = this.tournamentStore.get(tournamentId);
    if (!tournament) return false;

    return Object.entries(tournament.matches).some(
      ([id, entry]) => id !== excludeDateId && this.isSameDay(new Date(entry.date), date)
    );
  }

  deleteMatchDate(tournamentId: string, dateId: string): void {
    const tournament = this.tournamentStore.get(tournamentId);
    if (!tournament || !tournament.matches[dateId]) {
      return;
    }

    const { [dateId]: _removed, ...remainingDates } = tournament.matches;
    tournament.matches = remainingDates;

    this.tournamentStore.notifyChange();
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

  deleteMatch(tournamentId: string, dateId: string, matchId: string): void {
    const tournament = this.tournamentStore.get(tournamentId);
    const dateEntry = tournament?.matches[dateId];
    if (!tournament || !dateEntry || !dateEntry.matches[matchId]) {
      return;
    }

    const { [matchId]: _removed, ...remainingMatches } = dateEntry.matches;

    tournament.matches = {
      ...tournament.matches,
      [dateId]: {
        ...dateEntry,
        count: dateEntry.count - 1,
        matches: remainingMatches
      }
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