import { Link } from "react-router-dom";

interface Article {
  name: string;
  title: string;
  content: string[];
  upvotes: number;
  comments: { postedBy: string; text: string }[];
}

interface ArticleListProps {
  articles: Article[];
}

export default function ArticleList({ articles }: ArticleListProps) {
  return (
    <section className="article-list-page">
      <h1>Articles</h1>
      <div className="article-grid">
        {articles.map((a) => (
          <Link
            key={a.name}
            to={"/articles/" + a.name}
            className="article-card"
          >
            <h3>{a.title}</h3>
            <p>{a.content[0].substring(0, 150)}...</p>
            <span className="article-read-more">Read more →</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
