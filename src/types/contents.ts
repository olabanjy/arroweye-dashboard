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

export interface StaffItem {
  staff: Staff[];
  id: number | string;
  type: string;
  fullname: string;
  role: string;
}

export interface vendorItem {
  organization_name: string;
}
export interface ContentItem {
  start_dte?: string;
  cost?: number;
  tax_amount?: number;
  channel?: string;
  impressions?: number;
  audience?: number;
  end_dte?: string;
  archived?: boolean;
  id?: number | string;
  subvendor?: {
    organization_name: string;
  };
  organization_name?: string;
  items?: { service: { name: string; cost: number } }[];
  code?: number;
  pin?: number;
  currency?: string;
  name?: string;
  title?: string;
  type?: string;
  fullname?: string;
  email?: string;
  role?: string;
  vendor?: {
    organization_name: string;
  };
  licenses?: string;
  staff?: Staff[];
  project?: {
    title: string;
    code: string;
    vendor: string;
    subvendor: string;
    pin: number;
  };
  po_code?: string;
  created?: string;
  total?: number;
  status?: string;
}

export interface EventsItem {
  start_dte: string;
  end_dte: string;
  archived: boolean;
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
  created: string;
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
