import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '@/contexts/auth-context';
import { LoginPage } from '@/pages/login';
import { RegisterPage } from '@/pages/register';
import { DashboardPage } from '@/pages/dashboard';
import { CategoriesPage } from '@/pages/categories';
import { TransactionsPage } from '@/pages/transactions';
import { ProfilePage } from '@/pages/profile';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <p className="text-gray-500">Carregando...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <p className="text-gray-500">Carregando...</p>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <p className="text-gray-500">Carregando...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          user ? (
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />
      <Route
        path="/categories"
        element={
          <PrivateRoute>
            <CategoriesPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/transactions"
        element={
          <PrivateRoute>
            <TransactionsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
