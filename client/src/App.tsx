import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import LoginPage from "./pages/LoginPage";
import BoardsPage from "./pages/BoardsPage";
import BoardPage from "./pages/BoardPage";
import { User } from "./api/types";

export default function App() {
  const { user, loading, setUser, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <LoginPage onLogin={(u: User) => setUser(u)} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BoardsPage user={user} onLogout={logout} />} />
        <Route path="/boards/:id" element={<BoardPage user={user} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
