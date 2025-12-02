// src/api/authClient.ts
import axios from "axios";
import { tokenService } from "./tokenServide";

const authClient = axios.create({
  baseURL: import.meta.env.VITE_AUTH_API_URL,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
});

export type LoginResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope?: string;
};

export type LoginRequest = {
  username: string;
  password: string;
};

const CLIENT_ID = "client-02";
const CLIENT_SECRET = "secret";
const SCOPE = "roles profile email";
const GRANT_TYPE = "password";

export async function login(
  data: LoginRequest
): Promise<LoginResponse> {
  const body = new URLSearchParams();
  body.append("client_id", CLIENT_ID);
  body.append("client_secret", CLIENT_SECRET);
  body.append("grant_type", GRANT_TYPE);
  body.append("username", data.username);
  body.append("password", data.password);
  body.append("scope", SCOPE);

  const response = await authClient.post<LoginResponse>(
    "/connect/token",
    body
  );

  return response.data;
}

export function logout() {
  // Borra el access token almacenado
  tokenService.clearToken();

  // Opcional: también podrías borrar más cosas aquí (refresh, perfil, etc.)

  // Forzamos recarga y enviamos al login
  window.location.href = "/login";
}

export default authClient;
