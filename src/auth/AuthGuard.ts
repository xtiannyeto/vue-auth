import { watchEffect } from 'vue';
import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { authPlugin } from './AuthPlugin';

export const authGuard = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const verify = () => {
    console.log(authPlugin.isAuthenticated.value);
    // If the user is authenticated, continue with the route
    if (authPlugin.isAuthenticated.value) {
      return next();
    }
    // Otherwise, log in
    authPlugin.loginWithRedirect({ appState: { targetUrl: to.fullPath } });
  };
  // If loading has already finished, check our auth state using `fn()`
  if (!authPlugin.loading.value) {
    return verify();
  }

  // Watch for the loading property to change before we check isAuthenticated
  watchEffect(() => {
    if (authPlugin.loading.value === false) {
      return verify();
    }
  });
};
