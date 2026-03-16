import { Configs } from '../../src/config/Configs';

describe('Configs', () => {
  it('getLatestNewsAPIUrl returns a URL containing the base news endpoint', () => {
    expect(Configs.getLatestNewsAPIUrl()).toContain('nationalgeographic.com');
  });

  it('getPODListingUrl returns the photo-of-the-day listing URL', () => {
    expect(Configs.getPODListingUrl()).toContain('photo-of-the-day');
  });
});
