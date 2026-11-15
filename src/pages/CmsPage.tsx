import { useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import Paragraphs from "../components/Paragraphs";
import SmartLink from "../components/SmartLink";
import { ErrorMessage, Loading } from "../components/StatusViews";
import { ApiError, assetUrl, publicApi } from "../lib/api";
import { useAsync } from "../lib/useAsync";

/** Shows any published page created in the CMS (for example /our-story), section by section. */
function CmsPage() {
  const { slug = "" } = useParams();

  const fetchPage = useCallback(
    () =>
      publicApi.page(slug).catch((err) => {
        if (err instanceof ApiError && err.status === 404) {
          throw new Error("This page does not exist or has not been published.");
        }
        throw err;
      }),
    [slug]
  );

  const { data, loading, error, reload } = useAsync(fetchPage);

  if (loading) return <Loading />;

  if (error || !data) {
    return (
      <div>
        <ErrorMessage message={error ?? "This page is not available right now."} onRetry={reload} />
        <p className="status-link"><Link to="/">← Back to the home page</Link></p>
      </div>
    );
  }

  const sections = data.sections ?? [];

  return (
    <section className="section">
      <div className="wrap about-page">
        <h1>{data.title}</h1>

        <div className="about-cards">
          {sections.map((section) => {
            const image = assetUrl(section.image_url);
            return (
              <article key={section.id} className="card">
                {section.eyebrow && <p className="eyebrow dark">{section.eyebrow}</p>}
                {section.heading && <h3>{section.heading}</h3>}
                <Paragraphs text={section.body} />
                {image && <img src={image} alt="" className="about-image" loading="lazy" />}
                {(section.button_text && section.button_url) || (section.button2_text && section.button2_url) ? (
                  <div className="page-buttons">
                    {section.button_text && section.button_url && (
                      <SmartLink to={section.button_url} className="btn">{section.button_text}</SmartLink>
                    )}
                    {section.button2_text && section.button2_url && (
                      <SmartLink to={section.button2_url} className="btn btn-outline-dark">{section.button2_text}</SmartLink>
                    )}
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>

        {sections.length === 0 && <p className="about-lead">This page has no content yet.</p>}
      </div>
    </section>
  );
}

export default CmsPage;