import { useState } from "react";
import { initialsForUser } from "../lib/avatars";

export function Avatar({ user, size = "md" }) {
  const [failed, setFailed] = useState(false);
  const initials = user?.initials || initialsForUser(user);
  const hasImage = user?.avatarUrl && !failed;

  return (
    <div className={`avatar avatar-${size}`}>
      {hasImage ? (
        <img src={user.avatarUrl} alt={user.displayName || user.username} onError={() => setFailed(true)} />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}
