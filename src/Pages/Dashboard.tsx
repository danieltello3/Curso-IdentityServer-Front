import React, { useEffect, useState } from "react";
import useApi from "../hooks/useApi";
import type { WeatherResponse } from "../types/types";
import NavBar from "../components/NavBar";

const WeatherDashboardPage: React.FC = () => {
  const [data, setData] = useState<WeatherResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { getWeather } = useApi();

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await getWeather();
        if (!result) {
          setError("No se encontraron datos de clima.");
          return;
        }
        setData(result);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar el clima. Intenta nuevamente.");
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  const isToday = (dateStr: string) => {
    const today = new Date();
    const d = new Date(dateStr);
    return (
      d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() === today.getDate()
    );
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("es-PE", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-700 via-slate-650 to-slate-800 text-slate-50 flex flex-col">
      <NavBar />
      {/* Header */}
      <header className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-xl font-semibold tracking-tight">
            Panel de Clima
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Pronóstico obtenido desde tu API protegida.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-400">
          <div className="flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>API online</span>
          </div>
        </div>
      </header>

      {/* Contenido */}
      <main className="flex-1 px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Estado de carga */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20">
              <span className="h-8 w-8 border-2 border-slate-500 border-t-slate-100 rounded-full animate-spin mb-4" />
              <p className="text-sm text-slate-300">Cargando pronóstico...</p>
            </div>
          )}

          {/* Error */}
          {error && !isLoading && (
            <div className="bg-red-950/40 border border-red-900/60 text-red-200 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          {/* Sin datos */}
          {!isLoading && !error && data.length === 0 && (
            <div className="bg-slate-900/60 border border-slate-800 text-slate-300 text-sm rounded-xl px-4 py-6 text-center">
              No hay datos de clima para mostrar.
            </div>
          )}

          {/* Tarjetas de clima */}
          {!isLoading && !error && data.length > 0 && (
            <>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-base sm:text-lg font-semibold">
                    Próximos días
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400">
                    Temperaturas en °C y °F con resumen del clima.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {data.map((item, index) => {
                  const today = isToday(item.date);

                  return (
                    <article
                      key={`${item.date}-${index}`}
                      className={`
        relative overflow-hidden rounded-2xl border shadow-lg shadow-black/30 p-4 flex flex-col gap-3 group
        bg-slate-900/70 
        ${
          today
            ? "border-indigo-500/60 shadow-indigo-500/30 ring-2 ring-indigo-400/30"
            : "border-slate-800"
        }
      `}
                    >
                      {/* Fondo de gradiente suave */}
                      <div className="pointer-events-none absolute inset-0 opacity-60 group-hover:opacity-80 transition">
                        <div className="absolute -top-16 -right-10 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl" />
                        <div className="absolute -bottom-16 -left-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl" />
                      </div>

                      <div className="relative flex items-start justify-between gap-3">
                        <div>
                          <div className="flex flex-row gap-2 items-center">
                            <p
                              className={`text-[11px] uppercase tracking-[0.16em] 
                              ${today ? "text-indigo-300" : "text-slate-400"}`}
                            >
                              {formatDate(item.date)}
                            </p>
                            {today && (
                              <span className="px-3 py-1 text-[10px] font-semibold rounded-full bg-indigo-600 text-white shadow-md uppercase tracking-wide">
                                HOY
                              </span>
                            )}
                          </div>

                          <p
                            className={`text-sm mt-1 
              ${today ? "text-indigo-100 font-semibold" : "text-slate-200"}`}
                          >
                            {item.summary || "Sin descripción"}
                          </p>
                        </div>

                        <div className="text-right">
                          <p
                            className={`text-2xl font-semibold leading-none 
              ${today ? "text-indigo-400" : "text-white"}`}
                          >
                            {item.temperatureC.toFixed(0)}°
                            <span className="text-sm align-top ml-0.5 text-slate-300">
                              C
                            </span>
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            {item.temperatureF.toFixed(0)}° F
                          </p>
                        </div>
                      </div>

                      <div className="relative mt-2 flex items-center justify-between text-xs text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-1.5 h-1.5 rounded-full 
              ${today ? "bg-indigo-400" : "bg-sky-400"}`}
                          />
                          <span>
                            Sensación aprox.{" "}
                            <span
                              className={`${
                                today ? "text-indigo-300" : "text-slate-200"
                              }`}
                            >
                              {item.temperatureC.toFixed(0)}°C
                            </span>
                          </span>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default WeatherDashboardPage;
