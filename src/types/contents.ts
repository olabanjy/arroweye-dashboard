interface Genre {
  slug: string;
  name: string;
}

interface Category {
  name: string;
}

export interface ContentItem {
  id: number;
  name?: string;
  title: string;
  img_poster: string;
  trailer_mp4?: string;
  featured: boolean;
  category: Category;
  genre?: Genre;
  about?: string;
  description: string;
  upload_date: string;
  timedelta: string;
  img_banner: string;
  watch_times: string;
  display_name: string;
  file_mp4: string;
  thumbnail: string;
  banner: string;
  total_views: string;
  created_at: string;
  episodes?: Array<{
    id: string;
    img_banner: string;
    title: string;
    position: string;
    watch_times: string;
    upload_date: string;
  }>;
  data?: {
    phone?: string
  } | string;
  [key: string]: unknown;
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
