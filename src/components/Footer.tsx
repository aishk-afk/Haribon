import { Link } from "react-router-dom";
import { useSettings } from "../context/settings";
import Icon from "./Icon";

function Footer() {
  const s = useSettings();

  return (
    <footer className="footer">
      <div className="wrap footer-grid">
        <div>
          <h3 className="footer-brand">
            <Icon name="logo" size={20} badge="white" /> {s.org_name}
          </h3>
          {s.footer_description && <p>{s.footer_description}</p>}
          <div className="socials">
            {s.facebook_url && (
              <a href={s.facebook_url} target="_blank" rel="noreferrer" aria-label="Facebook">
                <Icon name="facebook" size={16} badge="white" />
              </a>
            )}
            {s.instagram_url && (
              <a href={s.instagram_url} target="_blank" rel="noreferrer" aria-label="Instagram">
                <Icon name="instagram" size={16} badge="white" />
              </a>
            )}
            {s.linkedin_url && (
              <a href={s.linkedin_url} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <Icon name="linkedin" size={16} badge="white" />
              </a>
            )}
          </div>
        </div>

        <div>
          <h4>Contact</h4>
          {s.contact_address && (
            <p className="icon-line">
              <Icon name="location" size={16} badge="white" />
              <span>{s.contact_address}</span>
            </p>
          )}
          {s.contact_email && (
            <p className="icon-line">
              <Icon name="email" size={16} badge="white" />
              <span>{s.contact_email}</span>
            </p>
          )}
          {s.contact_phone && <p className="icon-line"><span>{s.contact_phone}</span></p>}
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
        {s.footer_notice && <p>{s.footer_notice}</p>}
        {s.credits_note && <p>{s.credits_note}</p>}
      </div>
    </footer>
  );
}

export default Footer;
