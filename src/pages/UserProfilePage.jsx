import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { EmptyState } from "../components/EmptyState";
import { PostCard } from "../components/PostCard";
import { ProfileHero } from "../components/ProfileHero";
import { SectionLabel } from "../components/SectionLabel";
import { api } from "../lib/api";

function replacePost(posts, nextPost) {
  return posts.map((entry) => (entry.id === nextPost.id ? nextPost : entry));
}

export function UserProfilePage() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyPostId, setBusyPostId] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function loadProfile() {
      try {
        const response = await api.get(`/users/${userId}/profile`);
        if (!ignore) {
          setProfile(response);
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

    loadProfile();
    return () => {
      ignore = true;
    };
  }, [userId]);

  async function handleToggleLike(postId, likedByViewer) {
    setBusyPostId(postId);
    try {
      const response = likedByViewer
        ? await api.delete(`/posts/${postId}/like`)
        : await api.post(`/posts/${postId}/like`, {});
      setProfile((current) => ({ ...current, posts: replacePost(current.posts, response.post) }));
    } finally {
      setBusyPostId(null);
    }
  }

  async function handleAddComment(postId, content) {
    setBusyPostId(postId);
    try {
      const response = await api.post(`/posts/${postId}/comments`, { content });
      setProfile((current) => ({ ...current, posts: replacePost(current.posts, response.post) }));
    } finally {
      setBusyPostId(null);
    }
  }

  if (loading) {
    return <p className="status-copy">Loading profile...</p>;
  }

  if (!profile) {
    return <p className="form-error">{error || "Profile not found."}</p>;
  }

  return (
    <div className="page">
      <SectionLabel>Public profile</SectionLabel>
      <ProfileHero user={profile.user} />
      {profile.posts.length === 0 ? (
        <EmptyState title="No posts yet" body="This profile has not published anything yet." />
      ) : null}
      <div className="stack-xl">
        {profile.posts.map((post) => (
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
