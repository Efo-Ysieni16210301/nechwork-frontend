import { useLoaderData } from "react-router-dom";
import ArticleList from "../ArticleList";

interface Article {
  name: string;
  title: string;
  content: string[];
  upvotes: number;
  comments: { postedBy: string; text: string }[];
}

export default function ArticlesList() {
  const articles = useLoaderData() as Article[];
  return <ArticleList articles={articles} />;
}
