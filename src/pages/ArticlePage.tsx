import { useState } from "react";
import {
  Link,
  useLoaderData,
  useParams,
  useRevalidator,
} from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

interface Comment {
  postedBy: string;
  text: string;
}

interface Article {
  name: string;
  title: string;
  content: string[];
  upvotes: number;
  comments: Comment[];
}

export default function ArticlePage() {
  const article = useLoaderData() as Article;
  const { name } = useParams();
  const revalidator = useRevalidator();
  const { user } = useAuth();

  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleUpvote = () => {
    api.post(`/articles/${name}/upvote`).then(() => {
      revalidator.revalidate();
    });
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!text.trim()) {
      setFormError("Please write a comment.");
      return;
    }

    setSubmitting(true);

    api
      .post(`/articles/${name}/comments`, { postedBy: user?.email, text })
      .then(() => {
        setText("");
        setSubmitting(false);
        revalidator.revalidate();
      })
      .catch((err) => {
        setFormError(err.response?.data?.error || "Failed to post comment");
        setSubmitting(false);
      });
  };

  return (
    <article className="article-page">
      <Link to="/articles" className="article-back-link">
        ← Back to articles
      </Link>
      <h1>{article.title}</h1>
      <div className="article-body">
        {article.content.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
      {user ? (
        <button onClick={handleUpvote} className="upvote-button">
          👍 {article.upvotes} upvotes
        </button>
      ) : (
        <p className="auth-prompt">
          👍 {article.upvotes} upvotes —{""} <Link to="/login">Log in</Link> to
          upvote
        </p>
      )}

      <section className="comments-section">
        <h2>Comments ({article.comments.length})</h2>

        {article.comments.length === 0 ? (
          <p className="no-comments">No comments yet. Be the first!</p>
        ) : (
          <ul className="comment-list">
            {article.comments.map((c, index) => (
              <li key={index} className="comment-item">
                <span className="comment-author">{c.postedBy}</span>
                <p className="comment-text">{c.text}</p>
              </li>
            ))}
          </ul>
        )}
        {user ? (
          <form onSubmit={handleCommentSubmit} className="comment-form">
            <textarea
              placeholder="Write a comment..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="comment-textarea"
            />
            {formError && <p className="comment-error">{formError}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="comment-submit"
            >
              {submitting ? "Posting..." : "Post Comment"}
            </button>
          </form>
        ) : (
          <p className="auth-prompt">
            <Link to="/login">Log in</Link> to leave a comment.
          </p>
        )}
      </section>
    </article>
  );
}
