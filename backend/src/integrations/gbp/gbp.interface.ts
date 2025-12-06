export interface GbpPostData {
  content: string;
  postType: 'NEWS' | 'EVENT' | 'OFFER' | 'PRODUCT';
  imageUrl?: string;
  ctaType?: string;
  ctaUrl?: string;
  eventStart?: Date;
  eventEnd?: Date;
}

export interface GbpPostResult {
  success: boolean;
  postId?: string;
  error?: string;
}

export interface GbpMetrics {
  viewCount: number;
  searchCount: number;
  phoneClicks: number;
  directionClicks: number;
  websiteClicks: number;
}

export interface IGbpService {
  createPost(locationId: string, data: GbpPostData): Promise<GbpPostResult>;
  deletePost(locationId: string, postId: string): Promise<boolean>;
  getMetrics(locationId: string, date: Date): Promise<GbpMetrics>;
}
