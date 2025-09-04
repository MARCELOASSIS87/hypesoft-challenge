import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type Keycloak from 'keycloak-js';
import { keycloak, keycloakClientId, initKeycloak } from '@/lib/keycloak';
import { extractRealmRoles, extractClientRoles, hasAnyRole } from '@/utils/roles';
import { AuthContext, type AuthContextType, type MinimalTokenParsed } from './auth-context';

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [initialized, setInitialized] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [profile, setProfile] = useState<AuthContextType['profile']>(null);
  const [realmRoles, setRealmRoles] = useState<string[]>([]);
  const [clientRoles, setClientRoles] = useState<string[]>([]);
  const [token, setToken] = useState<string | undefined>(undefined);

  const didInit = useRef(false); // evita init duplicado no StrictMode

  const populateFromToken = useCallback(async () => {
    const tokenParsed = keycloak.tokenParsed as MinimalTokenParsed | undefined;
    setToken(keycloak.token ?? undefined);
    setRealmRoles(extractRealmRoles(tokenParsed));
    setClientRoles(extractClientRoles(tokenParsed, keycloakClientId));

    setProfile({
      sub: tokenParsed?.sub,
      name: tokenParsed?.name,
      email: tokenParsed?.email,
      preferred_username: tokenParsed?.preferred_username,
    });
  }, []);

  const ensureSessionRefresh = useCallback(() => {
    // Atualiza token periodicamente
    const id = window.setInterval(async () => {
      try {
        const refreshed = await keycloak.updateToken(30);
        if (refreshed) setToken(keycloak.token ?? undefined);
      } catch (e) {
        console.warn('[Keycloak] updateToken falhou', e);
      }
    }, 20_000);

    // Também registra eventos úteis
    keycloak.onTokenExpired = async () => {
      try {
        await keycloak.updateToken(60);
        await populateFromToken();
      } catch (e) {
        console.warn('[Keycloak] refresh onTokenExpired falhou', e);
      }
    };

    keycloak.onAuthLogout = () => {
      setAuthenticated(false);
      setProfile(null);
      setRealmRoles([]);
      setClientRoles([]);
      setToken(undefined);
    };

    return () => window.clearInterval(id);
  }, [populateFromToken]);

  useEffect(() => {
    if (didInit.current) return; // StrictMode guard
    didInit.current = true;

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

  const hasRoles = useCallback<AuthContextType['hasRoles']>(
    (required) => {
      const all = new Set([...realmRoles, ...clientRoles]);
      return hasAnyRole([...all], required ?? []);
    },
    [realmRoles, clientRoles]
  );

  const value = useMemo<AuthContextType>(
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

export default AuthProvider;
