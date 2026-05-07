import { useEffect, useState } from "react";
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import { PostCard } from "../components/PostCard";
import { ProfileHero } from "../components/ProfileHero";
import { SectionLabel } from "../components/SectionLabel";
import { Textarea } from "../components/Textarea";
import { Button } from "../components/Button";
import { api } from "../lib/api";
import { useAuth } from "../context/useAuth";

function replacePost(posts, nextPost) {
  return posts.map((entry) => (entry.id === nextPost.id ? nextPost : entry));
}

export function ProfilePage() {
  const { setUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    displayName: "",
    bio: "",
    profilePictureUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyPostId, setBusyPostId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadProfile() {
      try {
        const response = await api.get("/users/me/profile");
        if (!ignore) {
          setProfile(response);
          setForm({
            displayName: response.user.displayName || "",
            bio: response.user.bio || "",
            profilePictureUrl: response.user.profilePictureUrl || "",
          });
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
  }, []);

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSave(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const response = await api.put("/users/me/profile", form);
      setProfile(response);
      setUser(response.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleLike(postId, likedByViewer) {
    setBusyPostId(postId);
    setError("");
    try {
      const response = likedByViewer
        ? await api.delete(`/posts/${postId}/like`)
        : await api.post(`/posts/${postId}/like`, {});
      setProfile((current) => ({ ...current, posts: replacePost(current.posts, response.post) }));
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
      setProfile((current) => ({ ...current, posts: replacePost(current.posts, response.post) }));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyPostId(null);
    }
  }

  if (loading) {
    return <p className="status-copy">Loading profile...</p>;
  }

  if (!profile) {
    return <p className="form-error">{error || "Unable to load profile."}</p>;
  }

  return (
    <div className="page">
      <SectionLabel>Your profile</SectionLabel>
      <ProfileHero user={profile.user} />

      <Card accentTop>
        <form className="stack-lg" onSubmit={handleSave}>
          <div className="page-heading">
            <h2>Edit profile</h2>
            <p>Photo URL is optional. If empty, the app falls back to Gravatar.</p>
          </div>
          <Input
            label="Display name"
            value={form.displayName}
            onChange={(event) => updateField("displayName", event.target.value)}
          />
          <Textarea
            label="Bio"
            rows={5}
            value={form.bio}
            onChange={(event) => updateField("bio", event.target.value)}
          />
          <Input
            label="Photo URL"
            value={form.profilePictureUrl}
            onChange={(event) => updateField("profilePictureUrl", event.target.value)}
          />
          {error ? <p className="form-error">{error}</p> : null}
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save profile"}
          </Button>
        </form>
      </Card>

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
