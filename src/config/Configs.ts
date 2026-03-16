export class Configs {
  private static LN_API_URL =
    'http://www.nationalgeographic.com/bin/services/core/public/query/content.json?' +
    'contentTypes=adventure/components/pagetypes/story/article,' +
    'adventure/components/pagetypes/story/gallery,' +
    'animals/components/pagetypes/story/article,' +
    'science/components/pagetypes/story/article,' +
    'travel/components/pagetypes/story/article' +
    '&sort=newest&operator=or' +
    '&includedTags=&excludedTags=ngs_genres:reference,ngs_visibility:omit_from_hp' +
    '&excludedGuids=beda7baa-e63b-4276-8122-34e47a4e653e';

  private static POD_LISTING_URL =
    'https://www.nationalgeographic.com/photography/photo-of-the-day';

  /* istanbul ignore next */
  private constructor() {}

  public static getLatestNewsAPIUrl() {
    return this.LN_API_URL;
  }

  public static getPODListingUrl() {
    return this.POD_LISTING_URL;
  }
}
