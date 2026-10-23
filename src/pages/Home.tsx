import { Link } from "react-router-dom";
import hero from "../assets/philippine eagle.jpg";

const actions = [
  { icon: "💚", title: "Donate", text: "Support conservation work across the country.", to: "/donate" },
  { icon: "👥", title: "Be a member", text: "Join a community of nature defenders.", href: "https://haribon.org.ph/become-a-member/" },
  { icon: "🤝", title: "Partner with us", text: "Work with Haribon on programs that matter.", href: "https://haribon.org.ph/partner-with-us/" },
  { icon: "🌱", title: "Volunteer", text: "Plant trees, watch birds and join cleanups.", href: "https://haribon.org.ph/events-calendar/" },
];

const pillars = [
  {
    title: "Conserving Sites & Habitats",
    text: "Protecting forests and critical habitats, from the Sierra Madre to the mountains of Panay.",
    programs: ["Forests for Life", "Central Sierra Madre", "Central Panay Mountain Range", "Project AGOS"],
  },
  {
    title: "Saving Species",
    text: "Defending threatened wildlife and stopping the illegal trade that endangers it.",
    programs: ["Species of Hope", "Illegal Parrot Trade"],
  },
  {
    title: "Empowering People",
    text: "Teaching communities and young people to look after the nature around them.",
    programs: ["WePhili Project", "Biodiversity on the Move", "Junior Sea Guardians"],
  },
  {
    title: "Encouraging Sustainability",
    text: "Building membership, volunteering and advocacy that keep conservation going.",
    programs: ["Membership & Volunteer Program", "NbS & BDFE", "Communications & Advocacy"],
  },
];

function Home() {
  return (
    <>
      <section className="hero" style={{ backgroundImage: `url(${hero})` }}>
        <div className="wrap hero-content">
          <p className="eyebrow">Since 1972</p>
          <h1>Leading conservation in the Philippines for over 50 years</h1>
          <p className="hero-text">
            Inspired by the Philippine Eagle, the Haring Ibon, Haribon works with
            members and communities to protect our shared ecosystems.
          </p>
          <div className="hero-buttons">
            <Link to="/donate" className="btn btn-gold">Donate now</Link>
            <a href="#pillars" className="btn btn-outline">Our work</a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <h2 className="section-title">Ways to take part</h2>
          <div className="grid-4">
            {actions.map((a) =>
              a.to ? (
                <Link key={a.title} to={a.to} className="action-card">
                  <span className="icon">{a.icon}</span>
                  <h3>{a.title}</h3>
                  <p>{a.text}</p>
                </Link>
              ) : (
                <a key={a.title} href={a.href} target="_blank" rel="noreferrer" className="action-card">
                  <span className="icon">{a.icon}</span>
                  <h3>{a.title}</h3>
                  <p>{a.text}</p>
                </a>
              )
            )}
          </div>
        </div>
      </section>

      <section className="section band">
        <div className="wrap stats">
          <div><strong>1972</strong><span>Year founded</span></div>
          <div><strong>50+</strong><span>Years of conservation</span></div>
          <div><strong>4</strong><span>Pillars of our work</span></div>
        </div>
      </section>

      <section className="section" id="pillars">
        <div className="wrap">
          <h2 className="section-title">Our four pillars</h2>
          <p className="section-sub">
            Haribon organizes its work around four goals, each with its own programs.
          </p>
          <div className="grid-2">
            {pillars.map((p) => (
              <article key={p.title} className="pillar card">
                <h3>{p.title}</h3>
                <p>{p.text}</p>
                <ul>
                  {p.programs.map((program) => (
                    <li key={program}>{program}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="wrap">
          <h2>Every contribution helps protect the Philippines’ forests and wildlife</h2>
          <Link to="/donate" className="btn btn-gold">Donate any amount</Link>
        </div>
      </section>
    </>
  );
}

export default Home;