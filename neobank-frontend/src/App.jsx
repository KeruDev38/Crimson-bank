import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Accounts from './components/Accounts';
import Transactions from './components/Transactions';
import Profile from './components/Profile';

function AppContent() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-6 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Crimson Bank</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Elegant digital banking for ambitious customers.
            </h1>
          </div>
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-300">Welcome, {user.username}</span>
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:border-crimson-600 hover:bg-slate-800"
              >
                Dashboard
              </Link>
            </div>
          ) : (
            <div className="flex gap-4">
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:border-crimson-600 hover:bg-slate-800"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-full bg-crimson-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-crimson-500"
              >
                Register
              </Link>
            </div>
          )}
        </header>

        <main className="mt-10">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
            <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
            <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/accounts" element={user ? <Accounts /> : <Navigate to="/login" />} />
            <Route path="/transactions" element={user ? <Transactions /> : <Navigate to="/login" />} />
            <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
