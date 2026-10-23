import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-grid">
        <div>
          <h3>🦅 Haribon Foundation</h3>
          <p>Leading conservation in the Philippines since 1972.</p>
          <div className="socials">
            <a href="https://www.facebook.com/GoHaribon" target="_blank" rel="noreferrer">Facebook</a>
            <a href="https://www.instagram.com/goharibon/" target="_blank" rel="noreferrer">Instagram</a>
            <a href="https://ph.linkedin.com/company/goharibon" target="_blank" rel="noreferrer">LinkedIn</a>
          </div>
        </div>

        <div>
          <h4>Contact</h4>
          <p>Manila Observatory Bldg, Rm 212, Ateneo de Manila University, Katipunan Avenue, Loyola Heights, Quezon City 1108</p>
          <p>hello@haribon.org.ph</p>
        </div>

        <div>
          <h4>Get involved</h4>
          <p><Link to="/donate">Donate</Link></p>
          <p><a href="https://haribon.org.ph/become-a-member/" target="_blank" rel="noreferrer">Become a member</a></p>
          <p><a href="https://haribon.org.ph/partner-with-us/" target="_blank" rel="noreferrer">Partner with us</a></p>
          <p><a href="https://haribon.org.ph/" target="_blank" rel="noreferrer">Official website</a></p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © 2026 Student project inspired by the Haribon Foundation. Donations on this
          site run in Stripe test mode and no real money is collected.
        </p>
        
      </div>
    </footer>
  );
}

export default Footer;