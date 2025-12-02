import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./Pages/Login";
import HomePage from "./Pages/HomePage";
import Dashboard from "./Pages/Dashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route path="/home" element={<HomePage />} />
      <Route path="/dashboard" element={<Dashboard />} />

      {/* 
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute isAuthenticated={fakeIsAuthenticated}>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      */}

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
