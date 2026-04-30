import type { SessionState } from "../types/api";

let currentSession: SessionState = {};

export function getSession(): SessionState {
  return currentSession;
}

export function setSession(nextSession: SessionState): SessionState {
  currentSession = nextSession;
  return currentSession;
}

export function updateSession(partialSession: Partial<SessionState>): SessionState {
  currentSession = {
    ...currentSession,
    ...partialSession
  };
  return currentSession;
}

export function clearSession(): void {
  currentSession = {};
}
