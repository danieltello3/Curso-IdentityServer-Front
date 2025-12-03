import React, { use, useEffect, useState, type FormEvent } from "react";
import { tokenService } from "../api/tokenServide";
import { login, loginMicrosoft } from "../api/authClient";
import { useNavigate, useSearchParams } from "react-router-dom";

type LoginValues = {
  username: string;
  password: string;
};

const Login = () => {
  const [values, setValues] = useState<LoginValues>({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [searchParams] = useSearchParams();
  const error = searchParams.get("error");

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setLocalError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!values.username.trim() || !values.password.trim()) {
      setLocalError("Por favor, completa ambos campos.");
      return;
    }
    try {
      setIsLoading(true);
      const response = await login({
        username: values.username,
        password: values.password,
      });
      // Guarda token
      tokenService.setToken(response.access_token);
      // Redirige al dashboard o donde quieras
      navigate("/home");
    } catch (error) {
      setErrorMessage("Error en login. Por favor, intenta nuevamente.");
      console.error("Error en login:", error);
      // Aquí podrías manejar errores (mostrar mensaje usando props errorMessage, etc.)
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setErrorMessage(null);
    }, 5000);
    return () => clearTimeout(timeout);
  }, [errorMessage]);

  useEffect(() => {
    if (error === "external_login_failed") {
      setErrorMessage(
        "Error al iniciar sesión con Microsoft. Por favor, intenta nuevamente."
      );
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-950 to-slate-900 flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-16 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-16 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="backdrop-blur-xl bg-slate-900/60 border border-white/10 rounded-2xl shadow-2xl shadow-black/40 p-8">
          <div className="flex flex-col items-center gap-2 mb-8">
            <div className="p-2 rounded-2xl bg-linear-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-white text-2xl font-bold">
              {/* Logo simple */}
              <span>Galaxy</span>
            </div>
            <h1 className="text-2xl font-semibold text-white tracking-tight">
              Bienvenido
            </h1>
            <p className="text-sm text-slate-400 text-center">
              Ingresa tus credenciales para acceder al panel.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Username */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-slate-200 mb-1.5"
                >
                  Username
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6.75a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a7.5 7.5 0 0115 0"
                      />
                    </svg>
                  </span>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    className="block w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-900/70 border border-slate-700/70 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    placeholder="test"
                    value={values.username}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-200 mb-1.5"
                >
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.5 10.5V8.25a4.5 4.5 0 10-9 0v2.25M6.75 10.5h10.5v9.75H6.75z"
                      />
                    </svg>
                  </span>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    className="block w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900/70 border border-slate-700/70 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    placeholder="••••••••"
                    value={values.password}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute cursor-pointer inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-200 transition"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3.98 8.223C5.64 6.07 8.14 4.5 12 4.5c5.25 0 8.25 3.75 9.27 5.47a1.62 1.62 0 010 1.56c-.27.47-.68 1.12-1.23 1.82M9.88 9.88A3 3 0 0114.12 14.12M6.23 6.23L3 9.75m3.23-3.52L9.75 3m4.5 0l3.52 3.23M21 14.25l-3.23 3.52M9.75 21l-3.52-3.23"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 12C3.27 10.26 6.75 6 12 6s8.73 4.26 9.75 6c-1.02 1.74-4.5 6-9.75 6S3.27 13.74 2.25 12z"
                        />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Error */}
            {(localError || errorMessage) && (
              <p className="text-sm text-red-400 bg-red-950/40 border border-red-900/60 rounded-lg px-3 py-2">
                {localError || errorMessage}
              </p>
            )}

            {/* Botón */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-linear-to-r from-indigo-500 to-cyan-500 shadow-lg shadow-indigo-500/25 hover:from-indigo-400 hover:to-cyan-400 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {isLoading ? (
                <>
                  <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                <>Iniciar sesión</>
              )}
            </button>
          </form>
          <div className="mt-6 flex items-center gap-3 w-full max-w-md">
            <div className="h-px flex-1 bg-slate-700" />
            <span className="text-xs text-slate-400">o continúa con</span>
            <div className="h-px flex-1 bg-slate-700" />
          </div>

          {/* Botón Microsoft */}
          <button
            type="button"
            onClick={loginMicrosoft}
            className="cursor-pointer mt-3 w-full max-w-md inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm font-medium text-slate-100 border border-slate-700 transition"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#F25022" d="M11 11H4V4h7z" />
              <path fill="#00A4EF" d="M11 20H4v-7h7z" />
              <path fill="#7FBA00" d="M20 11h-7V4h7z" />
              <path fill="#FFB900" d="M20 20h-7v-7h7z" />
            </svg>
            <span>Continuar con Microsoft</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
