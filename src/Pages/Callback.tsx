import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { tokenService } from "../api/tokenServide";

const Callback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = searchParams.get("access_token");
    const returnUrl = searchParams.get("returnUrl") ?? "/dashboard";
    const error = searchParams.get("error");

    console.log("Callback params:", { accessToken, returnUrl, error });

    if (error || !accessToken) {
      // Si hubo error en el login externo o no hay token
      navigate("/?error=external_login_failed", { replace: true });
      return;
    }

    // Guardar el token (localStorage)
    tokenService.setToken(accessToken);

    // Opción 1: recargar app entera para que isAuthenticated se recalibre
    // window.location.href = returnUrl;

    // Opción 2 (si manejas auth con contexto y no quieres recargar):
    navigate(returnUrl, { replace: true });
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white">
      <div className="flex flex-col items-center gap-3">
        <span className="h-8 w-8 border-2 border-slate-500 border-t-slate-100 rounded-full animate-spin" />
        <p className="text-sm text-slate-300">
          Completando inicio de sesión con Microsoft...
        </p>
      </div>
    </div>
  );
};

export default Callback;
