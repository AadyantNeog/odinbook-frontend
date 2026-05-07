import { Navigate, Outlet, Route, Routes } from "react-router";
import { AppShell } from "./components/AppShell";
import { LoadingScreen } from "./components/LoadingScreen";
import { useAuth } from "./context/AuthContext";
import { FeedPage } from "./pages/FeedPage";
import { ProfilePage } from "./pages/ProfilePage";
import { RequestsPage } from "./pages/RequestsPage";
import { SignInPage } from "./pages/SignInPage";
import { SignUpPage } from "./pages/SignUpPage";
import { UserProfilePage } from "./pages/UserProfilePage";
import { UsersPage } from "./pages/UsersPage";

function ProtectedLayout() {
  const { isAuthenticated, isBootstrapping } = useAuth();

  if (isBootstrapping) {
    return <LoadingScreen label="Restoring your reading room" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}

function AuthLayout() {
  const { isAuthenticated, isBootstrapping } = useAuth();

  if (isBootstrapping) {
    return <LoadingScreen label="Preparing OdinBook" />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export function App() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Route>

      <Route element={<ProtectedLayout />}>
        <Route path="/" element={<FeedPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/requests" element={<RequestsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/users/:userId" element={<UserProfilePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
