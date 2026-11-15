import fallbackHero from "../assets/philippine eagle.jpg";
import Announcements from "../components/Announcements";
import Icon from "../components/Icon";
import Paragraphs from "../components/Paragraphs";
import SmartLink from "../components/SmartLink";
import { ErrorMessage, Loading } from "../components/StatusViews";
import { assetUrl, publicApi } from "../lib/api";
import { isIconName } from "../lib/icons";
import { sectionByKey, sectionsWithPrefix } from "../lib/sections";
import { useAsync } from "../lib/useAsync";

const fetchHome = () => publicApi.page("home");
const fetchPrograms = () => publicApi.programs();

function Home() {
  const page = useAsync(fetchHome);
  const programs = useAsync(fetchPrograms);

  if (page.loading || programs.loading) return <Loading />;

  const error = page.error ?? programs.error;
  if (error || !page.data) {
    return (
      <ErrorMessage
        message={error ?? "This page is not available right now."}
        onRetry={() => {
          page.reload();
          programs.reload();
        }}
      />
    );
  }

  const sections = page.data.sections ?? [];
  const hero = sectionByKey(sections, "hero");
  const actionsIntro = sectionByKey(sections, "actions_intro");
  const actions = sectionsWithPrefix(sections, "action_");
  const stats = sectionsWithPrefix(sections, "stat_");
  const pillarsIntro = sectionByKey(sections, "pillars_intro");
  const announcementsIntro = sectionByKey(sections, "announcements_intro");
  const cta = sectionByKey(sections, "cta");

  return (
    <>
      {hero && (
        <section
          className="hero"
          style={{ backgroundImage: `url(${assetUrl(hero.image_url) ?? fallbackHero})` }}
        >
          <div className="wrap hero-content">
            {hero.eyebrow && <p className="eyebrow">{hero.eyebrow}</p>}
            <h1>{hero.heading}</h1>
            {hero.body && <p className="hero-text">{hero.body}</p>}
            <div className="hero-buttons">
              {hero.button_text && hero.button_url && (
                <SmartLink to={hero.button_url} className="btn btn-gold">{hero.button_text}</SmartLink>
              )}
              {hero.button2_text && hero.button2_url && (
                <SmartLink to={hero.button2_url} className="btn btn-outline">{hero.button2_text}</SmartLink>
              )}
            </div>
          </div>
        </section>
      )}

      {actions.length > 0 && (
        <section className="section">
          <div className="wrap">
            {actionsIntro?.heading && <h2 className="section-title">{actionsIntro.heading}</h2>}
            <div className="grid-4">
              {actions.map((action) => {
                const content = (
                  <>
                    {isIconName(action.icon) && <Icon name={action.icon} size={32} badge="green" />}
                    <h3>{action.heading}</h3>
                    {action.body && <p>{action.body}</p>}
                  </>
                );
                return action.button_url ? (
                  <SmartLink key={action.id} to={action.button_url} className="action-card">
                    {content}
                  </SmartLink>
                ) : (
                  <div key={action.id} className="action-card">{content}</div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {stats.length > 0 && (
        <section className="section band">
          <div className="wrap stats">
            {stats.map((stat) => (
              <div key={stat.id}>
                <strong>{stat.heading}</strong>
                <span>{stat.body}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="section" id="pillars">
        <div className="wrap">
          {pillarsIntro?.heading && <h2 className="section-title">{pillarsIntro.heading}</h2>}
          {pillarsIntro?.body && <p className="section-sub">{pillarsIntro.body}</p>}
          {programs.data && programs.data.length === 0 && <p className="section-sub">No programs have been published yet.</p>}
          <div className="grid-2">
            {programs.data?.map((program) => {
              const image = assetUrl(program.image_url);
              return (
                <article key={program.id} className="pillar card">
                  {isIconName(program.icon) && <Icon name={program.icon} size={30} badge="green" />}
                  <h3>{program.title}</h3>
                  <Paragraphs text={program.description} />
                  {image && <img src={image} alt="" className="announcement-image" loading="lazy" />}
                  {program.items && program.items.length > 0 && (
                    <ul>
                      {program.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <Announcements heading={announcementsIntro?.heading ?? "Latest announcements"} />

      {cta && (
        <section className="cta">
          <div className="wrap">
            <h2>{cta.heading}</h2>
            {cta.button_text && cta.button_url && (
              <SmartLink to={cta.button_url} className="btn btn-gold">{cta.button_text}</SmartLink>
            )}
          </div>
        </section>
      )}
    </>
  );
}

export default Home;
