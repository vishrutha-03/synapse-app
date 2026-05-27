import { create } from "zustand";

type AuthState = {
  isLoggedIn: boolean;
  token?: string;
  username?: string;

  login: (token?: string, username?: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  token: undefined,
  username: undefined,

  login: (token, username) =>
    set({
      isLoggedIn: true,
      token,
      username,
    }),

  logout: () =>
    set({
      isLoggedIn: false,
      token: undefined,
      username: undefined,
    }),
}));