import { Base } from './base';
import rp from 'request-promise';
import _replace from 'lodash/replace';
import _each from 'lodash/each';

export class Gfycat extends Base {
  constructor(responseUrl, user, searchTerm) {
    super(responseUrl, user, searchTerm, 'gfycat');

    this.options = {
      uri: 'https://api.gfycat.com/v1/gfycats/search',
      headers: {
        referer: 'https://www.gfycat.com'
      },
      qs: {
        search_text: _replace(this.searchTerm, ' ', '+'),
        count: '100'
      },
      json: true
    };
  }

  parseSearchData(data) {
    const urls = [];

    _each(this.reverseFilter(data, image => {
      return image.nsfw == "0" && image.gifSize < 50000000;
    }), (image, index) => {
      const url = image.gifUrl;
      urls.push(...this.weightedUrl(url, index));
    });

    return urls;
  }

  search() {
    rp(this.options)
    .then(results => {
      const data = results.gfycats;
      const weightedUrls = this.parseSearchData(data);

      if (weightedUrls.length == 0) {
        this.slack.sendNoUrlsResponse();
      } else {
        const url = this.selectRandom(weightedUrls);
        this.slack.sendUrlResponse(url, this.user);
      }
    })
    .catch(error => {
      this.slack.sendErrorResponse();
    });
  }
}
