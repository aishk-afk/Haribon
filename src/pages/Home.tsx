import { Link } from "react-router-dom";

function Home() {
  return (
    <section className="hero">
      <h1>Haribon Foundation</h1>
      <p className="hero-text">
        Haribon is an environmental organization. Its members are to train and
        nurture individuals who are instrumental in the formation of other
        environmental organizations in our country.
        <br />
        Haribon aims to promote environmental awareness and conservation efforts.
      </p>
      <Link to="/donate" className="btn">Donate now</Link>
    </section>
  );
}

export default Home;