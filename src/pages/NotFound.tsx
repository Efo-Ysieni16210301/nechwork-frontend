import { Link, useRouteError } from "react-router-dom";

export default function NotFound() {
  const error = useRouteError();
  const is404 = axiosErrorIs404(error);

  return (
    <div className="article-page">
      <h1>{is404 ? "Article not found" : "Page not found"}</h1>
      <p>
        {is404
          ? "The article you're looking for doesn't exist."
          : "The link you followed to get here must be broken. Try again, or head back home."}
      </p>
      <Link to="/" className="article-back-link">
        ← Back home
      </Link>
    </div>
  );
}

function axiosErrorIs404(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    (error as { response?: { status?: number } }).response?.status === 404
  );
}
