export { NationalGeographicAPI } from './api/NationalGeographicAPI';

export interface NewsPayload {
  leadMedia: {
    altText: string;
    aspectRatio: number;
    height: number;
    width: number;
    internal: boolean;
    isVideo: boolean;
    url: string;
  };
  page: {
    abstract: string;
    publishDate: Date;
    series: string;
    sponsorContentLabel: string;
    sponsored: boolean;
    title: string;
    type: string;
    url: string;
  };
}

export interface PhotoPayload {
  imageUrl: string;
  title: string;
  description: string;
  pageUrl: string;
}
