import type Keycloak from 'keycloak-js';

export type MinimalTokenParsed = {
  sub?: string;
  name?: string;
  email?: string;
  preferred_username?: string;
  realm_access?: { roles?: string[] };
  resource_access?: Record<string, { roles?: string[] }>;
};

export type AuthContextType = {
  initialized: boolean;
  authenticated: boolean;
  profile:
    | {
        sub?: string;
        name?: string;
        email?: string;
        preferred_username?: string;
      }
    | null;
  realmRoles: string[];
  clientRoles: string[];
  token?: string;
  login: (opts?: Keycloak.KeycloakLoginOptions) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  hasRoles: (roles?: string[]) => boolean;
};

export const defaultAuthContext: AuthContextType = {
  initialized: false,
  authenticated: false,
  profile: null,
  realmRoles: [],
  clientRoles: [],
  token: undefined,
  login: async () => {},
  logout: async () => {},
  refresh: async () => {},
  hasRoles: () => false,
};

import { createContext } from 'react';
export const AuthContext = createContext<AuthContextType>(defaultAuthContext);
