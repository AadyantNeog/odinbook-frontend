import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Avatar } from "../components/Avatar";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { EmptyState } from "../components/EmptyState";
import { SectionLabel } from "../components/SectionLabel";
import { api } from "../lib/api";

function actionLabel(status) {
  switch (status) {
    case "following":
      return "Following";
    case "requested":
      return "Requested";
    case "requested_you":
      return "Respond in requests";
    default:
      return "Send request";
  }
}

export function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyUserId, setBusyUserId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadUsers() {
      try {
        const response = await api.get("/users");
        if (!ignore) {
          setUsers(response.users);
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadUsers();
    return () => {
      ignore = true;
    };
  }, []);

  async function handleRequest(userId) {
    setBusyUserId(userId);
    setError("");
    try {
      await api.post("/follow-requests", { receiverId: userId });
      setUsers((current) =>
        current.map((user) =>
          user.id === userId ? { ...user, relationshipStatus: "requested" } : user,
        ),
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyUserId(null);
    }
  }

  return (
    <div className="page">
      <SectionLabel>People</SectionLabel>
      <section className="page-heading">
        <h1>Find readers worth following.</h1>
        <p>Relationship status is resolved directly in the list so the UI stays immediate.</p>
      </section>

      {error ? <p className="form-error">{error}</p> : null}
      {loading ? <p className="status-copy">Loading people...</p> : null}
      {!loading && users.length === 0 ? (
        <EmptyState title="No other users yet" body="Create another account to test follows." />
      ) : null}

      <div className="user-grid">
        {users.map((user) => (
          <Card key={user.id} accentTop>
            <div className="stack-md">
              <div className="user-chip">
                <Avatar user={user} />
                <div>
                  <Link to={`/users/${user.id}`} className="post-author-link">
                    {user.displayName}
                  </Link>
                  <p className="post-meta">@{user.username}</p>
                </div>
              </div>
              <p>{user.bio || "No bio yet."}</p>
              <Button
                tone={user.relationshipStatus === "none" ? "primary" : "secondary"}
                disabled={user.relationshipStatus !== "none" || busyUserId === user.id}
                onClick={() => handleRequest(user.id)}
              >
                {busyUserId === user.id ? "Sending..." : actionLabel(user.relationshipStatus)}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
