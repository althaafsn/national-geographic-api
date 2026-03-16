import { Utils } from '../util/Utils';
import { Configs } from '../config/Configs';
import { NewsPayload, PhotoPayload } from '../index';

/**
 * Static utilities that interface with National Geographic Photo of the Day and Latest News APIs.
 */
export class NationalGeographicAPI {
  private static DEFAULT_PAGE_SIZE = 3;
  private static DEFAULT_PAGE_NUMBER = 0;

  /**
   * Returns the latest news from National Geographic.
   * @param pageSize - Number of articles to return (default: 3).
   * @param pageNumber - Page number (default: 0).
   */
  public static async getLatestNews(pageSize?: number, pageNumber?: number): Promise<NewsPayload[]> {
    const queryPageSize = pageSize === undefined || isNaN(pageSize) ? this.DEFAULT_PAGE_SIZE : pageSize;
    const queryPageNumber = pageNumber === undefined || isNaN(pageNumber) ? this.DEFAULT_PAGE_NUMBER : pageNumber;
    const url = Utils.getLatestNewsUrl(queryPageSize, queryPageNumber);
    return Utils.fetchJson<NewsPayload[]>(url);
  }

  /**
   * Returns today's Photo of the Day from National Geographic,
   * scraped from the official photo-of-the-day page.
   */
  public static async getPhotoOfDay(): Promise<PhotoPayload> {
    const listingHtml = await Utils.fetchHtml(Configs.getPODListingUrl());
    const pageUrl = Utils.extractCanonical(listingHtml);

    if (!pageUrl) {
      throw new Error('Could not find photo page URL in listing page');
    }

    const photoHtml = await Utils.fetchHtml(pageUrl);
    const imageUrl = Utils.extractMeta(photoHtml, 'og:image');
    const title = Utils.extractMeta(photoHtml, 'og:title');
    const description = Utils.extractMeta(photoHtml, 'og:description');

    if (!imageUrl) {
      throw new Error('Could not find image URL in photo page');
    }

    return { imageUrl, title, description, pageUrl };
  }
}
