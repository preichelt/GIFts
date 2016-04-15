import { Base } from './base';
import rp from 'request-promise';
import _replace from 'lodash/replace';
import _each from 'lodash/each';
import _split from 'lodash/split';

export class Reddit extends Base {
  constructor(responseUrl, user, searchTerm) {
    super(responseUrl, user, searchTerm, 'reddit');

    const subreddits = [
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
      uri: `https://www.reddit.com/r/${subreddits}/search.json`,
      headers: {
        referer: 'https://www.reddit.com'
      },
      qs: {
        q: _replace(searchTerm, ' ', '+'),
        restrict_sr: 'on',
        sort: 'relevance',
        t: 'all'
      },
      json: true
    };
  }

  handleSearchResults(results) {
    const urls = [];

    _each(this.reverseFilter(results.data.children, function(result) {
      const url = result.data.url;

      return url.includes('imgur') && !(
        url.includes('gallery') ||
        url.includes('jpg') ||
        url.includes('png') ||
        url.includes('/a/') ||
        url.includes('/r/')
      );
    }), (result, index) => {
      const url = `${_split(result.data.url, '.gif')[0]}.gif`;
      urls.push(...this.weightedUrl(url, index));
    });

    return urls;
  }

  search() {
    rp(this.options).then((redditResults) => {
      const weightedUrls = this.handleSearchResults(redditResults);

      if (weightedUrls.length == 0) {
        this.slack.sendNoUrlsResponse();
      } else {
        const url = this.selectRandom(weightedUrls);
        this.slack.sendUrlResponse(url, this.user);
      }

    }).catch((error) => {
      this.slack.sendErrorResponse();
    });
  }
}
