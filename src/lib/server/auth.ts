import { sha256 } from "@oslojs/crypto/sha2";

import { encodeBase64url, encodeHexLowerCase } from "@oslojs/encoding";

import type { RequestEvent } from "@sveltejs/kit";

import type { Employee, Session } from "@prisma/client";

import { SessionDAO } from "./dataLayer/SessionDAO";

const sessionDAO: SessionDAO = new SessionDAO();

const DAY_IN_MS = 1000 * 60 * 60 * 24;

export const sessionCookieName = 'auth-session';

export function generateSessionToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(18));
  return encodeBase64url(bytes);
}

export async function createSession(token: string, employeeID: string) {
  const sessionID = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const expiresAt = new Date(Date.now() + DAY_IN_MS * 30);

  return await sessionDAO.create(sessionID, employeeID, expiresAt);
}

export async function validateSessionToken(token: string): Promise<{ session: Session | null; employee: Employee | null }> {
  const sessionID = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

  const sessionWithUser = await sessionDAO.getByID(sessionID);

  if (!sessionWithUser) {
    return { session: null, employee: null };
  }

  const { session, employee } = sessionWithUser;

  const { expiresAt } = session;

  const expiredSession = Date.now() >= expiresAt.getTime();

  if (expiredSession) {
    await sessionDAO.delete(sessionID);

    return {
      session: null, employee: null
    };
  }

  const renewSession = Date.now() >= expiresAt.getTime() - DAY_IN_MS * 15;
  if (renewSession) {
    const newExpiresAt = new Date(Date.now() + DAY_IN_MS * 30);

    await sessionDAO.updateExpiresAt(sessionID, newExpiresAt);

    session.expiresAt = newExpiresAt;
  }

  return { session, employee };
}

export async function invalidateSession(sessionID: string) {
  await sessionDAO.delete(sessionID);
}

export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date) {
  event.cookies.set(sessionCookieName, token, {
    expires: expiresAt,
    path: "/",
  });
}

export function deleteSessionTokenCookie(event: RequestEvent) {
  event.cookies.delete(sessionCookieName, {
    path: "/facility",
  });
}