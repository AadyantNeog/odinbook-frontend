import { Link } from "react-router";
import { useState } from "react";
import { Avatar } from "./Avatar";
import { Button } from "./Button";
import { Card } from "./Card";

function formatDate(value) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function PostCard({ post, onToggleLike, onAddComment, likeBusy, commentBusy }) {
  const [comment, setComment] = useState("");

  async function handleCommentSubmit(event) {
    event.preventDefault();
    const trimmed = comment.trim();
    if (!trimmed) {
      return;
    }
    await onAddComment(post.id, trimmed);
    setComment("");
  }

  return (
    <Card className="post-card">
      <div className="post-header">
        <div className="user-chip">
          <Avatar user={post.author} />
          <div>
            <Link to={`/users/${post.author.id}`} className="post-author-link">
              {post.author.displayName}
            </Link>
            <p className="post-meta">
              @{post.author.username} | {formatDate(post.createdAt)}
            </p>
          </div>
        </div>
      </div>

      <p className="post-content">{post.content}</p>

      <div className="post-actions">
        <Button
          tone={post.likedByViewer ? "secondary" : "ghost"}
          onClick={() => onToggleLike(post.id, post.likedByViewer)}
          disabled={likeBusy}
        >
          {post.likedByViewer ? "Unlike" : "Like"} | {post.likesCount}
        </Button>
        <p>{post.comments.length} comments</p>
      </div>

      <div className="comment-list">
        {post.comments.map((entry) => (
          <article key={entry.id} className="comment-item">
            <Avatar user={entry.author} size="sm" />
            <div>
              <p className="comment-meta">
                <strong>{entry.author.displayName}</strong> @{entry.author.username}
              </p>
              <p>{entry.content}</p>
            </div>
          </article>
        ))}
      </div>

      <form className="comment-form" onSubmit={handleCommentSubmit}>
        <textarea
          className="textarea"
          rows={3}
          placeholder="Add a considered reply."
          value={comment}
          onChange={(event) => setComment(event.target.value)}
        />
        <div className="comment-submit">
          <Button type="submit" disabled={commentBusy || !comment.trim()}>
            {commentBusy ? "Posting..." : "Comment"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
