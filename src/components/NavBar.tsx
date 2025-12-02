import React from "react";
import { Link, useLocation } from "react-router-dom";
import { logout } from "../api/authClient";

const NavBar: React.FC = () => {
  const { pathname } = useLocation();

  const navLinks = [
    { path: "/home", label: "Home" },
    { path: "/dashboard", label: "Dashboard" },
  ];

  return (
    <nav className="bg-slate-900 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between">
      <div className="text-white font-semibold text-lg tracking-tight">
        Mi App 🚀
      </div>

      <div className="flex items-center gap-4">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`text-sm font-medium px-3 py-1.5 rounded-lg transition 
                ${
                  pathname === link.path
                    ? "bg-indigo-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
          >
            {link.label}
          </Link>
        ))}
        <button
          type="button"
          onClick={logout}
          className="text-sm font-medium px-3 py-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-500 transition"
        >
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
