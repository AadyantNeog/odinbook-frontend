export function initialsForUser(user) {
  const source = user?.displayName || user?.username || "?";
  return source
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((segment) => segment[0]?.toUpperCase())
    .join("");
}
