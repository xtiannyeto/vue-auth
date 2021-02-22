import { User } from '@auth0/auth0-spa-js';
import { reactive } from 'vue';

export interface AuthState {
  loading: boolean;
  isAuthenticated: boolean;
  user: User;
  popupOpen: boolean;
  error: any | null;
}

export const state = reactive({
  loading: true,
  isAuthenticated: false,
  user: {} as User,
  popupOpen: false,
  error: null
} as AuthState);
