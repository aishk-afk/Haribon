import type {
  AdminUser,
  Announcement,
  AnnouncementInput,
  Dashboard,
  MediaItem,
  Page,
  Program,
  ProgramInput,
  Section,
  SectionInput,
  Settings,
  Status,
} from "./types";

/**
 * Central API client for the Laravel CMS.
 *
 * VITE_API_BASE_URL defaults to "/api", which the Vite dev server proxies to Laravel,
 * so the browser only ever talks to one origin. Set it to a full URL
 * (for example https://cms.example.org/api) when the API lives elsewhere.
 */
const rawBase = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim();
const BASE = (rawBase || "/api").replace(/\/$/, "");
const API_ORIGIN = /^https?:\/\//i.test(BASE) ? new URL(BASE).origin : "";
const ASSET_BASE = (
  ((import.meta.env.VITE_ASSET_BASE_URL as string | undefined)?.trim() ?? API_ORIGIN)
).replace(/\/$/, "");

/** Turns a path like "/storage/uploads/a.jpg" returned by the API into a loadable URL. */
export function assetUrl(path: string | null | undefined): string | null {
  return path ? `${ASSET_BASE}${path}` : null;
}

/** Same, starting from a path on the public disk ("uploads/a.jpg"). */
export function storageUrl(path: string | null | undefined): string | null {
  return path ? `${ASSET_BASE}/storage/${path}` : null;
}

export class ApiError extends Error {
  status: number;
  errors: Record<string, string[]>;

  constructor(status: number, message: string, errors: Record<string, string[]> = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

/** A readable message for the UI, including the first validation error if there is one. */
export function errorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    const details = Object.values(err.errors).flat();
    return details.length ? details.join(" ") : err.message;
  }
  if (err instanceof TypeError) {
    return "Cannot reach the CMS server. Make sure the Laravel API is running.";
  }
  return err instanceof Error ? err.message : "Something went wrong.";
}

let csrfRequest: Promise<void> | null = null;

function xsrfToken(): string | null {
  const match = document.cookie.split("; ").find((c) => c.startsWith("XSRF-TOKEN="));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
}

function ensureCsrfCookie(): Promise<void> {
  if (!csrfRequest) {
    csrfRequest = fetch(`${API_ORIGIN}/sanctum/csrf-cookie`, { credentials: "include" })
      .then(() => undefined)
      .catch((err) => {
        csrfRequest = null;
        throw err;
      });
  }
  return csrfRequest;
}

type ErrorBody = { message?: string; errors?: Record<string, string[]> };

function parseJson(text: string): ErrorBody | null {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

async function request<T>(method: Method, path: string, body?: unknown, retry = true): Promise<T> {
  const headers: Record<string, string> = { Accept: "application/json" };
  const isForm = typeof FormData !== "undefined" && body instanceof FormData;

  if (body !== undefined && !isForm) headers["Content-Type"] = "application/json";

  if (method !== "GET") {
    await ensureCsrfCookie();
    const token = xsrfToken();
    if (token) headers["X-XSRF-TOKEN"] = token;
  }

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    credentials: "include",
    body: body === undefined ? undefined : isForm ? (body as FormData) : JSON.stringify(body),
  });

  // CSRF token expired: fetch a fresh one and try once more.
  if (res.status === 419 && retry) {
    csrfRequest = null;
    return request<T>(method, path, body, false);
  }

  const data = parseJson(await res.text());

  if (!res.ok) {
    throw new ApiError(res.status, data?.message ?? `Request failed (${res.status}).`, data?.errors);
  }

  return data as T;
}

const get = <T>(path: string) => request<T>("GET", path);
const send = <T>(method: Exclude<Method, "GET">, path: string, body?: unknown) =>
  request<T>(method, path, body);

type Data<T> = { data: T };
const unwrap = async <T>(promise: Promise<Data<T>>): Promise<T> => (await promise).data;

/* ------------------------------------------------------------------ public */

