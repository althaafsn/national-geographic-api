describe('NationalGeographicAPI', () => {
  const TEST_PAGE_SIZE = 1234;
  const TEST_PAGE_NUMBER = 9876;
  const TEST_LISTING_URL = 'https://natgeo.com/photo-of-the-day';
  const TEST_PHOTO_URL = 'https://natgeo.com/photo-of-the-day/todays-photo';
  const TEST_IMAGE_URL = 'https://i.natgeofe.com/photo.jpg';
  const TEST_INVALID_PARAM = 'NOT_A_NUMBER';

  const mockFetchJson = jest.fn();
  const mockFetchHtml = jest.fn();
  const mockExtractMeta = jest.fn();
  const mockExtractCanonical = jest.fn();
  const mockGetLatestNewsUrl = jest.fn();
  const mockGetPODListingUrl = jest.fn();

  beforeEach(() => {
    mockGetLatestNewsUrl.mockReturnValue('TEST_NEWS_URL');
    mockGetPODListingUrl.mockReturnValue(TEST_LISTING_URL);

    jest.mock('../../src/util/Utils', () => ({
      Utils: {
        fetchJson: mockFetchJson,
        fetchHtml: mockFetchHtml,
        extractMeta: mockExtractMeta,
        extractCanonical: mockExtractCanonical,
        getLatestNewsUrl: mockGetLatestNewsUrl,
      },
    }));

    jest.mock('../../src/config/Configs', () => ({
      Configs: {
        getLatestNewsAPIUrl: jest.fn().mockReturnValue('https://natgeo.com/news'),
        getPODListingUrl: mockGetPODListingUrl,
      },
    }));
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  describe('getLatestNews', () => {
    it('uses defaults when called with no args', async () => {
      const { NationalGeographicAPI } = require('../../src/api/NationalGeographicAPI');
      await NationalGeographicAPI.getLatestNews();
      expect(mockGetLatestNewsUrl).toHaveBeenCalledWith(3, 0);
      expect(mockFetchJson).toHaveBeenCalledWith('TEST_NEWS_URL');
    });

    it('uses defaults when pageSize is invalid', async () => {
      const { NationalGeographicAPI } = require('../../src/api/NationalGeographicAPI');
      await NationalGeographicAPI.getLatestNews(TEST_INVALID_PARAM);
      expect(mockGetLatestNewsUrl).toHaveBeenCalledWith(3, 0);
    });

    it('uses defaults when both params are invalid', async () => {
      const { NationalGeographicAPI } = require('../../src/api/NationalGeographicAPI');
      await NationalGeographicAPI.getLatestNews(TEST_INVALID_PARAM, TEST_INVALID_PARAM);
      expect(mockGetLatestNewsUrl).toHaveBeenCalledWith(3, 0);
    });

    it('uses provided pageSize, defaults pageNumber when invalid', async () => {
      const { NationalGeographicAPI } = require('../../src/api/NationalGeographicAPI');
      await NationalGeographicAPI.getLatestNews(TEST_PAGE_SIZE, TEST_INVALID_PARAM);
      expect(mockGetLatestNewsUrl).toHaveBeenCalledWith(TEST_PAGE_SIZE, 0);
    });

    it('uses provided pageSize and pageNumber', async () => {
      const { NationalGeographicAPI } = require('../../src/api/NationalGeographicAPI');
      await NationalGeographicAPI.getLatestNews(TEST_PAGE_SIZE, TEST_PAGE_NUMBER);
      expect(mockGetLatestNewsUrl).toHaveBeenCalledWith(TEST_PAGE_SIZE, TEST_PAGE_NUMBER);
    });
  });

  describe('getPhotoOfDay', () => {
    it('throws when fetchHtml fails on listing page', async () => {
      mockFetchHtml.mockRejectedValueOnce(new Error('network error'));
      const { NationalGeographicAPI } = require('../../src/api/NationalGeographicAPI');
      await expect(NationalGeographicAPI.getPhotoOfDay()).rejects.toThrow('network error');
    });

    it('throws when no canonical URL is found', async () => {
      mockFetchHtml.mockResolvedValueOnce('<html></html>');
      mockExtractCanonical.mockReturnValueOnce('');
      const { NationalGeographicAPI } = require('../../src/api/NationalGeographicAPI');
      await expect(NationalGeographicAPI.getPhotoOfDay()).rejects.toThrow(
        'Could not find photo page URL',
      );
    });

    it('throws when no image URL is found in photo page', async () => {
      mockFetchHtml.mockResolvedValueOnce('<html>listing</html>');
      mockExtractCanonical.mockReturnValueOnce(TEST_PHOTO_URL);
      mockFetchHtml.mockResolvedValueOnce('<html>photo page</html>');
      mockExtractMeta.mockReturnValue('');
      const { NationalGeographicAPI } = require('../../src/api/NationalGeographicAPI');
      await expect(NationalGeographicAPI.getPhotoOfDay()).rejects.toThrow(
        'Could not find image URL',
      );
    });

    it('returns a PhotoPayload with scraped data', async () => {
      mockFetchHtml.mockResolvedValueOnce('<html>listing</html>');
      mockExtractCanonical.mockReturnValueOnce(TEST_PHOTO_URL);
      mockFetchHtml.mockResolvedValueOnce('<html>photo</html>');
      mockExtractMeta
        .mockReturnValueOnce(TEST_IMAGE_URL)   // og:image
        .mockReturnValueOnce('Photo Title')     // og:title
        .mockReturnValueOnce('A description'); // og:description

      const { NationalGeographicAPI } = require('../../src/api/NationalGeographicAPI');
      const result = await NationalGeographicAPI.getPhotoOfDay();

      expect(result).toEqual({
        imageUrl: TEST_IMAGE_URL,
        title: 'Photo Title',
        description: 'A description',
        pageUrl: TEST_PHOTO_URL,
      });
    });
  });
});
