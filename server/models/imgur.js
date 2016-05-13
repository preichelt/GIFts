import { Base } from './base';
import rp from 'request-promise';
import _replace from 'lodash/replace';
import _each from 'lodash/each';
import _times from 'lodash/times';

export class Imgur extends Base {
  constructor(responseUrl, user, searchTerm, ext) {
    super(responseUrl, user, searchTerm, 'imgur');
    this.ext = ext;
  }

  options(searchType, page) {
    const uriBase = `http://imgur.com/search/score/all/page/${page}.json`;
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

  parseSearchData(data) {
    const urls = [];

    _each(this.reverseFilter(data, image => {
      return image.nsfw == false && image.size < 50000000;
    }), (image, index) => {
      const url = `http://i.imgur.com/${image.hash}.${this.ext}`;
      urls.push(...this.weightedUrl(url, index));
    });

    return urls;
  }

  request() {
    return Promise.all(_times(5, i => rp(this.options('all', i + 1))));
  }

  search() {
    this.request()
      .then(([allP1Res, allP2Res, allP3Res, allP4Res, allP5Res]) => {
        const allData = allP1Res.data;
        allData.push(...allP2Res.data);
        allData.push(...allP3Res.data);
        allData.push(...allP4Res.data);
        allData.push(...allP5Res.data);

        const weightedAllUrls = this.parseSearchData(allData);

        if (weightedAllUrls.length == 0) {
          rp(this.options('any', 1))
            .then(anyRes => {
              const anyData = anyRes.data;
              const weightedAnyUrls = this.parseSearchData(anyData);

              if (weightedAnyUrls.length == 0) {
                this.slack.sendNoUrlsResponse(this.ext);
              } else {
                const url = this.selectRandom(weightedAnyUrls);
                this.slack.sendUrlResponse(url, this.user);
              }
            })
            .catch(error => {
              this.slack.sendErrorResponse();
            });
        } else {
          const url = this.selectRandom(weightedAllUrls);
          this.slack.sendUrlResponse(url, this.user);
        }
      })
      .catch(error => {
        this.slack.sendErrorResponse();
      });
  }
}
