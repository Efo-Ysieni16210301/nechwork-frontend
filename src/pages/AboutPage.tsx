import { company } from "../company";

export default function AboutPage() {
  return (
    <div className="about-page">
      <section className="about-hero">
        <h1>About Nech Work</h1>
        <p className="about-lead">
          Nech Work is a considered collection of everyday goods, gathered from
          makers and growers who care deeply about their craft.
        </p>
      </section>

      <section className="about-section">
        <h2>Why we started this</h2>
        <p>
          We started with a simple belief: the things we use every day should
          feel good to live with. From highland coffee and fragrant tea to
          pantry staples and hand-thrown homeware, each piece has a clear origin
          and a human story.
        </p>
      </section>

      <section className="about-section company-contact">
        <h2>Contact us</h2>
        <p>
          <strong>{company.name}</strong>
        </p>
        {company.offices.map((office) => (
          <p key={office.name}>
            <strong>{office.name}</strong>
            <br />
            Phone: <a href={`tel:${office.phone}`}>{office.phone}</a>
            <br />
            Address: {office.address}
          </p>
        ))}
      </section>

      <section className="about-section">
        <h2>What we cover</h2>
        <p>
          Thoughtful coffee, tea, pantry goods, homeware, and gifts. We keep our
          collection small so we can know the people behind the products and
          make room for new discoveries.
        </p>
      </section>

      <section className="about-section">
        <h2>How we work</h2>
        <p>
          We work directly with small producers wherever we can, pay fair
          prices, and choose materials and packaging with a lighter footprint.
          Good design is better when it is also good business.
        </p>
      </section>
    </div>
  );
}
