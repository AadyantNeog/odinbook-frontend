import { NavLink } from "react-router";
import { Avatar } from "./Avatar";
import { Button } from "./Button";
import { useAuth } from "../context/useAuth";

export function AppShell({ children }) {
  const { user, signOut } = useAuth();

  return (
    <div className="shell">
      <div className="shell-noise" />
      <div className="shell-glow" />
      <header className="topbar">
        <NavLink to="/" className="brand">
          OdinBook
        </NavLink>

        <nav className="topnav">
          <NavLink to="/" className={({ isActive }) => `topnav-link${isActive ? " active" : ""}`}>
            Feed
          </NavLink>
          <NavLink
            to="/users"
            className={({ isActive }) => `topnav-link${isActive ? " active" : ""}`}
          >
            People
          </NavLink>
          <NavLink
            to="/requests"
            className={({ isActive }) => `topnav-link${isActive ? " active" : ""}`}
          >
            Requests
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) => `topnav-link${isActive ? " active" : ""}`}
          >
            Profile
          </NavLink>
        </nav>

        <div className="topbar-user">
          <Avatar user={user} size="sm" />
          <div>
            <p className="topbar-name">{user?.displayName}</p>
            <p className="topbar-meta">@{user?.username}</p>
          </div>
          <Button tone="ghost" onClick={signOut}>
            Sign out
          </Button>
        </div>
      </header>

      <main className="content">{children}</main>
    </div>
  );
}
