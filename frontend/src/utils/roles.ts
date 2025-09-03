import type { MinimalTokenParsed } from '@/context/auth-context';

export type AppRole = 'Admin' | 'Manager' | 'User';
export const REALM_ROLES: AppRole[] = ['Admin', 'Manager', 'User'];

export function extractRealmRoles(tokenParsed?: MinimalTokenParsed): string[] {
  return tokenParsed?.realm_access?.roles ?? [];
}

export function extractClientRoles(tokenParsed?: MinimalTokenParsed, clientId?: string): string[] {
  if (!clientId) return [];
  return tokenParsed?.resource_access?.[clientId]?.roles ?? [];
}

export function hasAnyRole(userRoles: string[], required: string[] = []): boolean {
  if (required.length === 0) return true;
  return required.some((r) => userRoles.includes(r));
}
