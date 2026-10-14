export interface SendArtistReportInput {
  campaignId: string;
  recipient: string;
  /** Follower growth period in days, matching the page's range picker. */
  days: number;
}
