// Shapes of the JSON returned by the Laravel CMS API.

export type Status = "published" | "draft";

export interface Section {
  id: number;
  page_id: number;
  section_key: string;
  eyebrow: string | null;
  heading: string | null;
  body: string | null;
  icon: string | null;
  image_path: string | null;
  image_url: string | null;
  button_text: string | null;
  button_url: string | null;
  button2_text: string | null;
  button2_url: string | null;
  display_order: number;
}

export interface Page {
  id: number;
  title: string;
  slug: string;
  status: Status;
  sections?: Section[];
  sections_count?: number;
}

export interface Program {
  id: number;
  title: string;
  description: string | null;
  icon: string | null;
  items: string[] | null;
  image_path: string | null;
  image_url: string | null;
  status: Status;
  published_at: string | null;
  display_order: number;
}

export interface Announcement {
  id: number;
  title: string;
  content: string;
  image_path: string | null;
  image_url: string | null;
  status: Status;
  published_at: string | null;
  created_at: string;
}

export interface MediaItem {
  id: number;
  filename: string;
  path: string;
  url: string;
  mime_type: string;
  size: number;
}

export type Settings = Record<string, string | null>;

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
}

export interface Dashboard {
  pages: { total: number; published: number };
  sections: number;
  programs: { total: number; published: number };
  announcements: { total: number; published: number };
  media: number;
}

export interface SectionInput {
  section_key: string;
  eyebrow: string | null;
  heading: string | null;
  body: string | null;
  icon: string | null;
  image_path: string | null;
  button_text: string | null;
  button_url: string | null;
  button2_text: string | null;
  button2_url: string | null;
  display_order: number | null;
}

export interface ProgramInput {
  title: string;
  description: string | null;
  icon: string | null;
  items: string[];
  image_path: string | null;
  status: Status;
  display_order: number | null;
}

export interface AnnouncementInput {
  title: string;
  content: string;
  image_path: string | null;
  status: Status;
}
