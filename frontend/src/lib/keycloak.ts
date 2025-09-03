import Keycloak from 'keycloak-js';

const url = import.meta.env.VITE_KEYCLOAK_URL as string;
const realm = import.meta.env.VITE_KEYCLOAK_REALM as string;
const clientId = import.meta.env.VITE_KEYCLOAK_CLIENT_ID as string;

if (!url || !realm || !clientId) {
  // Ajuda a identificar .env faltando
  // eslint-disable-next-line no-console
  console.warn(
    '[Keycloak] Variáveis ausentes: VITE_KEYCLOAK_URL, VITE_KEYCLOAK_REALM, VITE_KEYCLOAK_CLIENT_ID'
  );
}

export const keycloak = new Keycloak({
  url,
  realm,
  clientId,
});

export const keycloakClientId = clientId;

export async function initKeycloak(): Promise<boolean> {
  try {
    const authenticated = await keycloak.init({
      onLoad: 'check-sso',
      pkceMethod: 'S256',
      silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
      checkLoginIframe: true,
      // enableLogging: true, // habilite se quiser depurar
    });
    return authenticated;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('[Keycloak] init error', e);
    return false;
  }
}
