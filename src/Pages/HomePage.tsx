import React from "react";
import NavBar from "../components/NavBar";

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-linear-to-br from-slate-700 via-slate-650 to-slate-800 text-slate-50">
      <NavBar />
      <main className=" flex-1 flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-3xl font-bold mb-4">Home</h1>
      </main>
    </div>
  );
};

export default HomePage;
