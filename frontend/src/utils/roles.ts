export type AppRole = 'Admin' | 'Manager' | 'User';

export const REALM_ROLES: AppRole[] = ['Admin', 'Manager', 'User'];

// Helpers para extrair/verificar roles no token
export function extractRealmRoles(tokenParsed?: any): string[] {
  return tokenParsed?.realm_access?.roles ?? [];
}

export function extractClientRoles(tokenParsed?: any, clientId?: string): string[] {
  if (!clientId) return [];
  return tokenParsed?.resource_access?.[clientId]?.roles ?? [];
}

export function hasAnyRole(
  userRoles: string[],
  required: string[] | undefined
): boolean {
  if (!required || required.length === 0) return true;
  return required.some(r => userRoles.includes(r));
}
