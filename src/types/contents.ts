interface Genre {
  slug: string;
  name: string;
}

interface Category {
  name: string;
}

export interface Staff {
  id: number;
  email?: string;
  role?: string;
  fullname: string;
  staff_email: string;
  vendor: string;
  licenses: string;
}

export interface ContentItem {
  id: number;
  subvendor: number;
  code: number;
  pin: number;
  currency: string;
  name: string;
  title: string;
  type: string;
  fullname: string;
  email: string;
  role: string;
  vendor: string;
  licenses: string;
  staff: Staff[];
  project: {
    title: string;
    code: string;
    vendor: string;
    subvendor: string;
    pin: number;
  };
  po_code: string;
  createdAt: string;
  total: number;
  status: string;
}

export interface Content {
  id: number;
  trailer_mp4: string;
  category: Category;
  description: string;
  featured?: boolean;
  file_mp4?: string;
  img_banner?: string;
  img_poster: string;
  title: string;
  upload_date: string;
  timedelta: string;
  genre?: Genre;
}

export interface ContentResponse {
  results: ContentItem[];
  response: ContentItem;
  [key: string]: unknown;
}
