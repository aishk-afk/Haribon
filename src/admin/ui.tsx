import { useState } from "react";
import type { ReactNode } from "react";
import { adminApi, errorMessage, storageUrl } from "../lib/api";
import { useAsync } from "../lib/useAsync";
import type { Status } from "../lib/types";

/* ----------------------------------------------------------------- notices */

export interface NoticeState {
  type: "success" | "error";
  message: string;
}

export function Notice({ notice, onClose }: { notice: NoticeState | null; onClose?: () => void }) {
  if (!notice) return null;
  return (
    <div className={`adm-notice ${notice.type}`} role={notice.type === "error" ? "alert" : "status"}>
      <span>{notice.message}</span>
      {onClose && (
        <button type="button" className="adm-link" onClick={onClose} aria-label="Dismiss message">
          Dismiss
        </button>
      )}
    </div>
  );
}

export function StatusBadge({ status }: { status: Status }) {
  return <span className={`adm-badge ${status}`}>{status === "published" ? "Published" : "Draft"}</span>;
}

/* ----------------------------------------------------------- confirm dialog */

export interface ConfirmState {
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void | Promise<void>;
}

export function ConfirmDialog({ state, onClose }: { state: ConfirmState | null; onClose: () => void }) {
  const [busy, setBusy] = useState(false);
  if (!state) return null;

  const confirm = async () => {
    setBusy(true);
    try {
      await state.onConfirm();
    } finally {
      setBusy(false);
      onClose();
    }
  };

  return (
    <div
      className="adm-overlay"
      role="presentation"
      onKeyDown={(e) => e.key === "Escape" && onClose()}
    >
      <div className="adm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title">
        <h2 id="confirm-title">{state.title}</h2>
        <p>{state.message}</p>
        <div className="adm-actions">
          <button type="button" className="adm-btn" onClick={onClose} autoFocus>
            Cancel
          </button>
          <button type="button" className="adm-btn danger" onClick={confirm} disabled={busy}>
            {busy ? "Working..." : state.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------- form helper */

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="adm-field">
      <span className="adm-label">{label}</span>
      {children}
      {hint && <span className="adm-hint">{hint}</span>}
    </label>
  );
}

/* ------------------------------------------------------------ image picker */

const fetchMedia = () => adminApi.media();

function MediaLibrary({ onPick, onClose }: { onPick: (path: string) => void; onClose: () => void }) {
  const { data, loading, error } = useAsync(fetchMedia);

  return (
    <div className="adm-overlay" role="presentation" onKeyDown={(e) => e.key === "Escape" && onClose()}>
      <div className="adm-dialog wide" role="dialog" aria-modal="true" aria-labelledby="library-title">
        <h2 id="library-title">Choose an image</h2>
        {loading && <p>Loading images...</p>}
        {error && <Notice notice={{ type: "error", message: error }} />}
        {data && data.length === 0 && <p>No images uploaded yet. Upload one first.</p>}
        <div className="adm-media-grid">
          {data?.map((item) => (
            <button key={item.id} type="button" className="adm-media-pick" onClick={() => onPick(item.path)}>
              <img src={storageUrl(item.path) ?? ""} alt="" loading="lazy" />
              <span>{item.filename}</span>
            </button>
          ))}
        </div>
        <div className="adm-actions">
          <button type="button" className="adm-btn" onClick={onClose} autoFocus>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export function ImagePicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string | null;
  onChange: (path: string | null) => void;
}) {
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [notice, setNotice] = useState<NoticeState | null>(null);

  const upload = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    setNotice(null);
    try {
      const media = await adminApi.uploadMedia(file);
      onChange(media.path);
    } catch (err) {
      setNotice({ type: "error", message: errorMessage(err) });
    } finally {
      setUploading(false);
    }
  };

  const preview = storageUrl(value);

  return (
    <div className="adm-field">
      <span className="adm-label">{label}</span>
      <div className="adm-image-picker">
        <div className="adm-preview">
          {preview ? <img src={preview} alt="Selected" /> : <span>No image</span>}
        </div>
        <div className="adm-actions start">
          <label className="adm-btn file">
            {uploading ? "Uploading..." : "Upload new"}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              disabled={uploading}
              onChange={(e) => {
                void upload(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
          </label>
          <button type="button" className="adm-btn" onClick={() => setLibraryOpen(true)}>
            Choose from library
          </button>
          {value && (
            <button type="button" className="adm-btn" onClick={() => onChange(null)}>
              Remove
            </button>
          )}
        </div>
      </div>
      <span className="adm-hint">JPG, PNG, WebP or GIF, up to 4 MB.</span>
      <Notice notice={notice} />
      {libraryOpen && (
        <MediaLibrary
          onPick={(path) => {
            onChange(path);
            setLibraryOpen(false);
          }}
          onClose={() => setLibraryOpen(false)}
        />
      )}
    </div>
  );
}
