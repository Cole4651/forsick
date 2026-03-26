import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Feed from './pages/Feed';
import Explore from './pages/Explore';
import Profile from './pages/Profile';
import PostDetail from './pages/PostDetail';

function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();
  if (loading) return <div className="flex justify-center p-8">Loading...</div>;
  return token ? children : <Navigate to="/landing" />;
}

export default function App() {
  const { token, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 dark:text-gray-100">
      {token && <Navbar />}
      <Routes>
        <Route path="/landing" element={token ? <Navigate to="/" /> : <Landing />} />
        <Route path="/login" element={token ? <Navigate to="/" /> : <main className="max-w-2xl mx-auto px-4 py-6"><Login /></main>} />
        <Route path="/register" element={token ? <Navigate to="/" /> : <main className="max-w-2xl mx-auto px-4 py-6"><Register /></main>} />
        <Route path="/" element={<ProtectedRoute><main className="max-w-2xl mx-auto px-4 py-6"><Feed /></main></ProtectedRoute>} />
        <Route path="/explore" element={<ProtectedRoute><main className="max-w-2xl mx-auto px-4 py-6"><Explore /></main></ProtectedRoute>} />
        <Route path="/profile/:username" element={<ProtectedRoute><main className="max-w-2xl mx-auto px-4 py-6"><Profile /></main></ProtectedRoute>} />
        <Route path="/post/:id" element={<ProtectedRoute><main className="max-w-2xl mx-auto px-4 py-6"><PostDetail /></main></ProtectedRoute>} />
        <Route path="*" element={<Navigate to={token ? "/" : "/landing"} />} />
      </Routes>
    </div>
  );
}
