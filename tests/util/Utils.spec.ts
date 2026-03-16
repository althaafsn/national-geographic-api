import { Utils } from '../../src/util/Utils';
import { Configs } from '../../src/config/Configs';

describe('Utils', () => {
  let fetchSpy: jest.SpyInstance;

  beforeEach(() => {
    fetchSpy = jest.spyOn(globalThis, 'fetch');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('fetchJson', () => {
    const TEST_URL = 'https://example.com/api';
    const TEST_BODY = { items: [1, 2, 3] };

    it('resolves with parsed JSON on a successful response', async () => {
      fetchSpy.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(TEST_BODY),
      } as unknown as Response);

      const result = await Utils.fetchJson(TEST_URL);
      expect(result).toEqual(TEST_BODY);
    });

    it('throws when the response is not ok', async () => {
      fetchSpy.mockResolvedValue({ ok: false, status: 404 } as unknown as Response);
      await expect(Utils.fetchJson(TEST_URL)).rejects.toThrow('HTTP error: 404');
    });
  });

  describe('fetchHtml', () => {
    const TEST_URL = 'https://example.com/page';
    const TEST_HTML = '<html><head></head><body>hello</body></html>';

    it('resolves with text on a successful response', async () => {
      fetchSpy.mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(TEST_HTML),
      } as unknown as Response);

      const result = await Utils.fetchHtml(TEST_URL);
      expect(result).toEqual(TEST_HTML);
    });

    it('sends the correct User-Agent and Accept headers', async () => {
      fetchSpy.mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(TEST_HTML),
      } as unknown as Response);

      await Utils.fetchHtml(TEST_URL);

      expect(fetchSpy).toHaveBeenCalledWith(TEST_URL, expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({ 'User-Agent': expect.stringContaining('Mozilla') }),
      }));
    });

    it('throws when the response is not ok', async () => {
      fetchSpy.mockResolvedValue({ ok: false, status: 500 } as unknown as Response);
      await expect(Utils.fetchHtml(TEST_URL)).rejects.toThrow('HTTP error: 500');
    });
  });

  describe('extractMeta', () => {
    it('returns the content value for a matching property', () => {
      const html = `<meta property="og:image" content="https://example.com/image.jpg" />`;
      expect(Utils.extractMeta(html, 'og:image')).toBe('https://example.com/image.jpg');
    });

    it('returns empty string when the property is not found', () => {
      expect(Utils.extractMeta('<html></html>', 'og:image')).toBe('');
    });
  });

  describe('extractCanonical', () => {
    it('returns the href from a canonical link tag', () => {
      const html = `<link rel="canonical" href="https://example.com/page" />`;
      expect(Utils.extractCanonical(html)).toBe('https://example.com/page');
    });

    it('returns empty string when no canonical tag is present', () => {
      expect(Utils.extractCanonical('<html></html>')).toBe('');
    });
  });

  describe('getLatestNewsUrl', () => {
    it('appends pageSize and page query params', () => {
      const url = Utils.getLatestNewsUrl(5, 2);
      expect(url).toContain('&pageSize=5&page=2');
      expect(url).toContain(Configs.getLatestNewsAPIUrl());
    });
  });
});
