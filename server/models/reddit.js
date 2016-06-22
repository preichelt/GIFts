import { Base } from './base';
import rp from 'request-promise';
import _replace from 'lodash/replace';
import _each from 'lodash/each';
import _split from 'lodash/split';

export class Reddit extends Base {
  constructor(opts) {
    super(opts);

    this.subreddits = [
      'gifs',
      'gif',
      'reactiongifs',
      'highqualitygifs',
      'WastedGifs',
      'CatGifs',
      'doggifs',
      'Cinemagraphs',
      'GifRecipes',
      'educationalgifs',
      'combinedgifs',
      'aww_gifs',
      'chemicalreactiongifs',
      'physicsgifs',
      'mechanical_gifs',
      'michaelbaygifs',
      'gifextra',
      'reversegif',
      'noisygifs',
      'dashcamgifs',
      'DubbedGIFS',
      'SuperAthleteGifs',
      'shittyreactiongifs',
      'catreactiongifs',
      'gaminggifs',
      'InterestingGifs',
      'funny_gifs',
      'AnimalTextGifs',
      'GamePhysics',
      'analogygifs',
      'SpaceGifs',
      'K_gifs',
      'blackpeoplegifs',
      'StartledCats',
      'IdiotsFightingThings',
      'SlyGifs',
      'FullMovieGifs',
      'NatureGifs',
      'seinfeldgifs',
      'CorgiGifs',
      'perfectloops',
      'ScienceGIFs',
      'EarthPornGifs',
      'SuperSaiyanGifs',
      'FractalGifs',
      'OpticalIllusionGifs',
      'WeatherGifs',
      'RedneckGifs',
      'creepy_gif',
      'mathgifs',
      'BetterEveryLoop',
      'Puggifs',
      'mesmerizinggifs',
      'kittengifs',
      'hiphopgifs',
      'destructiongifs',
      'plantgifs',
      'breathinginformation',
      'soccergifs',
      'fail_gifs',
      'cringegifs'
    ].join('+');

    this.options = {
      uri: `https://www.reddit.com/r/${this.subreddits}/search.json`,
      headers: {
        referer: 'https://www.reddit.com'
      },
      qs: {
        q: _replace(this.searchTerm, ' ', '+'),
        restrict_sr: 'on',
        sort: 'relevance',
        t: 'all'
      },
      json: true
    };

    this.rp = rp;
  }

  parseSearchData(data) {
    const urls = [];

    _each(this.reverseFilter(data, image => {
      const url = image.data.url;

      return url.includes('gfycat') ||
        (url.includes('imgur') && !(
          url.includes('gallery') ||
          url.includes('jpg') ||
          url.includes('png') ||
          url.includes('/a/') ||
          url.includes('/r/')
        ));
    }), (image, index) => {
      const url = image.data.url;

      if(url.includes('gfycat')) {
        const imageId = _split(url, '.com/')[1];
        const gifUrl = `https://giant.gfycat.com/${imageId}.gif`;
        const iframeUrl = `https://gfycat.com/ifr/${imageId}`;
        urls.push(...this.weightedUrl(
          {
            site: 'gfycat',
            id: imageId,
            orig_url: url,
            image_url: gifUrl,
            iframe_url: iframeUrl
          },
          index
        ));
      } else {
        const imageId = _split(_split(url, '.gif')[0], '.com/')[1];
        const gifUrl = `http://i.imgur.com/${imageId}.gif`;
        urls.push(...this.weightedUrl(
          {
            site: 'imgur',
            id: imageId,
            orig_url: url,
            image_url: gifUrl
          },
          index
        ));
      }
    });

    return urls;
  }

  request() {
    return this.rp(this.options);
  }

  search() {
    this.request()
      .then(results => {
        const data = results.data.children;
        const weightedUrls = this.parseSearchData(data);

        if (weightedUrls.length == 0) {
          this.sendNoUrlsResponse();
        } else {
          const url = this.selectRandom(weightedUrls);
          this.sendDataResponse(url);
        }

      })
      .catch(error => {
        this.sendErrorResponse();
      });
  }
}
