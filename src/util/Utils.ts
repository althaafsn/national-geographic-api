import { Configs } from '../config/Configs';
import { NewsPayload } from '../index';

export class Utils {
  /* istanbul ignore next */
  private constructor() {}

  public static async fetchJson<T = NewsPayload[]>(url: string): Promise<T> {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible)',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    return response.json() as Promise<T>;
  }

  public static async fetchHtml(url: string): Promise<string> {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:120.0) Gecko/20100101 Firefox/120.0',
        Accept: 'text/html,application/xhtml+xml',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    return response.text();
  }

  public static extractMeta(html: string, property: string): string {
    const match = html.match(new RegExp(`property="${property}"[^>]*content="([^"]+)"`));
    return match ? match[1] : '';
  }

  public static extractCanonical(html: string): string {
    const match = html.match(/rel="canonical"[^>]*href="([^"]+)"/);
    return match ? match[1] : '';
  }

  public static getLatestNewsUrl(pageSize: number, pageNumber: number): string {
    return `${Configs.getLatestNewsAPIUrl()}&pageSize=${pageSize}&page=${pageNumber}`;
  }
}
