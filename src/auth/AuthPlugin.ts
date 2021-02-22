import {
  Auth0ClientOptions,
  GetIdTokenClaimsOptions,
  GetTokenSilentlyOptions,
  GetTokenWithPopupOptions,
  IdToken,
  LogoutOptions,
  RedirectLoginOptions,
  User
} from '@auth0/auth0-spa-js';
import { computed, ComputedRef, inject, provide, Ref, ref } from 'vue';
import {
  getIdTokenClaims,
  getTokenSilently,
  getTokenWithPopup,
  handleRedirectCallback,
  initClient,
  loginWithPopup,
  loginWithRedirect,
  logout
} from './Auth';
import { state } from './AuthState';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $auth: Record<string, any>; //AuthPlugin
  }
}

export interface AuthPlugin {
  isAuthenticated: ComputedRef<boolean>;
  loading: ComputedRef<boolean>;
  user: ComputedRef<User>;
  getIdTokenClaims: (o: GetIdTokenClaimsOptions) => Promise<IdToken>;
  getTokenSilently: (o: GetTokenSilentlyOptions) => Promise<any>;
  getTokenWithPopup: (o: GetTokenWithPopupOptions) => Promise<string>;
  handleRedirectCallback: () => Promise<void>;
  loginWithRedirect: (o: RedirectLoginOptions) => Promise<void>;
  loginWithPopup: () => Promise<void>;
  logout: (o: LogoutOptions) => void;
}

export interface AuthPluginOption {
  options: Auth0ClientOptions;
  callbackRedirect: any;
}

export const authPlugin: AuthPlugin = {
  isAuthenticated: computed(() => state.isAuthenticated),
  loading: computed(() => state.loading),
  user: computed(() => state.user),
  getIdTokenClaims,
  getTokenSilently,
  getTokenWithPopup,
  handleRedirectCallback,
  loginWithRedirect,
  loginWithPopup,
  logout
} as AuthPlugin;

export const createAuth0 = async (
  options: Auth0ClientOptions,
  callbackRedirect: any
): Promise<AuthPlugin> => {
  await initClient(options, callbackRedirect);
  return authPlugin;
};

function install(authPlugin: AuthPlugin) {
  return {
    install: (app: any) => {
      app.config.globalProperties.$auth = authPlugin;
      app.provide('auth', authPlugin);
    }
  };
}

export const installAuth0 = async (config: AuthPluginOption) => {
  const auth = await createAuth0(config.options, config.callbackRedirect);
  return install(auth);
};

const auth0Symbol = Symbol();

export async function provideAuth0(config: AuthPluginOption): Promise<void> {
  const auth0 = ref();
  provide(auth0Symbol, auth0);
  auth0.value = await createAuth0(config.options, config.callbackRedirect);
}

export function useAuth0(): Ref<AuthPlugin> {
  const auth0 = inject(auth0Symbol);
  if (!auth0) {
    throw new Error('No auth0 provided!!!');
  }
  return auth0 as Ref<AuthPlugin>;
}
