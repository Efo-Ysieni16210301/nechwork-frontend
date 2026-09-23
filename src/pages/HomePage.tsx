import { Link } from "react-router-dom";

const topics = [
  "Coffee",
  "Sesame & oilseeds",
  "Sugar & agro-industry",
  "Trade policy",
  "Manufacturing",
];

export default function HomePage() {
  return (
    <div className="home-page">
      <section className="home-hero">
        <h1>Ethiopia's economy, one export at a time.</h1>
        <p className="home-lead">
          Ethio Insights follows the crops, industries and policy decisions
          shaping how Ethiopia trades with the world — from coffee cooperatives
          in Kaffa to sesame fields in Humera and Metema, and the choices being
          made in between.
        </p>
        <Link to="/articles" className="btn btn-primary">
          Read the latest dispatches
        </Link>
      </section>

      <section className="home-topics">
        <h2>What we cover</h2>
        <ul className="topic-list">
          {topics.map((topic) => (
            <li key={topic}>{topic}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
