import Keycloak from 'keycloak-js';

const url = import.meta.env.VITE_KEYCLOAK_URL as string;
const realm = import.meta.env.VITE_KEYCLOAK_REALM as string;
const clientId = import.meta.env.VITE_KEYCLOAK_CLIENT_ID as string;

if (!url || !realm || !clientId) {
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

/**
 * Evita múltiplas inicializações em dev (React StrictMode duplica efeitos).
 * Reutilizamos a mesma Promise entre chamadas.
 */
let hasInit = false;
let initPromise: Promise<boolean> | null = null;

export function initKeycloak(): Promise<boolean> {
    if (hasInit && initPromise) {
        return initPromise;
    }

    initPromise = keycloak
        .init({
            onLoad: 'check-sso',
            pkceMethod: 'S256',
            silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
            checkLoginIframe: true,
        })
        .then((authenticated) => {
            hasInit = true;
            return authenticated;
        })
        .catch((e: unknown) => {
            const err = e as { message?: string };
            const msg = err?.message ?? String(e);

            if (msg.includes('can only be initialized once')) {
                hasInit = true;
                return keycloak.authenticated ?? false;
            }

            console.error('[Keycloak] init error', e);
            return false;
        });


    return initPromise;
}
