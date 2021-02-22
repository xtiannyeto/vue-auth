import createAuth0Client, {
  Auth0Client,
  Auth0ClientOptions,
  GetIdTokenClaimsOptions,
  GetTokenSilentlyOptions,
  GetTokenWithPopupOptions,
  IdToken,
  LogoutOptions,
  RedirectLoginOptions,
  User
} from '@auth0/auth0-spa-js';
import { state } from './AuthState';

let client: Auth0Client;
const DEFAULT_REDIRECT_CALLBACK = () =>
  window.history.replaceState({}, document.title, window.location.pathname);

export async function loginWithPopup() {
  state.popupOpen = true;

  try {
    await client.loginWithPopup();
  } catch (e) {
    console.error(e);
  } finally {
    state.popupOpen = false;
  }
  const user = await client.getUser();
  state.user = user ? user : ({} as User);
  state.isAuthenticated = true;
}

export async function handleRedirectCallback(): Promise<void> {
  state.loading = true;

  try {
    await client.handleRedirectCallback();
    const user = await client.getUser();
    state.user = user ? user : ({} as User);
    state.isAuthenticated = true;
  } catch (e) {
    state.error = e;
  } finally {
    state.loading = false;
  }
}

export async function loginWithRedirect(
  o: RedirectLoginOptions
): Promise<void> {
  return client.loginWithRedirect(o);
}

export async function getIdTokenClaims(
  o: GetIdTokenClaimsOptions
): Promise<IdToken> {
  return client.getIdTokenClaims(o);
}

export async function getTokenSilently(
  o: GetTokenSilentlyOptions
): Promise<any> {
  return client.getTokenSilently(o);
}

export async function getTokenWithPopup(
  o: GetTokenWithPopupOptions
): Promise<string> {
  return client.getTokenWithPopup(o);
}

export function logout(o: LogoutOptions): void {
  return client.logout(o);
}

export async function initClient(
  options: Auth0ClientOptions,
  callbackRedirect: any
) {
  client = await createAuth0Client({
    onRedirectCallback: DEFAULT_REDIRECT_CALLBACK,
    redirect_uri: `${window.location.origin}/login/callback`,
    ...options
  });

  try {
    // If the user is returning to the app after authentication
    if (
      window.location.search.includes('code=') &&
      window.location.search.includes('state=')
    ) {
      // handle the redirect and retrieve tokens
      const { appState } = await client.handleRedirectCallback();

      // Notify subscribers that the redirect callback has happened, passing the appState
      // (useful for retrieving any pre-authentication state)
      callbackRedirect(appState);
    }
  } catch (e) {
    state.error = e;
  } finally {
    // Initialize our internal authentication state
    state.isAuthenticated = await client.isAuthenticated();
    const user = await client.getUser();
    state.user = user ? user : ({} as User);
    state.loading = false;
  }
}