export const publicApi = {
  pages: () => unwrap(get<Data<Pick<Page, "id" | "title" | "slug">[]>>("/pages")),
  page: (slug: string) => unwrap(get<Data<Page>>(`/pages/${encodeURIComponent(slug)}`)),
  programs: () => unwrap(get<Data<Program[]>>("/programs")),
  announcements: (limit = 6) => unwrap(get<Data<Announcement[]>>(`/announcements?limit=${limit}`)),
  settings: () => unwrap(get<Data<Settings>>("/settings")),
};

/* ------------------------------------------------------------------- admin */

export const adminApi = {
  async login(email: string, password: string): Promise<AdminUser> {
    await ensureCsrfCookie();
    return unwrap(send<Data<AdminUser>>("POST", "/login", { email, password }));
  },
  logout: () => send<{ message: string }>("POST", "/logout"),
  me: () => unwrap(get<Data<AdminUser>>("/user")),
  dashboard: () => unwrap(get<Data<Dashboard>>("/admin/dashboard")),

  pages: () => unwrap(get<Data<Page[]>>("/admin/pages")),
  page: (id: number) => unwrap(get<Data<Page>>(`/admin/pages/${id}`)),
  createPage: (input: { title: string; slug: string; status: Status }) =>
    unwrap(send<Data<Page>>("POST", "/admin/pages", input)),
  updatePage: (id: number, input: { title: string; slug: string; status: Status }) =>
    unwrap(send<Data<Page>>("PUT", `/admin/pages/${id}`, input)),
  setPageStatus: (id: number, status: Status) =>
    unwrap(send<Data<Page>>("PATCH", `/admin/pages/${id}/status`, { status })),
  deletePage: (id: number) => send<{ message: string }>("DELETE", `/admin/pages/${id}`),

  createSection: (pageId: number, input: SectionInput) =>
    unwrap(send<Data<Section>>("POST", `/admin/pages/${pageId}/sections`, input)),
  updateSection: (id: number, input: SectionInput) =>
    unwrap(send<Data<Section>>("PUT", `/admin/sections/${id}`, input)),
  deleteSection: (id: number) => send<{ message: string }>("DELETE", `/admin/sections/${id}`),

  programs: () => unwrap(get<Data<Program[]>>("/admin/programs")),
  createProgram: (input: ProgramInput) => unwrap(send<Data<Program>>("POST", "/admin/programs", input)),
  updateProgram: (id: number, input: ProgramInput) =>
    unwrap(send<Data<Program>>("PUT", `/admin/programs/${id}`, input)),
  setProgramStatus: (id: number, status: Status) =>
    unwrap(send<Data<Program>>("PATCH", `/admin/programs/${id}/status`, { status })),
  deleteProgram: (id: number) => send<{ message: string }>("DELETE", `/admin/programs/${id}`),

  announcements: () => unwrap(get<Data<Announcement[]>>("/admin/announcements")),
  createAnnouncement: (input: AnnouncementInput) =>
    unwrap(send<Data<Announcement>>("POST", "/admin/announcements", input)),
  updateAnnouncement: (id: number, input: AnnouncementInput) =>
    unwrap(send<Data<Announcement>>("PUT", `/admin/announcements/${id}`, input)),
  setAnnouncementStatus: (id: number, status: Status) =>
    unwrap(send<Data<Announcement>>("PATCH", `/admin/announcements/${id}/status`, { status })),
  deleteAnnouncement: (id: number) => send<{ message: string }>("DELETE", `/admin/announcements/${id}`),

  media: () => unwrap(get<Data<MediaItem[]>>("/admin/media")),
  uploadMedia: (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return unwrap(send<Data<MediaItem>>("POST", "/admin/media", form));
  },
  deleteMedia: (id: number) => send<{ message: string }>("DELETE", `/admin/media/${id}`),

  settings: () => unwrap(get<Data<Settings>>("/admin/settings")),
  updateSettings: (settings: Settings) =>
    unwrap(send<Data<Settings>>("PUT", "/admin/settings", { settings })),
};
