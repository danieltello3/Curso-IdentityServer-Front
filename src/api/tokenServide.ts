const ACCESS_TOKEN_KEY = "access_token";

export const tokenService = {
  getToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  setToken(token: string) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },

  clearToken() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  },
};