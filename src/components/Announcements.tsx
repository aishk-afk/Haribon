import { assetUrl, publicApi } from "../lib/api";
import { useAsync } from "../lib/useAsync";
import Paragraphs from "./Paragraphs";

const fetchAnnouncements = () => publicApi.announcements(6);

const formatDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" }) : "";

/** Published announcements from the CMS. Renders nothing when there are none. */
export default function Announcements({ heading }: { heading: string }) {
  const { data } = useAsync(fetchAnnouncements);

  if (!data || data.length === 0) return null;

  return (
    <section className="section" id="announcements">
      <div className="wrap">
        <h2 className="section-title">{heading}</h2>
        <div className="grid-2 announcement-grid">
          {data.map((item) => {
            const image = assetUrl(item.image_url);
            return (
              <article key={item.id} className="card announcement-card">
                {image && <img src={image} alt="" className="announcement-image" loading="lazy" />}
                <p className="announcement-date">{formatDate(item.published_at)}</p>
                <h3>{item.title}</h3>
                <Paragraphs text={item.content} />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
