import { useEffect, useState } from "react";
import { Avatar } from "../components/Avatar";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { EmptyState } from "../components/EmptyState";
import { SectionLabel } from "../components/SectionLabel";
import { api } from "../lib/api";

export function RequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyRequestId, setBusyRequestId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadRequests() {
      try {
        const response = await api.get("/follow-requests/incoming");
        if (!ignore) {
          setRequests(response.requests);
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

    loadRequests();
    return () => {
      ignore = true;
    };
  }, []);

  async function handleAction(requestId, action) {
    setBusyRequestId(requestId);
    setError("");
    try {
      await api.patch(`/follow-requests/${requestId}`, { action });
      setRequests((current) => current.filter((entry) => entry.id !== requestId));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyRequestId(null);
    }
  }

  return (
    <div className="page">
      <SectionLabel>Requests</SectionLabel>
      <section className="page-heading">
        <h1>Follow requests waiting on you.</h1>
        <p>Accept to create the follow. Reject to close the request without creating one.</p>
      </section>

      {error ? <p className="form-error">{error}</p> : null}
      {loading ? <p className="status-copy">Loading requests...</p> : null}
      {!loading && requests.length === 0 ? (
        <EmptyState title="Nothing pending" body="Incoming requests will appear here." />
      ) : null}

      <div className="stack-lg">
        {requests.map((request) => (
          <Card key={request.id}>
            <div className="request-row">
              <div className="user-chip">
                <Avatar user={request.requester} />
                <div>
                  <p className="post-author-link">{request.requester.displayName}</p>
                  <p className="post-meta">@{request.requester.username}</p>
                </div>
              </div>

              <div className="request-actions">
                <Button
                  tone="secondary"
                  onClick={() => handleAction(request.id, "rejected")}
                  disabled={busyRequestId === request.id}
                >
                  Reject
                </Button>
                <Button
                  onClick={() => handleAction(request.id, "accepted")}
                  disabled={busyRequestId === request.id}
                >
                  {busyRequestId === request.id ? "Saving..." : "Accept"}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
