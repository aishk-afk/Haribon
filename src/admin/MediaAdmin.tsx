import { useState } from "react";
import { ErrorMessage, Loading } from "../components/StatusViews";
import { adminApi, errorMessage, storageUrl } from "../lib/api";
import { formatBytes } from "../lib/format";
import type { MediaItem } from "../lib/types";
import { useAsync } from "../lib/useAsync";
import { ConfirmDialog, Notice } from "./ui";
import type { ConfirmState, NoticeState } from "./ui";

const fetchMedia = () => adminApi.media();

export default function MediaAdmin() {
  const { data, loading, error, reload } = useAsync(fetchMedia);
  const [notice, setNotice] = useState<NoticeState | null>(null);
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);
  const [uploading, setUploading] = useState(false);

  const upload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setNotice(null);
    let done = 0;
    try {
      for (const file of Array.from(files)) {
        await adminApi.uploadMedia(file);
        done += 1;
      }
      setNotice({ type: "success", message: `${done} image${done === 1 ? "" : "s"} uploaded.` });
    } catch (err) {
      setNotice({ type: "error", message: errorMessage(err) });
    } finally {
      setUploading(false);
      reload();
    }
  };

  const remove = (item: MediaItem) =>
    setConfirm({
      title: "Delete image?",
      message: `“${item.filename}” will be deleted and removed from every page, program or announcement that uses it.`,
      confirmLabel: "Delete image",
      onConfirm: async () => {
        try {
          await adminApi.deleteMedia(item.id);
          setNotice({ type: "success", message: "Image deleted." });
          reload();
        } catch (err) {
          setNotice({ type: "error", message: errorMessage(err) });
        }
      },
    });

  if (loading) return <Loading />;
  if (error || !data) return <ErrorMessage message={error ?? "No data."} onRetry={reload} />;

  return (
    <>
      <h1>Media</h1>
      <p className="adm-muted">Upload images here, then pick them in any section, program or announcement.</p>
      <Notice notice={notice} onClose={() => setNotice(null)} />

      <div className="adm-actions start">
        <label className="adm-btn primary file">
          {uploading ? "Uploading..." : "Upload images"}
          <input
            type="file"
            multiple
            accept="image/png,image/jpeg,image/webp,image/gif"
            disabled={uploading}
            onChange={(e) => {
              void upload(e.target.files);
              e.target.value = "";
            }}
          />
        </label>
        <span className="adm-muted">JPG, PNG, WebP or GIF, up to 4 MB each.</span>
      </div>

      {data.length === 0 && <p>No images uploaded yet.</p>}
      <div className="adm-media-grid">
        {data.map((item) => (
          <figure key={item.id} className="adm-card adm-media-item">
            <img src={storageUrl(item.path) ?? ""} alt={item.filename} loading="lazy" />
            <figcaption>
              <strong title={item.filename}>{item.filename}</strong>
              <span className="adm-muted">{formatBytes(item.size)}</span>
              <button type="button" className="adm-btn small danger" onClick={() => remove(item)}>Delete</button>
            </figcaption>
          </figure>
        ))}
      </div>

      <ConfirmDialog state={confirm} onClose={() => setConfirm(null)} />
    </>
  );
}
