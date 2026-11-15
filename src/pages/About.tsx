import Icon from "../components/Icon";
import Paragraphs from "../components/Paragraphs";
import { ErrorMessage, Loading } from "../components/StatusViews";
import { assetUrl, publicApi } from "../lib/api";
import { isIconName } from "../lib/icons";
import { sectionByKey, sectionsWithPrefix } from "../lib/sections";
import { useAsync } from "../lib/useAsync";

const fetchAbout = () => publicApi.page("about");

function About() {
  const { data, loading, error, reload } = useAsync(fetchAbout);

  if (loading) return <Loading />;
  if (error || !data) return <ErrorMessage message={error ?? "This page is not available right now."} onRetry={reload} />;

  const sections = data.sections ?? [];
  const intro = sectionByKey(sections, "about_intro");
  const reasonsIntro = sectionByKey(sections, "about_reasons_intro");
  const reasons = sectionsWithPrefix(sections, "about_reason_");

  // Everything else (including sections an editor adds later) is shown as a card.
  const special = new Set(["about_intro", "about_reasons_intro", ...reasons.map((r) => r.section_key)]);
  const cards = sections.filter((s) => !special.has(s.section_key));

  return (
    <section className="section">
      <div className="wrap about-page">
        {intro?.eyebrow && <p className="eyebrow dark">{intro.eyebrow}</p>}
        <h1>{intro?.heading ?? data.title}</h1>
        {intro?.body && <p className="about-lead">{intro.body}</p>}

        <div className="about-cards">
          {cards.map((section) => {
            const image = assetUrl(section.image_url);
            return (
              <article key={section.id} className="card">
                {section.heading && <h3>{section.heading}</h3>}
                <Paragraphs text={section.body} />
                {image && <img src={image} alt="" className="about-image" loading="lazy" />}
              </article>
            );
          })}
        </div>

        {(reasonsIntro || reasons.length > 0) && (
          <div className="about-reasons">
            {reasonsIntro?.heading && <h2>{reasonsIntro.heading}</h2>}
            {reasonsIntro?.body && <p className="about-lead">{reasonsIntro.body}</p>}
            <div className="grid-2">
              {reasons.map((reason) => (
                <article key={reason.id} className="card reason-card">
                  {isIconName(reason.icon) && <Icon name={reason.icon} size={30} badge="green" />}
                  <h3>{reason.heading}</h3>
                  <Paragraphs text={reason.body} />
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default About;
