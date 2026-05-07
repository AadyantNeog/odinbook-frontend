import { useState } from "react";
import { Button } from "./Button";
import { Card } from "./Card";
import { Textarea } from "./Textarea";

export function PostComposer({ onCreate, busy }) {
  const [content, setContent] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    const trimmed = content.trim();

    if (!trimmed) {
      return;
    }

    await onCreate(trimmed);
    setContent("");
  }

  return (
    <Card accentTop>
      <form className="stack-lg" onSubmit={handleSubmit}>
        <div>
          <p className="eyebrow">New post</p>
          <h2>Place something worth keeping.</h2>
        </div>
        <Textarea
          label="Your note"
          rows={5}
          maxLength={2000}
          placeholder="Write a brief dispatch, a thought, or an observation."
          value={content}
          onChange={(event) => setContent(event.target.value)}
        />
        <div className="composer-footer">
          <p>{content.trim().length}/2000</p>
          <Button type="submit" disabled={busy || !content.trim()}>
            {busy ? "Publishing..." : "Publish"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
