import { Avatar } from "./Avatar";

export function ProfileHero({ user }) {
  return (
    <section className="profile-hero">
      <Avatar user={user} size="lg" />
      <div className="stack-sm">
        <p className="eyebrow">Profile</p>
        <h1>{user.displayName}</h1>
        <p className="profile-handle">@{user.username}</p>
        <p className="profile-bio">{user.bio || "No bio yet."}</p>
      </div>
    </section>
  );
}
