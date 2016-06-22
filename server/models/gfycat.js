import { Base } from './base';
import rp from 'request-promise';
import _replace from 'lodash/replace';
import _each from 'lodash/each';
import _split from 'lodash/split';

export class Gfycat extends Base {
  constructor(opts) {
    super(opts);

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

    this.rp = rp;
  }

  parseSearchData(data) {
    const urls = [];

    _each(this.reverseFilter(data, image => {
      return image.nsfw == "0" && image.gifSize < 50000000;
    }), (image, index) => {
      const origUrl = image.gifUrl;
      const imageId = _split(_split(origUrl, '.com/')[1], '.gif')[0];
      const gifUrl = `https://giant.gfycat.com/${imageId}.gif`;
      const iframeUrl = `https://gfycat.com/ifr/${imageId}`;
      urls.push(...this.weightedUrl(
        {
          site: 'gfycat',
          id: imageId,
          orig_url: origUrl,
          image_url: gifUrl,
          iframe_url: iframeUrl
        },
        index
      ));
    });

    return urls;
  }

  request() {
    return this.rp(this.options);
  }

  search() {
    this.request()
      .then(results => {
        const data = results.gfycats;
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
