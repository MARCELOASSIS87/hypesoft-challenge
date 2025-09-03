import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { keycloak, keycloakClientId, initKeycloak } from '@/lib/keycloak';
import { extractRealmRoles, extractClientRoles, hasAnyRole } from '@/utils/roles';

type AuthContextValue = {
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
  token: string | undefined;
  login: (opts?: Keycloak.KeycloakLoginOptions) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  hasRoles: (roles: string[] | undefined) => boolean;
};

export const AuthContext = createContext<AuthContextValue>({
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
});

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [initialized, setInitialized] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [profile, setProfile] = useState<AuthContextValue['profile']>(null);
  const [realmRoles, setRealmRoles] = useState<string[]>([]);
  const [clientRoles, setClientRoles] = useState<string[]>([]);
  const [token, setToken] = useState<string | undefined>(undefined);

  const populateFromToken = useCallback(async () => {
    const tokenParsed = keycloak.tokenParsed;
    setToken(keycloak.token);
    setRealmRoles(extractRealmRoles(tokenParsed));
    setClientRoles(extractClientRoles(tokenParsed, keycloakClientId));

    // Perfil básico
    setProfile({
      sub: tokenParsed?.sub,
      name: tokenParsed?.name,
      email: tokenParsed?.email,
      preferred_username: tokenParsed?.preferred_username,
    });
  }, []);

  const ensureSessionRefresh = useCallback(() => {
    // Atualiza token automaticamente
    const interval = window.setInterval(async () => {
      try {
        const refreshed = await keycloak.updateToken(30); // refresh se expira em <30s
        if (refreshed) {
          setToken(keycloak.token);
        }
      } catch (e) {
        console.warn('[Keycloak] updateToken falhou', e);
      }
    }, 20_000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    (async () => {
      const ok = await initKeycloak();
      setAuthenticated(ok);

      if (ok) {
        await populateFromToken();
        const cleanup = ensureSessionRefresh();
        setInitialized(true);
        return () => cleanup();
      } else {
        setInitialized(true);
      }
    })();
  }, [ensureSessionRefresh, populateFromToken]);

  const login = useCallback(async (opts?: Keycloak.KeycloakLoginOptions) => {
    await keycloak.login(opts);
  }, []);

  const logout = useCallback(async () => {
    await keycloak.logout({ redirectUri: window.location.origin });
  }, []);

  const refresh = useCallback(async () => {
    await keycloak.updateToken(60);
    await populateFromToken();
  }, [populateFromToken]);

  const hasRoles = useCallback(
    (required: string[] | undefined) => {
      const all = new Set([...realmRoles, ...clientRoles]);
      return hasAnyRole([...all], required);
    },
    [realmRoles, clientRoles]
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      initialized,
      authenticated,
      profile,
      realmRoles,
      clientRoles,
      token,
      login,
      logout,
      refresh,
      hasRoles,
    }),
    [initialized, authenticated, profile, realmRoles, clientRoles, token, login, logout, refresh, hasRoles]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
