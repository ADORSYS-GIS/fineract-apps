import { Store } from '@tanstack/store';

interface AuthState {
  isAuthenticated: boolean;
  base64EncodedAuthenticationKey?: string;
}

const getInitialState = (): AuthState => {
  try {
    const item = window.localStorage.getItem('auth');
    if (item) {
      return JSON.parse(item);
    }
  } catch (error) {
    console.error('Error reading from localStorage', error);
  }
  return {
    isAuthenticated: false,
  };
};

export const authStore = new Store<AuthState>(getInitialState());

authStore.subscribe(() => {
  try {
    window.localStorage.setItem('auth', JSON.stringify(authStore.state));
  } catch (error) {
    console.error('Error writing to localStorage', error);
  }
});

export const login = (base64EncodedAuthenticationKey: string) => {
  authStore.setState((state) => ({
    ...state,
    isAuthenticated: true,
    base64EncodedAuthenticationKey,
  }));
};

export const logout = () => {
  authStore.setState((state) => ({
    ...state,
    isAuthenticated: false,
    base64EncodedAuthenticationKey: undefined,
  }));
  window.localStorage.removeItem('auth');
};