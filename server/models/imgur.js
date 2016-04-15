import { Base } from './base';
import rp from 'request-promise';
import _replace from 'lodash/replace';
import _each from 'lodash/each';

export class Imgur extends Base {
  constructor(responseUrl, user, searchTerm, ext) {
    super(responseUrl, user, searchTerm, 'imgur');
    this.ext = ext;
  }

  options(searchType) {
    const uriBase = 'http://imgur.com/search/score/all/page/1.json';
    const qType = `q_type=${this.ext}`;
    const qSearch = `q_${searchType}=${_replace(this.searchTerm, ' ', '%20')}`;

    return {
      method: 'POST',
      uri: `${uriBase}?${qType}&${qSearch}`,
      headers: {
        referer: 'http://imgur.com'
      },
      json: true
    };
  }

  handleSearchResults(results) {
    const urls = [];

    _each(this.reverseFilter(results.data, function(result) {
      return result.nsfw == false;
    }), (result, index) => {
      const url = `http://i.imgur.com/${result.hash}.${this.ext}`;
      urls.push(...this.weightedUrl(url, index));
    });

    return urls;
  }

  search() {
    rp(this.options('all')).then((imgurAllOfResults) => {
      const weightedAllOfUrls = this.handleSearchResults(imgurAllOfResults);

      if (weightedAllOfUrls.length == 0) {
        this.slack.sendNoUrlsResponse(this.ext);
      } else {
        const url = this.selectRandom(weightedAllOfUrls);
        this.slack.sendUrlResponse(url, this.user);
      }
    }).catch((error) => {
      this.slack.sendErrorResponse();
    });
  }
}
