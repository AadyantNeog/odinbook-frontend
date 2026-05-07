import { useEffect, useState } from "react";
import { EmptyState } from "../components/EmptyState";
import { PostCard } from "../components/PostCard";
import { PostComposer } from "../components/PostComposer";
import { SectionLabel } from "../components/SectionLabel";
import { api } from "../lib/api";

function replacePost(posts, nextPost) {
  return posts.map((entry) => (entry.id === nextPost.id ? nextPost : entry));
}

export function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [composerBusy, setComposerBusy] = useState(false);
  const [error, setError] = useState("");
  const [busyPostId, setBusyPostId] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function loadFeed() {
      try {
        const response = await api.get("/feed");
        if (!ignore) {
          setPosts(response.posts);
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

    loadFeed();
    return () => {
      ignore = true;
    };
  }, []);

  async function handleCreatePost(content) {
    setComposerBusy(true);
    setError("");
    try {
      const response = await api.post("/posts", { content });
      setPosts((current) => [response.post, ...current]);
    } catch (err) {
      setError(err.message);
    } finally {
      setComposerBusy(false);
    }
  }

  async function handleToggleLike(postId, likedByViewer) {
    setBusyPostId(postId);
    setError("");
    try {
      const response = likedByViewer
        ? await api.delete(`/posts/${postId}/like`)
        : await api.post(`/posts/${postId}/like`, {});
      setPosts((current) => replacePost(current, response.post));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyPostId(null);
    }
  }

  async function handleAddComment(postId, content) {
    setBusyPostId(postId);
    setError("");
    try {
      const response = await api.post(`/posts/${postId}/comments`, { content });
      setPosts((current) => replacePost(current, response.post));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyPostId(null);
    }
  }

  return (
    <div className="page">
      <section className="hero">
        <SectionLabel>Personal feed</SectionLabel>
        <h1>Recent notes from your circle.</h1>
        <p>
          The feed stays intentionally simple: your writing, the people you follow, and the
          conversation under each post.
        </p>
      </section>

      <PostComposer onCreate={handleCreatePost} busy={composerBusy} />

      {error ? <p className="form-error">{error}</p> : null}
      {loading ? <p className="status-copy">Loading feed...</p> : null}
      {!loading && posts.length === 0 ? (
        <EmptyState
          title="No posts yet"
          body="Create your first post or follow someone to bring the feed to life."
        />
      ) : null}

      <div className="stack-xl">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onToggleLike={handleToggleLike}
            onAddComment={handleAddComment}
            likeBusy={busyPostId === post.id}
            commentBusy={busyPostId === post.id}
          />
        ))}
      </div>
    </div>
  );
}
