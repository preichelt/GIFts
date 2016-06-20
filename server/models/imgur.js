import { Base } from './base';
import rp from 'request-promise';
import _replace from 'lodash/replace';
import _each from 'lodash/each';
import _times from 'lodash/times';

export class Imgur extends Base {
  constructor(opts) {
    super(opts);
    this.ext = opts.ext;
    this.rp = rp;
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
      const imageId = image.hash;
      const url = `http://i.imgur.com/${imageId}.${this.ext}`;
      urls.push(...this.weightedUrl(
        {
          site: 'imgur',
          id: imageId,
          image_url: url
        },
        index
      ));
    });

    return urls;
  }

  request() {
    return Promise.all(_times(5, i => this.rp(this.options('all', i + 1))));
  }

  search() {
    this.request()
      .then(([allP1Res, allP2Res, allP3Res, allP4Res, allP5Res]) => {
        const allData = [
          ...(allP1Res.data),
          ...(allP2Res.data),
          ...(allP3Res.data),
          ...(allP4Res.data),
          ...(allP5Res.data)
        ];

        const weightedAllUrls = this.parseSearchData(allData);

        if (weightedAllUrls.length == 0) {
          this.rp(this.options('any', 1))
            .then(anyRes => {
              const anyData = anyRes.data;
              const weightedAnyUrls = this.parseSearchData(anyData);

              if (weightedAnyUrls.length == 0) {
                this.sendNoUrlsResponse(this.ext);
              } else {
                const url = this.selectRandom(weightedAnyUrls);
                this.sendDataResponse(url);
              }
            })
            .catch(error => {
              this.sendErrorResponse();
            });
        } else {
          const url = this.selectRandom(weightedAllUrls);
          this.sendDataResponse(url);
        }
      })
      .catch(error => {
        this.sendErrorResponse();
      });
  }
}
